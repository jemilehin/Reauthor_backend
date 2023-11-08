import prisma from "../clientInstance";
import { exclude } from "../worker";
const bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");

class User {
  public async create(req, res) {
    const usertype = req.body.usertype;
    let newuser = req.body;
    if(req.body.password !== ''){
      const hashpassword = bcrypt.hashSync(newuser.password, 10)
      newuser.password = hashpassword
    }
    const createdAt = new Date()
    newuser = {...newuser, createdAt: createdAt, updatedAt: createdAt}
    let user:any
    
    let message = "";
    try {
      if (usertype == "Agent") {
        user = await prisma.user.create({ data: newuser });
        message = "Your account was created successfully";
      } else {
        user = await prisma.organization.create({ data: newuser });
        message = "Account created successfuly";
      }
      var token = jwt.sign({
        id: user.id
      }, process.env.SECRET_KEY, {
        expiresIn: "1D"
      });
      res.status(200).send({message: message, auth_token: token, user_id: user.id});
    } catch (error) {
      res.status(400).send({error: error, message: 'bad request'});
    }
  }

  // login function by email or phone which is unique

  public async login(req, res){
    const usertype:any  = req.query.user_type == 'organization' ? prisma.organization : prisma.user
    const login_method = req.body.hasOwnProperty('email') ? true : false
    const password = req.body.password
    let user:any = null

    try {
      if(login_method){
        user = await usertype.findUnique({
          where: {
            email : req.body.email
          }
        })
      }else {
        user = await usertype.findUnique({
          where: {
            phone: req.body.phone
          }})
      }

      const isPassword = bcrypt.compareSync(password, user.password)


      if(isPassword){
            // auth token initialization
      var token = jwt.sign({
        id: user.id
      }, process.env.SECRET_KEY, {
        expiresIn: "1D"
      });
        res.status(200).send({user: exclude(user, 'password'), auth_token: token})
      }else res.status(400).send({message: 'Password is incorrect'})
    } catch (error) {
      res.status(400).send({message: "User does not exist."})
    }
  }

  //  id and usertype must be pass to url string for query
// example '/user?user_type=Agent?user_id=2'
  public async getUser(req, res) {
    const usertype = req.query.user_type;
    const id = Number(req.query.user_id);
    let user;
    try {
      if (usertype === "agent") {
        user = await prisma.user.findUnique({
          where: {
            id: id,
          },
          
        });
      }if(usertype === "organization") {
        user = await prisma.organization.findUnique({
          where: {
            id: id,
          },
        });
      }
      res.status(200).send({user: exclude(user, 'password')})
    } catch (error) {
        res.status(400).send({data: {message:'user does not exist'}})
    }
  }
}

export default User;
