import express from "express"
import bcrypt from "bcryptjs"
import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken"
const router = express.Router()
router.post("/signup",async(req,res)=>{
try{
const {email,password}=req.body
const existingUser=await prisma.user.findUnique({
where:{email:email}
})
if(existingUser==null){
const hashedPassword=await bcrypt.hash(password,10)
const user=await prisma.user.create({
data:{
email:email,
password:hashedPassword
}})
res.json(user)
}
else{
return res.json("User already exists")
}}
catch(error){
console.log(error)
res.status(500).json({
message:"something went wrong"
})}
})
router.post("/login",async(req,res)=>{
try{
const {email,password}=req.body
const existingUser=await prisma.user.findUnique({
where:{email:email}
})
if(existingUser==null){
return res.json("User does not exist")
}
const isPasswordCorrect=await bcrypt.compare(password,existingUser.password)
if (!isPasswordCorrect){
    return res.json("Incorrect password")
}
const token = jwt.sign(
    {id:existingUser.id},
    "sk"
)
res.json(token)}
catch(error){
console.log(error)
res.status(500).json({
message:"something went wrong"
})}
})

export default router