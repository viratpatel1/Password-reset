import express from "express";
// import jwt from "jsonwebtoken";
import { passform } from "./model/pass-model.js";
import bcrypt from "bcrypt";
import sendgridTransport from "nodemailer-sendgrid-transport";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        // process.env.api_key
        api_key: process.env.key
    }
}))

// router.get("/", (req, res) =>
// {
//     res.send("Node Started Correctly Online");
// });

router.get("/", async (req, res) =>
{
    await passform.find()
        .then((re) => res.send(re))
        .catch((err) => res.send(err))
});


router.post("/", async (req, res) =>
{
    try
    {
        const { email, password } = req.body;
        if (!email || !password)
        {
            res.status(400).json({ message: "All Feild Required" });
        };

        const userlogin = await passform.findOne({ email: email });
        if (userlogin)
        {
            const isMatch = await bcrypt.compare(password, userlogin.password)
            if (!isMatch)
            {
                return res.status(400).json({ message: "Invalid Credentials" });
            } else if (isMatch)
            {
                console.log(email, password)
                return res.status(200).json({ message: "Login Successfully" })
            }
        }
        else
        {
            res.status(400).json({ message: "user Not exist" })
        }
    } catch (error)
    {
        // return 
        return res.status(400).json({ message: "Signin Wrong" })
    }


});

router.post("/signup", async (req, res) =>
{
    const { username, email, password } = req.body;
    // console.log(username, email, password)
    const salt = await bcrypt.genSalt(10);
    // const passwordHash = await bcrypt.hash(password, salt);

    try
    {
        if (!email || !username || !password) return res.status(400).json({ message: "All Feild Req" });
        const userEmail = await passform.findOne({ email });
        if (userEmail) return res.status(400).json({ message: "User Already Exist" });
        if (!userEmail)
        {
            bcrypt.hash(password, 12)
                .then(passwordHash =>
                {
                    const user = new passform({
                        username,
                        email,
                        password: passwordHash,
                    })

                    user.save()
                        .then(user =>
                        {
                            transporter.sendMail({
                                to: user.email,
                                from: "resetpass233@gmail.com",
                                subject: "Register Successfully",
                                html: "<h1>You Successfully Register to Demo Project</h1>"
                            })
                                .then(() => console.log("email send"))
                        })
                        .catch((error) => console.log(error.message))
                    res.status(200).json({ message: "Register Successfully" });
                    console.log("Register Successfully")
                });
        } else
        {
            console.log("wrong")
        }

    } catch (error)
    {
        res.status(400).json(error.message)
    }

});

router.post("/resetpassword", async (req, res) =>
{
    const { email } = req.body;
    console.log(email)
    crypto.randomBytes(32, (err, buffer) =>
    {
        if (err)
        {
            console.log(err);
        }
        const token = buffer.toString("hex");
        passform.findOne({ email: req.body.email })
            .then(user =>
            {
                if (!user)
                {
                    return res.status(422).json({ message: "User doesn't exist with this email" });
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) =>
                {
                    transporter.sendMail({
                        to: user.email,
                        from: "resetpass233@gmail.com",
                        subject: "Password Reset",
                        html: `<p>You requested to Password Reset</p>
                                <h2>Click on this <a href="https://passwords-reset.herokuapp.com/reset/${token}">link</a> to Reset Password</h2>`
                    })
                    res.json({ message: "Check Your Email" });
                });
            });
    });
    console.log(email);
});

router.post("/newpassword", async (req, res) =>
{
    const { newPassword, token } = req.body;
    const sentToken = token;
    // console.log("139", newPassword, sentToken);
    passform.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user =>
        {
            if (!user)
            {
                return res.status(400).json({ error: "Token Expired" });
            }
            bcrypt.hash(newPassword, 12)
                .then(hashPassword =>
                {
                    user.password = hashPassword
                    user.resetToken = undefined
                    user.expireToken = undefined
                    user.save().then((saveduser) =>
                    {
                        res.json({ message: "Password Updated SuccessFully" })
                    });
                });
        }).catch((error) => console.log(error.message));
});


export const route = router;