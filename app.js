const express = require("express");
const morgan = require("morgan"); // it is a middleware
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const app = express();

const dbURI =
  "mongodb+srv://aarush123:aarush123@mern-cluster.4lhno.mongodb.net/node-tuts?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));
// register view engine
app.set("view engine", "ejs");

// adding middlewares

// middleware and static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); //morgan - middleware

// routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find()
    .then((result) => {
      res.render("index", { title: "Blogs", blogs: result });
    })
    .catch((error) => console.log(error));
});

// Post request
app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => res.redirect("/blogs"))
    .catch((error) => console.log(error));
  console.log(req.body);
});

app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id)
    .then((result) => {
      res.render("blog", { title: result.title, blog: result });
    })
    .catch((error) => {
      res.render("404", { title: "Blog Not Found" });
    });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Us" });
});

app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a New Blog" });
});

// 404 page - Always meant to be in the last
app.use((req, res) => {
  res.status(404).render("404", { title: "404 Error" });
});
