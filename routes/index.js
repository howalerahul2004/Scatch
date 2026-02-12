const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const userModel = require('../models/user');
const productModel = require('../models/product');
const orderModel = require('../models/order');
const wishlistModel = require('../models/wishlist');

router.get("/", function(req, res){
    let error = req.flash("error") || [];
    res.render("index", {error, loggedin: false, user: undefined});
});

router.get("/shop", isLoggedIn, async function(req, res){
    try {
        let search = req.query.search || '';
        let collection = req.query.collection || '';
        let filterType = req.query.filter || '';
        let sortby = req.query.sortby || 'popular';
        // Build Mongo query using $and so multiple filters combine correctly
        let andClauses = [];

        // Search filter
        if(search && search.trim()) {
            andClauses.push({
                $or: [ { name: { $regex: search, $options: 'i' } } ]
            });
        }

        // Collection filters
        if(collection === 'new') {
            andClauses.push({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
        } else if(collection === 'discounted') {
            andClauses.push({ discount: { $gt: 0 } });
        }

        // Availability filter - effective price (price - discount) > 0
        if(filterType === 'availability') {
            andClauses.push({ $expr: { $gt: [ { $subtract: [ { $ifNull: ["$price", 0] }, { $ifNull: ["$discount", 0] } ] }, 0 ] } });
        }

        // Discount filter - only show discounted products
        if(filterType === 'discount') {
            andClauses.push({ discount: { $gt: 0 } });
        }

        // Final query
        let finalQuery = andClauses.length > 0 ? { $and: andClauses } : {};

        let products = await productModel.find(finalQuery);

        // Apply JS-side sorting for price-based sorts because effective price is derived
        if(sortby === 'price-low') {
            products.sort((a, b) => ((a.price || 0) - (a.discount || 0)) - ((b.price || 0) - (b.discount || 0)));
        } else if(sortby === 'price-high') {
            products.sort((a, b) => ((b.price || 0) - (b.discount || 0)) - ((a.price || 0) - (a.discount || 0)));
        } else if(sortby === 'newest') {
            products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        let success = req.flash("success");
        let user = await userModel.findOne({email: req.user.email});
        res.render("shop", {products, success, search: search || '', user, collection, filterType, sortby});
    } catch(err) {
        console.error(err);
        req.flash("error", "Error loading products");
        res.redirect("/");
    }
});

router.get("/cart", isLoggedIn, async function(req, res){
    let user = await userModel
        .findOne({email: req.user.email})
        .populate("cart");
    
    let totalMRP = 0;
    let totalDiscount = 0;
    
    if(user.cart && user.cart.length > 0) {
        user.cart.forEach(item => {
            totalMRP += item.price;
            totalDiscount += item.discount || 0;
        });
    }
    
    let platformFee = user.cart.length > 0 ? 20 : 0;
    let shippingFee = 0;
    let totalAmount = totalMRP - totalDiscount + platformFee + shippingFee;
    
    res.render("cart", {
        products: user.cart,
        totalMRP,
        totalDiscount,
        platformFee,
        shippingFee,
        totalAmount,
        user
    });
});

router.get("/account", isLoggedIn, async function(req, res){
    let user = await userModel.findOne({email: req.user.email});
    res.render("account", {user});
});

router.get("/addtocart/:productid", isLoggedIn, async function(req, res){
    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "added to cart");
    res.redirect("/shop");
});

router.get("/removefromcart/:productid", isLoggedIn, async function(req, res){
    let user = await userModel.findOne({email: req.user.email});
    user.cart = user.cart.filter(item => item.toString() !== req.params.productid);
    await user.save();
    req.flash("success", "removed from cart");
    res.redirect("/cart");
});

router.post("/checkout", isLoggedIn, async function(req, res){
    try {
        let {shippingAddress, paymentMethod} = req.body;
        let user = await userModel
            .findOne({email: req.user.email})
            .populate("cart");
        
        if(!user.cart || user.cart.length === 0) {
            req.flash("error", "Cart is empty");
            return res.redirect("/cart");
        }
        
        let totalMRP = 0;
        let totalDiscount = 0;
        
        user.cart.forEach(item => {
            totalMRP += item.price;
            totalDiscount += item.discount || 0;
        });
        
        let platformFee = 20;
        let shippingFee = 0;
        let totalAmount = totalMRP - totalDiscount + platformFee + shippingFee;
        
        // Create order
        let order = await orderModel.create({
            user: user._id,
            products: user.cart.map(item => item._id),
            totalAmount,
            totalMRP,
            totalDiscount,
            platformFee,
            shippingFee,
            shippingAddress: shippingAddress || "Not specified",
            paymentMethod: paymentMethod || "cod",
            status: "pending"
        });
        
        // Clear user's cart
        user.cart = [];
        user.orders = user.orders || [];
        user.orders.push(order._id);
        await user.save();
        
        req.flash("success", "Order placed successfully!");
        res.redirect("/orders");
    } catch(err) {
        req.flash("error", "Error placing order: " + err.message);
        res.redirect("/cart");
    }
});

router.get("/orders", isLoggedIn, async function(req, res){
    try {
        let user = await userModel
            .findOne({email: req.user.email})
            .populate({
                path: 'orders',
                populate: { path: 'products' }
            });
        
        res.render("orders", {orders: user.orders || [], user});
    } catch(err) {
        req.flash("error", "Error loading orders");
        res.redirect("/");
    }
});

router.get("/order/:id", isLoggedIn, async function(req, res){
    try {
        let order = await orderModel
            .findById(req.params.id)
            .populate('products')
            .populate('user');
        
        if(!order) {
            return res.status(404).send("Order not found");
        }
        
        let user = await userModel.findOne({email: req.user.email});
        res.render("orderdetail", {order, user});
    } catch(err) {
        res.send(err.message);
    }
});

router.get("/wishlist", isLoggedIn, async function(req, res){
    try {
        let user = await userModel.findOne({email: req.user.email});
        let wishlist = await wishlistModel.findOne({user: user._id}).populate("products");
        
        if(!wishlist) {
            wishlist = {products: []};
        }
        
        res.render("wishlist", {products: wishlist.products || [], user});
    } catch(err) {
        req.flash("error", "Error loading wishlist");
        res.redirect("/");
    }
});

router.get("/addtowishlist/:productid", isLoggedIn, async function(req, res){
    try {
        let user = await userModel.findOne({email: req.user.email});
        let wishlist = await wishlistModel.findOne({user: user._id});
        
        if(!wishlist) {
            wishlist = await wishlistModel.create({user: user._id, products: []});
        }
        
        if(!wishlist.products.includes(req.params.productid)) {
            wishlist.products.push(req.params.productid);
            await wishlist.save();
            req.flash("success", "Added to wishlist");
        } else {
            req.flash("error", "Already in wishlist");
        }
        
        res.redirect("/shop");
    } catch(err) {
        req.flash("error", "Error adding to wishlist");
        res.redirect("/shop");
    }
});

router.get("/removefromwishlist/:productid", isLoggedIn, async function(req, res){
    try {
        let user = await userModel.findOne({email: req.user.email});
        let wishlist = await wishlistModel.findOne({user: user._id});
        
        if(wishlist) {
            wishlist.products = wishlist.products.filter(item => item.toString() !== req.params.productid);
            await wishlist.save();
            req.flash("success", "Removed from wishlist");
        } else {
            req.flash("error", "Wishlist not found");
        }
        
        res.redirect("/wishlist");
    } catch(err) {
        req.flash("error", "Error removing from wishlist");
        res.redirect("/wishlist");
    }
});

module.exports = router;
