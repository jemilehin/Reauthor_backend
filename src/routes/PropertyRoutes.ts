import {Router} from 'express'
import multer from 'multer'
import PropertyClass from '../controller/PropertyController'
import { verifyToken, upload } from '../worker'

const router = Router()
const propertyClass = new PropertyClass()
// === current working api === //
router.post('/create', verifyToken, 
    upload.fields([{
        name: 'display_img', maxCount: 1
      }, {
        name: 'images', maxCount: 5
      }]),
propertyClass.create
)
router.get('/:id', propertyClass.getPropertyById)
router.get('/', propertyClass.getProperties)
router.delete('/delete/:id', verifyToken, propertyClass.deletePropertyById)
router.put('/edit/:id', verifyToken, propertyClass.updateProperty)
router.get('/public/user/:id', propertyClass.getPropertiesByUser)
router.get('/user/:id', verifyToken, propertyClass.getPropertiesByUser)
router.post('/search', propertyClass.searchProperty)
router.put('/display_image/:id', verifyToken, upload.fields([{name: 'display_img', maxCount: 1}]), propertyClass.updatePropertyImageDisplay)
router.put('/images/:id', verifyToken, (req, res) => {
  let imagesupload = upload.array('images', 5)
  imagesupload(req,res, function(err){
    if (err instanceof multer.MulterError) {
      return res.status(400).send(err)
    } else if (err) {
      return res.status(400).send(err)
    }
    propertyClass.updatePropertyGallery(req,res)
  });
})
// -----------------------------

// test new api below 
// -----------------------------

// test new api below with internet


export default router