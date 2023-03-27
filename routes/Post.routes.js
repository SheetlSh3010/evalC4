const express = require("express");
const { PostModel } = require("../model/Post.model");
const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
    try {
        const {userId}=req.body
        const {device=["Tablet","Laptop","Mobile"]}=req.query
        const posts= await PostModel.find({$and:[{userId},{device:{$in:device}}]})
        res.send({posts,msg:"Your posts"})
    } catch (error) {
        res.send(error.message)
    }
});
postRouter.get("/:id",async(req,res)=>{
    try {
        const id=req.params.id
        const post=await PostModel.findById(id)
        res.send({post})
    } catch (error) {
        res.send({msg:error.message})
    }
})


postRouter.post("/add", async (req, res) => {
  
  try {
    const data = req.body;
    const newpost=new PostModel(data)
    await newpost.save();
    res.send({ msg: "Post created successfully",post:newpost });
  } catch (error) {
    req.send({ msg: "Something went wrong", error: error.message });
  }
});
postRouter.get('/top',async(req,res)=>{
    const comments=await PostModel.find({$max:"no_if_comments"})
    res.send({msg:'got comments',data:comments})
})
postRouter.patch("/update/:id", async (req, res) => {
  
  try {
    const data=req.body
    const id=req.params.id;
    const updated=await PostModel.findByIdAndUpdate(id,data)
    res.send({ msg:"Post updated",post:updated});
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});
postRouter.delete("/delete/:id", async (req, res) => {
  try {
    const id=req.params.id
    const deleted=await PostModel.findByIdAndDelete(id)
    if(deleted){
        res.send({msg:"Post deleted",post:deleted})
    } else{
        res.send({msg:"Post not found"})
    }
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

module.exports = { postRouter };
