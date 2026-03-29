require("dotenv").config();

const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT|| 4000;
const cookieParser = require('cookie-parser');
const blog = require('./models/blog');

const {checkForAuthenticationCookie} = require('./middlewares/authentication');

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/blogfy").
then((e) => console.log("Connected to DB")).
catch((err) => console.log(err));




const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const Blog = require('./models/blog');

app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.use("/user", userRouter);
app.use("/blog", blogRouter);




app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
        user : req.user,
        blogs: allBlogs,
    });
});
app.listen(PORT, () => console.log(`Server Started at Port: ${PORT}`));

