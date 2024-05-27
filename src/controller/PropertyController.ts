import { log } from "console";
import prisma from "../clientInstance";
import { Paginate } from "../middlewares/middleware.index";
import { exclude } from "../worker";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dj6k28np4",
  api_key: 868967674589778,
  api_secret: "M4RY3CQM3ANrcbHceNMn_wOM8qg",
});

class PropertyClass {
  public async create(req, res) {
    const createdAt = new Date();
    const landed_property =
      typeof req.body.landed_property !== "boolean"
        ? Boolean(req.body.landed_property)
        : req.body.landed_property;
    let formatCityStringToLowerCase = req.body.city.toLowerCase()
    req.body = {
      ...req.body,
      city: formatCityStringToLowerCase,
      createdAt: createdAt,
      updatedAt: createdAt,
      landed_property: landed_property,
      user_id: Number(req.body.user_id),
      images: typeof req.files.images === 'undefined' || typeof req.files.images === 'string' ? [] : req.files.images
    };
    const isAuctionExist = req.body.hasOwnProperty("auction")
      ? req.body.auction
      : false;
    const display_img_buffer =
      req.files.length > 0
        ? req.files.display_img[0].buffer.toString("base64")
        : "";
    try {
      if (!isAuctionExist) {
        if (
          typeof req.body.price !== "undefined" ||
          typeof req.body.price_per_annum !== "undefined" ||
          typeof req.body.price_per_month !== "undefined"
        ) {
          if (typeof req.files.display_img !== "undefined") {
            let result = await cloudinary.uploader.upload(
              `data:image/png;base64,${display_img_buffer}`,
              {
                folder: "display_img",
              }
            );
                req.body = {
                    ...req.body,
                    display_img: result.secure_url,
                };
          }

          if (typeof req.files.images !== "undefined") {
            let images = req.files.images.map(async (file) => {
              let result = await cloudinary.uploader.upload(
                `data:image/png;base64,${file.buffer.toString("base64")}`,
                {
                  folder: "property_gallery",
                }
              );

              return result.secure_url;
            });
          const results_images = await await Promise.all(images);
          req.body = {
            ...req.body,
            // images: results_images,
          };
          }

          const prices = ["price", "price_per_annum", "price_per_month"];
          for (let i = 0; i < prices.length; i++) {
            const element = prices[i];
            if (typeof req.body[element] !== "undefined") {
              req.body = {
                ...req.body,
                [element]: req.body[element].toString(),
              };
            }else res.status(400).send('Add Price or Price Per Annum or Price Per Month to your property')
          }
          const property = await prisma.property.create({ data: req.body });
          res.status(200).send({
            message: "Property successfully created",
            property: property,
          });
        } else throw new Error();
      }
    } catch (error: any) {
      if (typeof error.message === "undefined") {
        res.status(400).send({ message: error });
      } else res.status(400).send({ message: error.message });
    }
  }

  public async updateProperty(req, res) {
    const property_id = Number(req.params.id);
    const user_id = Number(req.query.user_id)
    var new_data_update = req.body;
    try {
      const property = await prisma.property.findUnique({
        where: { id: property_id, user_id: user_id },
      });
      if (property === null) {
        // exists the try block if property does not exist in db
        throw new Error('Property does not exist with such Agent/Organization');
      }

      const prices = ["price", "price_per_annum", "price_per_month"];
      for (let i = 0; i < prices.length; i++) {
        const element = prices[i];
        if (typeof new_data_update[element] !== "undefined") {
            new_data_update = { ...new_data_update, [element]: new_data_update[element].toString() };
        }
      }

      const property_update = await prisma.property.update({where: {id : property_id}, data: new_data_update})
        res.status(200).send({
            message: "Property successfully updated",
            property: property_update,
        });
    } catch (error: any) {
      res.status(401).send({
        message: error.message,
      });
    }
  }

