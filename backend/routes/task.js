import express from "express"
import prisma from "../lib/prisma.js"
import authMiddleware from "../authMw.js"
const router=express.Router()
router.post("/create-task",authMiddleware,async(req,res)=>{
    try{
    const{title,boardId}=req.body
    const task=await prisma.task.create({
        data:{
            title:title,
            boardId:boardId
        }
    })
    res.json(task)}
    catch(error){
        console.log(error)
        res.json("Something went wrong")
    }
})
router.get("/board/:boardId",authMiddleware,async(req,res)=>{
    try{
        const boardId=req.params.boardId
        const tasks=await prisma.task.findMany({
            where:{
                boardId:Number(boardId)
            }
    })
    res.json(tasks)}
    catch(error){
        console.log(error)
        res.json("Something went wrong")
    }
})
router.delete("/:id",authMiddleware,async(req,res)=>{
    try{
        const id=req.params.id
        await prisma.task.delete({
            where:{
                id:Number(id)
            }
        })
    res.json("Task deleted")}
    catch(error){
        console.log(error)
        res.json("Something went wrong")
    }
})
router.put("/:id",authMiddleware,async(req,res)=>{
    try{
        const id=req.params.id
        const {status}=req.body
        const updatedTask=await prisma.task.update({
            where:{
                id:Number(id)
            },
            data:{
                status:status
                 }
             })
         res.json(updatedTask)}
    catch(error){
        console.log(error)
        res.json("Something went wrong")
                }
         })
export default router