import express from "express";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";

const app = express();
app.use(express.json());


const JWT_PASSWORD = "123123";

app.post("/api/v1/signup", async (req, res) => {

    // implement zod validation
    const username = req.body.username;
    const password = req.body.password;

    const response = await UserModel.create({
        username: username,
        password: password
    })

    if(response) {
    res.json({
        msg: "user signed up"
    })} else {
        res.json({
            message: "User already exists"
        })
    }

})

app.post("/api/v1/signin", async (req, res) => {

    console.log("hello it reached here!!");

    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({
        username,
        password
    })

    console.log("hello it reached here!!")

    if(existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_PASSWORD)
        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "incorrect credentials"
        })
    }

})

app.post("/api/v1/content", userMiddleware, async (req, res) => {

    
    const title = req.body.title;
    const link = req.body.link;
    await ContentModel.create({
        title,
        link,
        //@ts-ignore
        userId: req.userId,
        tags: []
    })

    res.json({
        message: "content added"
    })

})

app.get("/api/v1/content", userMiddleware, async (req, res) => {

    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username")

    res.json({
        content
    })

})

app.delete("/api/v1/content", userMiddleware, async (req, res) => {

    const contentId = req.body.contentId;

    const response = await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userid
    })

    res.json({
        message: "content deleted"
    })
})

app.post("/api/v1/brain/share", (req, res) => {

})

app.get("/api/v1/brain/:shareLink", (req, res) => {

})


app.listen(3000);