  // function to update cloudflare images for a particula
  public async updatePropertyImageDisplay(req,res){
    const property_id = Number(req.params.id)
    const user_id = Number(req.query.user_id)
    let img_file = req.files.display_img[0]

    try {
        let property = await prisma.property.findUnique({where: {id: property_id, user_id: user_id}})
        if(property === null){
            throw new Error("Property does not exist with such Agent/Organization")
        }
        
        var display_img = await cloudinary.uploader.upload(
                        `data:image/png;base64,${img_file.buffer.toString("base64")}`,
                        {
                          folder: "display_img",
                        }
                    )

        let updatedProperty = await prisma.property.update({where: {id: property.id}, data : {display_img: display_img.secure_url}})
        res.status(200).send({message: 'Image updated successfully', property: updatedProperty}) 
    } catch (error: any) {
        if (typeof error.message == "undefined") {
            res.status(400).send({ message: error });
          } else res.status(400).send({message: error.message });
    }
  }

// function to update cloudflare images for a particula
  public async updatePropertyGallery(req,res){
    const property_id = Number(req.params.id)
    const user_id = Number(req.query.user_id)
    let imagesFiles = req.files
    const MaxImage = 5

    let uploadImageErrorMessage = ''
    console.log(imagesFiles)
    try {
        let property = await prisma.property.findUnique({where: {id: property_id, user_id: user_id}})
        if(property === null){
            throw new Error("Property does not exist  with such Agent/Organization")
        }
        
        let imagesCount = property?.images.length
        let uploadImageErrorMessage = MaxImage - imagesCount < 1 ? 
        "You can only upload a maximum of 5 images. You can not upload more images" :
        `You can only upload a maximum of 5 images. Upload ${MaxImage - imagesCount} or less images `
        if(imagesFiles.length <= (MaxImage - imagesCount)){
            var images = imagesFiles.map( async file => {
                    var result = await cloudinary.uploader.upload(
                        `data:image/png;base64,${file.buffer.toString("base64")}`,
                        {
                          folder: "property_gallery",
                        }
                    );

                return result.secure_url
            }) 
        }else throw new Error(uploadImageErrorMessage)

        let concatImageArr = property.images.concat(await Promise.all(images))
        property.images = concatImageArr
        let updatedProperty = await prisma.property.update({where: {id: property.id}, data : property})
        res.status(200).send({message: 'Image updated successfully', property: updatedProperty})
    } catch (error: any) {
        if (typeof error.message == "undefined") {
            res.status(400).send({ message: error });
          } else res.status(400).send({message: error.message });
    }
  }

  public async getPropertyByUser(req, res) {
    const user_id = req.params.id;
    try {
      const properties = await prisma.property.findMany({
        where: { user_id: user_id },
      });
      const agent_info = await prisma.user.findUnique({
        where: { id: user_id },
      });

      if (properties.length < 1) {
        res.status(200).send({
          message: "No listed Property by this Agent",
        });
      } else {
        res.status(200).send({
          properties: properties,
          user: agent_info,
        });
      }
    } catch (error: any) {
      res.status(401).send({
        message: error.message,
      });
    }
  }

  public async getPropertyById(req, res) {
    const property_id = Number(req.params.id);
    try {
      const property = await prisma.property.findUnique({
        where: { id: property_id },
      });
      if (property === null) {
        throw new Error("Property does not exist");
      }
      const agent_info = await prisma.user.findUnique({
        where: { id: property?.user_id },
      });
      res.status(200).send({
        property: property,
        agent: exclude(agent_info, "password"),
      });
    } catch (error: any) {
      res.status(401).send({
        message: error.message,
      });
    }
  }

  public async getProperties(req, res) {
    try {
      let propertyUserAssociate: any[] = []
      let property = await prisma.property.findMany();
      for (let i = 0; i < property.length; i++) {
        const element = property[i];
        let user = await prisma.user.findUnique({where : {id: Number(element.user_id)}})
        let modifypropItem = {...element, agent: {id: user?.id,firstname: user?.firstname}}
        propertyUserAssociate.push(modifypropItem)
      }
      res.status(200).send({
        property: Paginate(Number(req.query.page),Number(req.query.limit), propertyUserAssociate),
      });
    } catch (error: any) {
      res.status(401).send({
        message: error.message,
      });
    }
  }

  public async getPropertiesByUser(req, res) {
    const id = Number(req.params.id)
    try {
      const property = await prisma.property.findMany({where: {user_id: id}});
      res.status(200).send({
        property: property,
      });
    } catch (error: any) {
      res.status(401).send({
        message: error.message,
      });
    }
  }

  public async deletePropertyById(req, res) {
    const property_id = Number(req.params.id);
    const user_id = Number(req.query.user_id)
    try {
      const property = await prisma.property.findUnique({
        where: { id: property_id, user_id: user_id },
      });
      if (property === null) {
        throw new Error("Access to delete property denied");
      }

      await prisma.property.delete({ where: { id: property_id } });
      res.status(200).send({
        message: "Property successfully deleted",
      });
    } catch (error: any) {
        if (typeof error.message == "undefined") {
            res.status(400).send({ message: error });
          } else res.status(400).send({message: error.message });
    }
  }

  public async searchProperty(req,res){
    let queryData = {
      city: req.body?.city,
      state: req.body?.state
    }
    const budget = Number(req.body.budget)

    let elementToQuery:any = {}

    for (const key in queryData) {
      let val = queryData[key]

      if(val !== undefined){
        elementToQuery = {...elementToQuery, [key]: val}
      }
    }

    try {
        const result = await prisma.property.findMany({
          where:elementToQuery
        })

      let data:any[] = []
      if(budget > 0){
        let filterByBudget = result.filter(item => Number(item[req.body.price_type]) <= budget && item[req.body.price_type] !== null)
        data = filterByBudget
      } 

      res.status(200).send({
        data: data.length > 0 ? data : result, 
        count:data.length > 0 ? data.length : result.length})
    } catch (error: any) {
      res.status(400).send({'error': error?.message})
    }
  }
}

export default PropertyClass;
