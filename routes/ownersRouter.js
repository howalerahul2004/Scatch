const c = require('config');
const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner');
const productModel = require('../models/product');

// Create owner (only in development mode)
if(process.env.NODE_ENV === "development"){
    router.post("/create", async function(req, res){
        try{
            let owners = await ownerModel.find();
            if(owners.length > 0){
                return res.status(500).send("You don't have permissions to create a new owner");
            }
            let {fullname, email, password} = req.body;
            let createdOwner = await ownerModel.create({
                fullname,
                email,
                password
            });
            res.status(201).send(createdOwner);
        }catch(err){
            res.status(500).send(err.message);
        }
    });
}

// Admin dashboard - show form to create products
router.get("/admin", async function(req, res){
    let success = req.flash("success") || [];
    res.render("createproducts", {success, user: undefined});
});

module.exports = router;
