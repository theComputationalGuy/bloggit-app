const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');

const db = require('./config/mongoose');
const BlogPost = require('./models/blogPost');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('assets'));

  
var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
   });
   
   var upload = multer({storage: storage});

app.get("/", function(req, res) {
    BlogPost.find({}, function(err, foundPosts) {
        if(err) {
        console.log(err);
        } else {
        if (foundPosts) {
            res.render("index", {blogPosts: foundPosts});
        }
        }
    });
});

app.post("/blog", upload.single('postImage'), function(req, res) {
    const title = req.body.title;
    const content = req.body.content;
    const imgType = req.file.mimetype;
    const imgData = fs.readFileSync(path.join(__dirname + '/public/uploads/' + req.file.filename));

    BlogPost.create({title: title, content: content, img: {data: imgData, contentType: imgType}}, function(err){
        if (err) return handleError(err);
        res.redirect("/");
    });
});

app.get('/delete-post',function(req,res){
    let id = req.query.id;
    // console.log(req);
    BlogPost.findByIdAndDelete(id, function(err){
        if(err){
            console.log('Error in deleting object from db');
            return;
        }
        return res.redirect('back');
    })
})


app.listen(7789, function(err){
    if(err){
        console.log('error connecting to port');
    }
    console.log('connected to port');
})