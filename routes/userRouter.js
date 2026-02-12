const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logoutUser} = require("../controllers/authController");
const isLoggedIn = require('../middlewares/isLoggedIn');

router.get("/register", function(req, res){
    let error = req.flash("error") || [];
    res.render("register", {error, user: undefined});
});

router.get("/login", function(req, res){
    let error = req.flash("error") || [];
    res.render("login", {error, user: undefined});
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logoutUser);

module.exports = router;