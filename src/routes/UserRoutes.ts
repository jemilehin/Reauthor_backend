import {Router} from 'express'
import User from '../controller/UserController'
import { verifyToken } from '../worker'

const router = Router()
const userController = new User()

router.post('/user', userController.create) // api url to register user 
router.get('/user', userController.getUser) // api url to fetch all user from db 
router.post('/login', userController.login)// api url to login registered user
router.delete('/user/delete/:id', verifyToken, userController.deleteUser)   // api url to delete user
router.put('/user/edit/:id', verifyToken, userController.updateUserDetails) // api url to edit existing user

export default router