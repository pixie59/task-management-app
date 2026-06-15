import express from "express"
import prisma from "../lib/prisma.js"
import authMiddleware from "../authMw.js"
const router=express.Router()
router.post("/create-task",authMiddleware,async(req,res)=>{
    try{
    const{title,description,boardId,dueDate,priority}=req.body
    const task=await prisma.task.create({
        data:{
            title:title,
            description:description,
            boardId:boardId,
            status:"todo",
            dueDate:dueDate ? new Date(dueDate): null,
            priority:priority
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
        const {title,description,status}=req.body
        const updatedTask=await prisma.task.update({
            where:{
                id:Number(id)
            },
            data:{
                title:title,
                description:description,
                status:status
                 }
             })
         res.json(updatedTask)}
    catch(error){
        console.log(error)
        res.json("Something went wrong")
                }
 })
 router.put("/:id/complete",authMiddleware,async(req,res)=>{
    try{
        const id=req.params.id
        const updatedTask=await prisma.task.update({
            where:{
                id:Number(id)
            },
            data:{
                status:"completed"
            }
        })
        res.json(updatedTask)}
    catch(error){
        console.log(error)
        res.json("Something is fishy")
    }
})
router.put("/:id/pending",authMiddleware,async(req,res)=>{
    try{
        const id=req.params.id
        const updatedTask=await prisma.task.update({
            where:{
                id:Number(id)
            },
            data:{
                status:"pending"
            }
        })
        res.json(updatedTask)}
    catch(error){
        console.log(error)
        res.json("Something is fishy")
    }
})
router.get("/filter/status",authMiddleware,async(req,res)=>{
    try{
        const status=req.query.status
        const updatedTask=await prisma.task.findMany({
            where:{
                status:status
            }
            })
        res.json(updatedTask)}
    catch(error){
        console.log(error)
        res.json("Ah went wrong")
    }
})
router.get("/search/task",authMiddleware,async(req,res)=>{
    try{
        const title=req.query.title
        const updatedTask=await prisma.task.findMany({
            where:{
                title:{
                    contains:title
                }
            }
    })
    res.json(updatedTask)}
    catch(error){
        console.log(error)
        res.json("I am very stupid")
    }
})
router.get("/sort/tasks",authMiddleware,async(req,res)=>{
    try{
        const order=req.query.order
        const updatedTask=await prisma.task.findMany({
            orderBy:{
                createdAt:order
            }
        })
    res.json(updatedTask)}
    catch(error){
        console.log(error)
        res.json("nahhh")
    }
})
router.get("/analytics/tasks",authMiddleware,async(req,res)=>{
     try{
        const totalTasks=await prisma.task.count()
        const completeTasks=await prisma.task.count({
            where:{
                status:"completed"
            }
        })
        const pendingTasks=await prisma.task.count({
            where:{
                status:"pending"
            }
        })
    res.json({totalTasks,completeTasks,pendingTasks})}
    catch(error){
        console.log(error)
        res.json("nahhh")
    }
})
router.get("/analytics/:boardId",authMiddleware,async(req,res)=>{
    try{
        const boardId=req.params.boardId
        const totalTasks=await prisma.task.count({
            where:{
                boardId:Number(boardId)
            }
        })
        const completeTasks=await prisma.task.count({
            where:{
                boardId:Number(boardId),
                status:"completed"
            }
        })
        const pendingTasks=await prisma.task.count({
            where:{
                boardId:Number(boardId),
                status:"pending"
            }
        })
    res.json({
        totalTasks,
        completeTasks,
        pendingTasks
    })}
    catch(error){
        console.log(error)
        res.json("nahhh")
    }
})
export default router