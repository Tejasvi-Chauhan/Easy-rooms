const express=require("express");
const app=express();
const Listing=require("./models/listing.js")
const path=require("path");
const ejsMate=require("ejs-mate");

const methodOverride = require("method-override");
 



const mongoose=require('mongoose');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/staynest');
}

main().then(()=>{
    console.log("Connected");
})
.catch((err)=>{
    console.log(err);
})

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({Extended:true}))
app.engine('ejs', ejsMate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

const port=8080;
app.listen(port,()=>{
    console.log(`App is listening at ${port}`);
})

app.get("/",(req,res)=>{
    res.send("Working");
})

app.get("/listings", async (req,res)=>{
    let alllistings= await Listing.find()
        
    res.render("listings/index.ejs",{alllistings});
})

app.get("/listings/new",(req,res)=>{
       res.render("listings/New.ejs");
})

app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let list= await Listing.findById(id);
    res.render("listings/show.ejs",{list});
})

app.post("/listings", async (req,res)=>{
    let newList=req.body;
    
    await Listing.insertOne(newList);
    res.redirect("/listings");
    
})

app.get("/listings/:id/edit", async (req,res)=>{
     let {id}=req.params;
    let list= await Listing.findById(id);
    res.render("listings/edit.ejs",{list});
})

app.put("/listings/:id",async (req,res)=>{
     let {id}=req.params;
    let updatedData=req.body;
    console.log(req.body);
   await  Listing.findByIdAndUpdate(id,updatedData,{runValidators:true});

    res.redirect(`/listings/${id}`);
})

app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});
