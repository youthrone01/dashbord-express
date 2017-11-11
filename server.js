var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require("body-parser");
var session = require('express-session');
app.listen(8000, function() {
 console.log("listening on port 8000");
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret: 'codingdojorocks'}));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './static')));
mongoose.connect('mongodb://localhost/basic_mongoose');
mongoose.Promise = global.Promise;

var PetSchema = new mongoose.Schema({
    name:String,
    age:Number,
    color:String,
},{timestamps:true});

mongoose.model("Pet",PetSchema);
var Pet = mongoose.model("Pet");


app.get('/', function(req,res){
    Pet.find({},function(err, pets){
        if(err){
            console.log(err);
        }else{
            res.render('index',{pets:pets});
        }
    })
    
});

app.get('/mongooses/new',function(req,res){
    res.render('new');
});

app.get('/mongooses/:id',function(req,res){
    Pet.findOne({_id:req.params.id},function(err,pet){
        res.render("show",{pet:pet});
    });
});



app.get('/mongooses/edit/:id',function(req,res){
    Pet.findOne({_id:req.params.id},function(err,pet){
        res.render('edit',{pet:pet});
    })
});

app.post('/mongooses',function(req, res){
    var pet = new Pet({name:req.body.name, age:req.body.age, color:req.body.color});
    pet.save(function(err){
        if(err){
            console.log(err);
            res.redirect('/mongooses/new');
        }else{
            res.redirect('/');
        }
    })
});

app.post('/mongooses/:id',function(req,res){
    Pet.findOne({_id:req.params.id},function(err,pet){
        pet.name = req.body.name;
        pet.age = req.body.age;
        pet.color = req.body.color;
        pet.save(function(err){
            if(err){
                console.log(err);
                res.redirect('/mongooses/'+pet._id);
            }else{
                res.redirect('/');
            }
        });
    })
})
app.post('/mongooses/destroy/:id',function(req,res){
    Pet.remove({_id:req.params.id},function(err){
        if(err){
            console.log(err);
            res.redirect('/');
        }else{
            console.log(err);
            res.redirect('/');
        }
    })
});




