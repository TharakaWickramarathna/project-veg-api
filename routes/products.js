const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/products')
const fs= require('fs');
const hero = require('../extras/scripts')
//Multer Things
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null,  new Date().toISOString().replace(/:/g, '-')+ file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else { 
        cb(null, false)
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: fileFilter

});



//insert a new product
router.post('/add', upload.single('productImage'), (req, res, next) => {

    
    let newProduct = new Product({
        productName: req.body.productName,
        unitPrice: req.body.unitPrice,
        minimumOrder: req.body.minimumOrder,
        category: req.body.category,
        availability: req.body.availability,
        imgSrc: req.file.filename
    });
    
  
    newProduct.save()
        .then(() => {
            res.status(201).json({
                success: 'true',
                msg: 'Product Added Success.!'
            });
        })
        .catch((err) => {
            res.status(400).json({
                success: 'false',
                msg: 'Product Added Failed .!'
            });
        });
});

//Fetch all the products Result is an object array

router.get('/all', async(req, res, next) => {
try{
    const product = await Product.find()
    const finalResult = hero.productGetElement(product);

    res.status(200).json(finalResult)
}catch(err){
    res.status(404).json({message: err});
}
    

});

//Get product by id result is a single object

router.get('/:id', async (req, res, next) => {
try{
    const product= await Product.findById(req.params.id);
    const imageSource= './uploads/'+product.imgSrc;
    res.json({
        _id: product._id,
        productName: product.productName,
        unitPrice : product.unitPrice,
        minimumOrder : product.minimumOrder,
        category: product.category,
        availability : product.availability,
        imgSrc : imageSource
    })
}catch (err){
    res.status(404).json({message:err})
}
    
    
});

//Delete a Product by the ID 
router.delete('/:id', async(req,res,next)=>{
    try {
        const getProduct = await Product.findById(req.params.id);
        const filePath = './uploads/'+getProduct.imgSrc;

        fs.unlink(filePath, (err, data) =>{
            if (err) throw err
        })

        const deletedProduct = await Product.deleteOne({ _id: req.params.id });
        res.status(201).json({message: 'Successfully Deleted'});


    } catch (err) {
        res.status(404).json({ message: err });
    }

});

//Update Product Image
router.patch('/updateProductImage/:id', upload.single('productImage'),async(req,res,next)=>{
    try{
        
        const getMatchingProduct = await Product.findById(req.params.id);
        const imageSrc= './uploads/'+getMatchingProduct.imgSrc;
        fs.unlink(imageSrc, (err,data)=>{
            if (err) throw err
        })
        const imgSource = req.file.filename;
        const updateProduct = await Product.updateOne({_id: req.params.id},{
            $set:{
                imgSrc: imgSource
            }
        })
        res.json('Successfully Edited')
    }catch(err) {
        res.json({message: err})
    }
})

//Edit Product Information Accepts any kind of Product Object
router.patch('/update/:id', async(req,res,next)=>{
    try{
       
        const passObject = hero.createUpdateObject(req.body);
        const updateProduct = await Product.updateOne({_id: req.params.id},
            {$set: passObject})
    res.status(200).json('Successfullly Edited')
    }

    catch(err){
        res.status(404).json({message: err})
    }
})
module.exports = router;