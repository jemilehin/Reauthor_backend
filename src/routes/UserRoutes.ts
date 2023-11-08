import {Router} from 'express'
import User from '../controller/UserController'

const router = Router()
const userController = new User()

router.post('/user', userController.create)
router.get('/user', userController.getUser)
router.post('/login', userController.login)

export default router