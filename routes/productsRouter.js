const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product');

// Get all products for admin
router.get("/", async function(req, res){
    try{
        // return products sorted by newest first for admin view
        let products = await productModel.find().sort({ createdAt: -1 });
        let success = req.flash("success") || [];
        res.render("admin", {products, success, user: undefined});
    }catch(err){
        res.send(err.message);
    }
});

// Create product
router.post("/create", upload.single("image"), async function(req, res){
    try{
        let {name, price, discount, bgcolor, panecolor, textcolor, imageUrl} = req.body;
        
        let imageData;
        let imageType = 'upload';
        
        // Check if URL is provided
        if(imageUrl && imageUrl.toString().trim()) {
            imageData = imageUrl.trim();
            imageType = 'url';
        } 
        // Otherwise use uploaded file
        else if(req.file && req.file.buffer) {
            imageData = req.file.buffer;
            imageType = 'upload';
        } 
        // If neither provided, show error
        else {
            return res.status(400).send("Please provide either an image file or image URL");
        }
        
        let product = await productModel.create({
            image: imageData,
            imageType,
            name,
            price,
            discount,
            bgcolor,
            panecolor,
            textcolor
        });
        req.flash("success", "product created successfully");
        res.redirect("/products");
    }catch(err){
        res.send(err.message);
    }
});

// Delete product
router.get("/delete/:id", async function(req, res){
    try{
        await productModel.findByIdAndDelete(req.params.id);
        req.flash("success", "product deleted successfully");
        res.redirect("/products");
    }catch(err){
        res.send(err.message);
    }
});

// Get edit product form
router.get("/edit/:id", async function(req, res){
    try{
        let product = await productModel.findById(req.params.id);
        if(!product) {
            return res.status(404).send("Product not found");
        }
        let success = req.flash("success") || [];
        res.render("edit", {product, success, user: undefined});
    }catch(err){
        res.send(err.message);
    }
});

// Update product
router.post("/edit/:id", upload.single("image"), async function(req, res){
    try{
        let {name, price, discount, bgcolor, panecolor, textcolor, imageUrl} = req.body;
        let product = await productModel.findById(req.params.id);
        
        if(!product) {
            return res.status(404).send("Product not found");
        }
        
        // Update image only if new one is provided
        let imageData = product.image;
        let imageType = product.imageType || 'upload';
        
        if(imageUrl && imageUrl.toString().trim()) {
            imageData = imageUrl.trim();
            imageType = 'url';
        } else if(req.file && req.file.buffer) {
            imageData = req.file.buffer;
            imageType = 'upload';
        }
        
        // Update product
        product.name = name;
        product.price = price;
        product.discount = discount;
        product.bgcolor = bgcolor;
        product.panecolor = panecolor;
        product.textcolor = textcolor;
        product.image = imageData;
        product.imageType = imageType;
        
        await product.save();
        req.flash("success", "product updated successfully");
        res.redirect("/products");
    }catch(err){
        res.send(err.message);
    }
});

module.exports = router;
