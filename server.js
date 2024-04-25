const express=require('express');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
require('dotenv').config();
const port=4400;
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
const mongoURI=process.env.MONGO_URI;
mongoose.connect(mongoURI)
.then(()=>console.log('connected to mongodb'))
.catch(err=>console.error("Error connecting to MongoDB: ".err));
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
})
const user=mongoose.model('user12',userSchema);
app.get('/user',(req,res)=>{
    user.find({})
    .then(users=>res.json(users))
    .catch(err=>res.status(500).json({message:err.message}));
})
app.post('/user',(req,res)=>{
    const users=new user({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    users.save()
    .then(newuser=>res.status(201).json(newuser))
    .catch(err=>res.status(501).json({message:err.message}));
})
app.put('/user/:id',(req,res)=>{
const userid=req.params.id;
const updateData={
    name:req.body.name,
    email:req.body.email,
    password:req.body.password
}
user.findByIdAndUpdate(userid,updateData,{new:true})
.then(updateduser=>{if(!updateduser){
    return res.status(404).json({message:'user not found'});
}
res.json(updateduser);   
})
.catch(err=>res.status(400).json({message:err.message}));
});
app.delete('/users/:id',(req,res)=>{
    const userid=req.params.id;
    user.findByIdAndDelete(userid)
    .then(deleteuser=>{
        if(!deleteuser){
            return res.status(404).json({message:'user not found'});

        }
        res.json({message:'user deleted succesfully'});
    })
    .catch(err=>res.status(400).json({message:err.message}));
})
app.listen(4400);