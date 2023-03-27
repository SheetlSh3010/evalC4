const express=require("express")
const { connection } = require("./config/db")
const { userRouter }=require("./routes/User.routes")
const { authenticate } = require("./middleware/authenticate");
const { postRouter } = require("./routes/Post.routes");

const cors=require("cors")
const app=express()
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send("HOME PAGE")
})
app.use("/users", userRouter);
app.use(authenticate);
app.use("/posts", postRouter);

app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("connected to db")
    } catch (error) {
        console.log(error)
    }
})