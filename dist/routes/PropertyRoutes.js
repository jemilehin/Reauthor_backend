"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const PropertyController_1 = __importDefault(require("../controller/PropertyController"));
const worker_1 = require("../worker");
const router = (0, express_1.Router)();
const propertyClass = new PropertyController_1.default();
// === current working api === //
router.post('/create', worker_1.verifyToken, worker_1.upload.fields([{
        name: 'display_img', maxCount: 1
    }, {
        name: 'images', maxCount: 5
    }]), propertyClass.create);
router.get('/:id', propertyClass.getPropertyById);
router.get('/', propertyClass.getProperties);
router.delete('/delete/:id', worker_1.verifyToken, propertyClass.deletePropertyById);
router.put('/edit/:id', worker_1.verifyToken, propertyClass.updateProperty);
router.get('/public/user/:id', propertyClass.getPropertiesByUser);
router.get('/user/:id', worker_1.verifyToken, propertyClass.getPropertiesByUser);
router.post('/search', propertyClass.searchProperty);
router.put('/display_image/:id', worker_1.verifyToken, worker_1.upload.fields([{ name: 'display_img', maxCount: 1 }]), propertyClass.updatePropertyImageDisplay);
// -----------------------------
// test new api below 
// -----------------------------
// test new api below with internet
router.put('/images/:id', worker_1.verifyToken, (req, res) => {
    let imagesupload = worker_1.upload.array('images', 5);
    imagesupload(req, res, function (err) {
        if (err instanceof multer_1.default.MulterError) {
            return res.status(400).send(err);
        }
        else if (err) {
            return res.status(400).send(err);
        }
        // res.status(200).json(req.files);
        propertyClass.updatePropertyGallery(req, res);
    });
    // upload.fields([{name: 'images', maxCount: 5}])
});
exports.default = router;
//# sourceMappingURL=PropertyRoutes.js.map