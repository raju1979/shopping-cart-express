const express = require('express');
const router = express.Router();

const User = require("../models/User");
const mongoose = require("mongoose");

const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var randtoken = require('rand-token');

router.post("/", (req, res) => {

    let userDataRaw = JSON.stringify(req.body);
    let userData = JSON.parse(userDataRaw);

    let saltedPass = bcrypt.hashSync(userData.password, salt);

    userData.password = saltedPass;

    let token = randtoken.generate(16);

    userData["emailVerficationToken"] = token;

    let user = new User(userData);

    user.save((err, saveData) => {
        if (err) {
            res.json(err)
        } else {
            const msg = {
                to: userData.email,
                from: 'admin@hybridappwala.com',
                subject: 'Please Verify you Email',
                text: 'Please Verify you Email',
                html: `<p>Your security code is ${token}</p>`,
            };
            sgMail.send(msg);
            res.json(saveData)
        }
    })

})


router.post("/verify", (req, res) => {

    let userDataRaw = JSON.stringify(req.body);
    let userData = JSON.parse(userDataRaw);

    User.findOne({
        email: userData.email,
        emailVerficationToken: userData.code
    }, (err, user) => {
        if (!err) {
            if (user == null) {
                res.json({
                    "success": false,
                    "reason": "No User Found"
                })
            } else {
                user.emailVerified = true;
                user.emailVerficationToken = "";
                user.save();
                res.json({
                    "success": true,
                    "data": user
                })
            }

        }
    })

})

router.post("/login", (req, res) => {

    let userDataRaw = JSON.stringify(req.body);
    let userData = JSON.parse(userDataRaw);





    User.findOne({
        email: userData.email
    }, (err, user) => {
        if (!err) {
            if (user == null) {
                res.json({
                    "success": false,
                    "errorcode": 2,
                    "reason": "No User Found",
                    "salted": saltedPass
                })
            } else {
                bcrypt.compare(userData.password, user.password, function(err, result) {
                    if (result) {
                        // Passwords match
                        if (user.emailVerified) {
                            res.json({
                                "success": true,
                                "user": user
                            })
                        } else {
                            res.json({
                                "success": false,
                                "errorcode": 4,
                                "reason": "Email No Verfied"
                            })
                        }

                    } else {
                        // Passwords don't match
                        res.json({
                            "success": false,
                            "errorcode": 3,
                            "reason": "Password not matched"
                        })
                    }
                });
                // if(user.emailVerified == false){
                //   res.json({"success":false,"errorcode":3,"reason":"Email No Verfied","verfied":user.emailVerified})
                // }
                // res.json({"success":true,"user":user,"salted":saltedPass})
            }

        }
    })

})


module.exports = router;