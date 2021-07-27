//jshint esversion:6


const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articlesSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Articles = mongoose.model("article", articlesSchema);


app.route("/articles")

  .get(function(req, res) {
    Articles.find({}, function(err, result) {
      if (!err) {
        // let newVariable = new Articles({
        //   title: "Hello there",
        //   content: "Just some random content"
        // 
        // });
        //     newVariable.save();
        res.send(result);
      }
    });
  })


  .post(function(req, res) {

    const newArticle = new Articles({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Succesfully added documents");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Articles.deleteMany({}, function(err) {
      if (!err) {
        res.send("Deleted succesfully all articles");
      } else {
        res.send(err);
      }
    });
  });




app.route("/articles/:articleTitle")
.get(function(req,res){
  Articles.findOne({title:req.params.articleTitle}, function(err,result){
    if(result){
      res.send(result);

    }else{
      res.send("Document not found");
    }
  });
})
.put(function(req,res){
  Articles.update({title:req.params.articleTitle} ,
     {title:req.body.title, content:req.body.content},
      {overwrite:true} ,
      function(err){
    if(!err){
      res.send("Updating file Succesfully");
    }
  });
})

.patch(function(req,res){
  Articles.updateOne(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
      if(!err){
        res.send("Update succesfull");
      }else{
        res.send(err);
      }
    }



  );
});








app.listen(3000, function() {
  console.log("Server started");
});
