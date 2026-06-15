import express from "express"
import prisma from "../lib/prisma.js"
import authMiddleware from "../authMw.js"
const router=express.Router()
router.post("/create-board",authMiddleware,async(req,res)=>{
try{
const {title,description}=req.body
console.log(title)
console.log(description)
const userId=req.user.id
const board=await prisma.board.create({
data:{
title:title,
description:description,
userId:userId
}
})
res.json(board)
}
catch(error){
console.error("CREATE BOARD ERROR:")
console.error(error)
res.status(500).json(error.message)
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
res.json(boards)
}
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
res.json(board)
}
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
res.json("Board deleted")
}
catch(error){
console.log(error)
res.json("Something went wrong")
}
})
router.put("/:id",authMiddleware,async(req,res)=>{
try{
const id=req.params.id
const {title,description}=req.body
const updateBoard=await prisma.board.update({
where:{
id:Number(id)
},
data:{
title:title,
description:description
}
})
res.json(updateBoard)
}
catch(error){
console.log(error)
res.json("Something went very very wrong")
}
})
export default router