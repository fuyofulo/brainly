import mongoose, { model, Schema } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const mongo_url = process.env.MONGO_URL;

if (!mongo_url) {
    console.error('Error: MONGO_URL is not defined in the environment variables');
    process.exit(1); // Exit the application
  }

mongoose.connect(mongo_url);

const UserSchema = new Schema({
    username: {type: String, unique: true, require: true},
    password: {type: String, require: true}
})

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}], 
    type: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
})

export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true}
})

export const LinkModel = model("Links", LinkSchema);
