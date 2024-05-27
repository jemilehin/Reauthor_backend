"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clientInstance_1 = __importDefault(require("../clientInstance"));
const middleware_index_1 = require("../middlewares/middleware.index");
const worker_1 = require("../worker");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: "dj6k28np4",
    api_key: 868967674589778,
    api_secret: "M4RY3CQM3ANrcbHceNMn_wOM8qg",
});
class PropertyClass {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAt = new Date();
            const landed_property = typeof req.body.landed_property !== "boolean"
                ? Boolean(req.body.landed_property)
                : req.body.landed_property;
            let formatCityStringToLowerCase = req.body.city.toLowerCase();
            req.body = Object.assign(Object.assign({}, req.body), { city: formatCityStringToLowerCase, createdAt: createdAt, updatedAt: createdAt, landed_property: landed_property, user_id: Number(req.body.user_id), images: typeof req.files.images === 'undefined' || typeof req.files.images === 'string' ? [] : req.files.images });
            const isAuctionExist = req.body.hasOwnProperty("auction")
                ? req.body.auction
                : false;
            const display_img_buffer = req.files.length > 0
                ? req.files.display_img[0].buffer.toString("base64")
                : "";
            try {
                if (!isAuctionExist) {
                    if (typeof req.body.price !== "undefined" ||
                        typeof req.body.price_per_annum !== "undefined" ||
                        typeof req.body.price_per_month !== "undefined") {
                        if (typeof req.files.display_img !== "undefined") {
                            let result = yield cloudinary.uploader.upload(`data:image/png;base64,${display_img_buffer}`, {
                                folder: "display_img",
                            });
                            req.body = Object.assign(Object.assign({}, req.body), { display_img: result.secure_url });
                        }
                        if (typeof req.files.images !== "undefined") {
                            let images = req.files.images.map((file) => __awaiter(this, void 0, void 0, function* () {
                                let result = yield cloudinary.uploader.upload(`data:image/png;base64,${file.buffer.toString("base64")}`, {
                                    folder: "property_gallery",
                                });
                                return result.secure_url;
                            }));
                            const results_images = yield yield Promise.all(images);
                            req.body = Object.assign({}, req.body);
                        }
                        const prices = ["price", "price_per_annum", "price_per_month"];
                        for (let i = 0; i < prices.length; i++) {
                            const element = prices[i];
                            if (typeof req.body[element] !== "undefined") {
                                req.body = Object.assign(Object.assign({}, req.body), { [element]: req.body[element].toString() });
                            }
                        }
                        const property = yield clientInstance_1.default.property.create({ data: req.body });
                        res.status(200).send({
                            message: "Property successfully created",
                            property: property,
                        });
                    }
                    else
                        throw new Error();
                }
            }
            catch (error) {
                if (typeof error.message === "undefined") {
                    res.status(400).send({ message: error });
                }
                else
                    res.status(400).send({ message: error.message });
            }
        });
    }
    updateProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const property_id = Number(req.params.id);
            const user_id = Number(req.query.user_id);
            var new_data_update = req.body;
            try {
                const property = yield clientInstance_1.default.property.findUnique({
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
                        new_data_update = Object.assign(Object.assign({}, new_data_update), { [element]: new_data_update[element].toString() });
                    }
                }
                const property_update = yield clientInstance_1.default.property.update({ where: { id: property_id }, data: new_data_update });
                res.status(200).send({
                    message: "Property successfully updated",
                    property: property_update,
                });
            }
            catch (error) {
                res.status(401).send({
                    message: error.message,
                });
            }
        });
    }
    // function to update cloudflare images for a particula
    updatePropertyImageDisplay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const property_id = Number(req.params.id);
            const user_id = Number(req.query.user_id);
            let img_file = req.files.display_img[0];
            try {
                let property = yield clientInstance_1.default.property.findUnique({ where: { id: property_id, user_id: user_id } });
                if (property === null) {
                    throw new Error("Property does not exist with such Agent/Organization");
                }
                var display_img = yield cloudinary.uploader.upload(`data:image/png;base64,${img_file.buffer.toString("base64")}`, {
                    folder: "display_img",
                });
                let updatedProperty = yield clientInstance_1.default.property.update({ where: { id: property.id }, data: { display_img: display_img.secure_url } });
                res.status(200).send({ message: 'Image updated successfully', property: updatedProperty });
            }
            catch (error) {
                if (typeof error.message == "undefined") {
                    res.status(400).send({ message: error });
                }
                else
                    res.status(400).send({ message: error.message });
            }
        });
    }
    // function to update cloudflare images for a particula
    updatePropertyGallery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const property_id = Number(req.params.id);
            const user_id = Number(req.query.user_id);
            let imagesFiles = req.files;
            const MaxImage = 5;
            let uploadImageErrorMessage = '';
            console.log(imagesFiles);
            try {
                let property = yield clientInstance_1.default.property.findUnique({ where: { id: property_id, user_id: user_id } });
                if (property === null) {
                    throw new Error("Property does not exist  with such Agent/Organization");
                }
                let imagesCount = property === null || property === void 0 ? void 0 : property.images.length;
                let uploadImageErrorMessage = MaxImage - imagesCount < 1 ?
                    "You can only upload a maximum of 5 images. You can not upload more images" :
                    `You can only upload a maximum of 5 images. Upload ${MaxImage - imagesCount} or less images `;
                if (imagesFiles.length <= (MaxImage - imagesCount)) {
                    var images = imagesFiles.map((file) => __awaiter(this, void 0, void 0, function* () {
                        var result = yield cloudinary.uploader.upload(`data:image/png;base64,${file.buffer.toString("base64")}`, {
                            folder: "property_gallery",
                        });
                        return result.secure_url;
                    }));
                }
                else
                    throw new Error(uploadImageErrorMessage);
                let concatImageArr = property.images.concat(yield Promise.all(images));
                property.images = concatImageArr;
                let updatedProperty = yield clientInstance_1.default.property.update({ where: { id: property.id }, data: property });
                res.status(200).send({ message: 'Image updated successfully', property: updatedProperty });
            }
            catch (error) {
                if (typeof error.message == "undefined") {
                    res.status(400).send({ message: error });
                }
                else
                    res.status(400).send({ message: error.message });
            }
        });
    }
    getPropertyByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = req.params.id;
            try {
                const properties = yield clientInstance_1.default.property.findMany({
                    where: { user_id: user_id },
                });
                const agent_info = yield clientInstance_1.default.user.findUnique({
                    where: { id: user_id },
                });
                if (properties.length < 1) {
                    res.status(200).send({
                        message: "No listed Property by this Agent",
                    });
                }
                else {
                    res.status(200).send({
                        properties: properties,
                        user: agent_info,
                    });
                }
            }
            catch (error) {
                res.status(401).send({
                    message: error.message,
                });
            }
        });
    }
    getPropertyById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const property_id = Number(req.params.id);
            try {
                const property = yield clientInstance_1.default.property.findUnique({
                    where: { id: property_id },
                });
                if (property === null) {
                    throw new Error("Property does not exist");
                }
                const agent_info = yield clientInstance_1.default.user.findUnique({
                    where: { id: property === null || property === void 0 ? void 0 : property.user_id },
                });
                res.status(200).send({
                    property: property,
                    agent: (0, worker_1.exclude)(agent_info, "password"),
                });
            }
            catch (error) {
                res.status(401).send({
                    message: error.message,
                });
            }
        });
    }
    getProperties(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let propertyUserAssociate = [];
                let property = yield clientInstance_1.default.property.findMany();
                for (let i = 0; i < property.length; i++) {
                    const element = property[i];
                    let user = yield clientInstance_1.default.user.findUnique({ where: { id: Number(element.user_id) } });
                    let modifypropItem = Object.assign(Object.assign({}, element), { agent: { id: user === null || user === void 0 ? void 0 : user.id, firstname: user === null || user === void 0 ? void 0 : user.firstname } });
                    propertyUserAssociate.push(modifypropItem);
                }
                res.status(200).send({
                    property: (0, middleware_index_1.Paginate)(Number(req.query.page), Number(req.query.limit), propertyUserAssociate),
                });
            }
            catch (error) {
                res.status(401).send({
                    message: error.message,
                });
            }
        });
    }
    getPropertiesByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            try {
                const property = yield clientInstance_1.default.property.findMany({ where: { user_id: id } });
                res.status(200).send({
                    property: property,
                });
            }
            catch (error) {
                res.status(401).send({
                    message: error.message,
                });
            }
        });
    }
    deletePropertyById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const property_id = Number(req.params.id);
            const user_id = Number(req.query.user_id);
            try {
                const property = yield clientInstance_1.default.property.findUnique({
                    where: { id: property_id, user_id: user_id },
                });
                if (property === null) {
                    throw new Error("Access to delete property denied");
                }
                yield clientInstance_1.default.property.delete({ where: { id: property_id } });
                res.status(200).send({
                    message: "Property successfully deleted",
                });
            }
            catch (error) {
                if (typeof error.message == "undefined") {
                    res.status(400).send({ message: error });
                }
                else
                    res.status(400).send({ message: error.message });
            }
        });
    }
    searchProperty(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let queryData = {
                city: (_a = req.body) === null || _a === void 0 ? void 0 : _a.city,
                state: (_b = req.body) === null || _b === void 0 ? void 0 : _b.state
            };
            const budget = Number(req.body.budget);
            let elementToQuery = {};
            for (const key in queryData) {
                let val = queryData[key];
                if (val !== undefined) {
                    elementToQuery = Object.assign(Object.assign({}, elementToQuery), { [key]: val });
                }
            }
            try {
                const result = yield clientInstance_1.default.property.findMany({
                    where: elementToQuery
                });
                let data = [];
                if (budget > 0) {
                    let filterByBudget = result.filter(item => Number(item[req.body.price_type]) <= budget && item[req.body.price_type] !== null);
                    data = filterByBudget;
                }
                res.status(200).send({
                    data: data.length > 0 ? data : result,
                    count: data.length > 0 ? data.length : result.length
                });
            }
            catch (error) {
                res.status(400).send({ 'error': error === null || error === void 0 ? void 0 : error.message });
            }
        });
    }
}
exports.default = PropertyClass;
//# sourceMappingURL=PropertyController.js.map