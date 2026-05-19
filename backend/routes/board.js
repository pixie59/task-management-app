import express from "express"
import prisma from "../lib/prisma.js"
import authMiddleware from "../authMw.js"
const router=express.Router()
router.post("/create-board",authMiddleware,async(req,res)=>{
try{
const {title}=req.body
const userId=req.user.id
const board=await prisma.board.create({
data:{
title:title,
userId:userId
}})
res.json(board)
}
catch(error){
console.log(error)
res.json("something went wrong")
}
})
router.get("/get-boards",authMiddleware,async(req,res)=>{
  try{
  const userId=req.user.id
  const boards=await prisma.board.findMany({
    where:{
    userId:userId
    }
  })
  res.json(boards)}
  catch(error){
    console.log(error)
    res.json("Something went wrong")
  }
})
router.get("/:id",authMiddleware,async(req,res)=>{
    try{
    const id=req.params.id
    const board=await prisma.board.findUnique({
        where:{
            id:Number(id)
        }
    })
    res.json(board)}
    catch(error){
        console.log(error)
        res.json("Something went wrong")
    }
})
router.delete("/:id",authMiddleware,async(req,res)=>{
    try{
        const id=req.params.id
    await prisma.board.delete({
        where:{
            id:Number(id)
        }
    })
    res.json("Board deleted")}
    catch(error){
        console.log(error)
        res.json("Something went wrong")
    }
})
router.put("/:id",authMiddleware,async(req,res)=>{
    try{
        const id=req.params.id
        const {title}=req.body
        const updateBoard=await prisma.board.update({
            where:{
                id:Number(id)
            },
            data:{
                title:title
            }
        })
        res.json(updateBoard)}
    catch(error){
        console.log(error)
        res.json("Something went very very wrong")
    }
})
export default router