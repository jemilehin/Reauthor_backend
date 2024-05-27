import prisma from "./clientInstance";

export function exclude(object: any, keys:string){
    return Object.fromEntries(
        Object.entries(object).filter(([key]) => !keys.includes(key))
    )
}
const jwt = require('jsonwebtoken')
export async function verifyToken(req,res,next){

    const bearerHeader = req.headers["authorization"];
    try {
        if (typeof bearerHeader !== "undefined") {
            const bearerToken = bearerHeader.split(" ")[1];
            jwt.verify(bearerToken, process.env.SECRET_KEY, (err, decoded) => {
            req.user = decoded
            if(typeof decoded !== 'undefined')next()
            else throw err
            });
        }else throw new Error()
    } catch (error: any) {
        res.status(401).send({
            message: 'Unauthorized User Access',
            error: error.message
        });
    }
}
const multer = require('multer');
const storage = multer.memoryStorage()
export const upload = multer({storage: storage})