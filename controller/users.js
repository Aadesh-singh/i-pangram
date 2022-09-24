const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt')
const UserModel = require('../model/users');

const createUser = async (req, res) => {
    try {
        // req.body.email = req.body.email.toLowerCase();
        let userData = await UserModel.findOne({email: req.body.email});
        if(!userData){
            // var token = crypto.randomBytes(48).toString('hex');
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(req.body.password, salt);
            userData = await UserModel.create({
                name: req.body.name,
                email: req.body.email,
                password: password,
                visiblePass: req.body.password,
                userType: req.body.type
            });
            let tokenValue = await jwt.sign({userId: userData._id, email: userData.email}, 'ipangramJsonTopSecret');

            return res.status(200).json({
                result: true,
                msg: `${req.body.type} created Successfully`,
                user: userData,
                token: tokenValue
            });
        } else {
            return res.status(200).json({
                result: true,
                msg: `${req.body.type}'s email Already registered`,
                token: '----'
            });
        }

    } catch (error) {
        console.log('error in creating user' ,error);
        return res.status(200).json({
            result: false,
            msg: 'Error in creating user',
            token: '----'
        })
    }
}

const userLogin = async (req, res) => {
    try {
        let user = await UserModel.findOne({email: req.body.email});
        if(!user){
            return res.status(200).json({
                result: true,
                msg: 'Email not registered pls create an account',
                token: '----'
            });
        }
        let checkPassword = await bcrypt.compare(req.body.password, user.password);
        if(!checkPassword){
            return res.status(200).json({
                result: true,
                msg: 'Invalid Credentials'
            });
        }
        const token = await jwt.sign({ userId: user._id, email: user.email }, "ipangramJsonTopSecret");
        return res.status(200).json({
            result: true,
            msg: `${user.userType} logged in succesfully`,
            user: user,
            token: token
        });
    } catch (error) {
        console.log('Error in logging in user: ', error);
        return res.status(200).json({
            result: false,
            msg: 'Error in loggin in user',
            token: '----'
        });
    }
}

module.exports = {
    createUser,
    userLogin
}