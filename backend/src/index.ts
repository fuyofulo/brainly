import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";
import { random } from "./utils";

const app = express();
app.use(express.json());

const corsOptions = {
    origin: "http://localhost:5173", // Replace with your frontend's URL
    methods: ["GET", "POST", "DELETE", "PUT"], // Allowed HTTP methods
    credentials: true, // Allow credentials such as cookies or authorization headers
  };
  app.use(cors(corsOptions));


const JWT_PASSWORD = "123123";

app.post("/api/v1/signup", async (req, res) => {

    // implement zod validation
    const username = req.body.username;
    const password = req.body.password;

    const check = await UserModel.findOne({
        username
    })

    if(check) {
        console.log("user already exists");
        res.json({
            message: "user already exists"
        })
        return
    }

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


    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({
        username,
        password
    })


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

app.post("/api/v1/content", userMiddleware, async (req, res):Promise<void> => {

    
    const title = req.body.title;
    const link = req.body.link;
    const type = req.body.type;

    try {
        if (!type || !["youtube", "twitter"].includes(type)) {
            res.status(400).json({ message: "Invalid or missing content type" });
            return; // Explicitly return void here
        }
        await ContentModel.create({
            title,
            link,
            type,
            //@ts-ignore
            userId: req.userId,
            tags: []
        })

        res.json({
            message: "content added"
        }) 
    } catch (error) {
        console.error("Error adding content:", error);
        res.status(500).json({ message: "Failed to add content" });
    }

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

    const response = await ContentModel.deleteOne({
        contentId,
        //@ts-ignore
        userId: req.userid
    })

    if(response) {
        res.json({
            message: "content deleted"
        })
    } else {
        res.json({
            message: "Failed to delete content"
        })
    }
    
})

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share;
    if (share) {
            const existingLink = await LinkModel.findOne({
                //@ts-ignore
                userId: req.userId
            });

            if (existingLink) {
                res.json({
                    hash: existingLink.hash
                })
                return;
            }
            const hash = random(10);
            await LinkModel.create({
                //@ts-ignore
                userId: req.userId,
                hash: hash
            })

            res.json({
                hash
            })
    } else {
        await LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });

        res.json({
            message: "Removed link"
        })
    }
})


app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }
    // userId
    const content = await ContentModel.find({
        userId: link.userId
    })

    console.log(link);
    const user = await UserModel.findOne({
        _id: link.userId
    })

    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username: user.username,
        content: content
    })

})


app.listen(3000);