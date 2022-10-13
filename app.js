//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


// how to connect to loacl mongoDB PROPERLY!!!
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema)

// ------------------------- requests targeting all articles ----------------
// propper way to chain methods
app.route("/articles")

// get to show data aka READ in CRUD
.get(function(req, res){
    
    Article.find(function(err, foundArticles){
        if (!err){
            res.send(foundArticles);
        } else {
            res.send(err)
        }
    })
    })

    
    // get to post data aka CREATE in CRUD
.post(function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        
        newArticle.save(function(err){
            if (!err) {
                res.send("Successfully added a new article.")
            } else {
                res.send(err)
            }
        })
        })    
        
        // get to delete data aka delete in CRUD
        .delete(function(req, res){
            
            Article.deleteMany(function(err){
                if (!err) {
                    res.send("Successfully deleted all articles.")
                } else {
                    res.send(err)
                }
            })
        });


// ------------------------- requests targeting a single article ----------------
// propper way to chain methods
app.route("/articles/:articleTitle")

// get to show data aka READ in CRUD
.get(function(req, res){
    
    Article.findOne({title: req.params.articleTitle},function(err, foundArticle){
        if (foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No article matching that title was found.")
        }
    })
    })

    // updates the entire article with the given info
.put(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err) {
            if(!err){
                res.send("Successfully updated the article.")
            } else {
                res.send(err)
            }
        }
    )
})
// used to update a specific field only
.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        // lets say we wanted to update only one key --> {$set: {content: ""}} or more {content: "", title:""}
        {$set: req.body},
        function(err) {
            if(!err){
                res.send("Successfully updated the article.")
            } else {
                res.send(err)
            }
        }   
    )
})
.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err) {
            if(!err){
                res.send("Successfully deleted the article.")
            } else {
                res.send(err)
            }
        }
    )
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});