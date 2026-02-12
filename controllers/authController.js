const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../utils/generateToken');

module.exports.registerUser = async function(req, res){
    try{
        let{email, password, fullname} = req.body;
            let user = await userModel.findOne({email: email});
            if(user) {
                req.flash("error", "user already exists");
                return res.redirect("/users/register");
            }

            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(password, salt, async function(err, hash){
                    if(err) return res.send(err.message);
                    else {
                        let user = await userModel.create({
                            email,
                            password : hash,
                            fullname
                        });
                        
                        let token = generateToken(user);
                        res.cookie("token", token);
                        req.flash("success", "user created successfully");
                        res.redirect("/shop");
                    }
                });
            });
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/users/register");
    }
};

module.exports.loginUser = async function(req, res){
    let {email, password} = req.body;
    let user = await userModel.findOne({email: email});
    if(!user) {
        req.flash("error", "Email or password is incorrect");
        return res.redirect("/users/login");
    }
    bcrypt.compare(password, user.password, function(err, result){
        if(err) {
            req.flash("error", err.message);
            return res.redirect("/users/login");
        }
        if(result){
            let token = generateToken(user);
            res.cookie("token", token);
            req.flash("success", "user logged in successfully");
            res.redirect("/shop");
        }else{
            req.flash("error", "Email or password is incorrect");
            res.redirect("/users/login");
        }
    });
};

module.exports.logoutUser = function(req, res){
    res.clearCookie("token");
    req.flash("success", "logged out successfully");
    res.redirect("/");
};