import express from "express"
import bcrypt from "bcryptjs"
import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken"
import authMiddleware from "../authMw.js"
const router = express.Router()
router.post("/signup",async(req,res)=>{
    try{
        const {email,password}=req.body
            const existingUser=await prisma.user.findUnique({
                where:{email:email}})
                if(existingUser==null){
                    const hashedPassword=await bcrypt.hash(password,10)
                    const user=await prisma.user.create({
                        data:{
                            email:email,
                            password:hashedPassword}})
                    const token = jwt.sign({id:user.id},"sk")
// console.log("TOKEN SENT:", token)
// console.log("LOGIN TOKEN:", token)
                    res.json({token})}
                else{
                    return res.json("User already exists")}}
                    catch(error){
                        console.log(error)
                        res.status(500).json({
                        message:"something went wrong"})}})
router.post("/login",async(req,res)=>{
    try{
    const {email,password}=req.body
    const existingUser=await prisma.user.findUnique({
        where:{email:email}})
        if(existingUser==null){
            return res.json("User does not exist")}
    const isPasswordCorrect=await bcrypt.compare(password,existingUser.password)
    if (!isPasswordCorrect){
    return res.json("Incorrect password")}
    const token = jwt.sign(
        {id:existingUser.id},
        "sk")
    res.json({token})}
    catch(error){
        console.log(error)
        res.status(500).json({
        message:"something went wrong"})}})
router.put("/change-password", async(req,res)=>{
try{
    const {email,currentPassword,newPassword}=req.body
    const user=await prisma.user.findUnique({
        where:{email:email}})
    if(!user){
        return res.json("User not found")}
    const isPasswordCorrect=await bcrypt.compare(currentPassword,user.password)
    if(!isPasswordCorrect){
        return res.json("Current password incorrect")}
        const hashedPassword=await bcrypt.hash(newPassword,10)
        await prisma.user.update({
            where:{email:email},
            data:{password:hashedPassword}})
        res.json("Password updated successfully")}
catch(error){
    console.log(error)
    res.status(500).json("Something went wrong")}})
router.get("/profile-stats",authMiddleware,async(req,res)=>{
try{
    const userId=req.user.id
    const user=await prisma.user.findUnique({
        where:{id:userId}})
    const boardsCount=await prisma.board.count({
        where:{userId:userId}})
    const tasksCount=await prisma.task.count({
    where:{board:{userId:userId}}})
    res.json({boardsCount,tasksCount,memberSince:user.createdAt})}
catch(error){
    console.log(error)
    res.status(500).json(error.message)}})
router.delete("/delete-account",authMiddleware,async(req,res)=>{
try{
    const userId=req.user.id
    await prisma.task.deleteMany({
        where:{board:{userId:userId}}})
    await prisma.board.deleteMany({
        where:{userId:userId}})
    await prisma.user.delete({
    where:{id:userId}})
    res.json("Account deleted")}
catch(error){
    console.log(error)
    res.status(500).json("Something went wrong")}})
export default router