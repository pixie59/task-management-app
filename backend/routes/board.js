import express from "express"
import prisma from "../lib/prisma.js"
import authMiddleware from "../authMw.js"
const router=express.Router()
router.post("/create-board", authMiddleware, async (req, res) => {
  try {
    const { title, description, icon } = req.body
    const userId = req.user.id;
    const board = await prisma.board.create({
      data: {title,description,icon,userId,},
    })
    res.json(board);
  } 
  catch (error) {
    console.error("CREATE BOARD ERROR:");
    console.error(error);
    res.status(500).json(error.message);
  }
})
router.get("/get-boards",authMiddleware,async(req,res)=>{
  try{
    const userId=req.user.id
    const boards=await prisma.board.findMany({
    where:{userId:userId},include:{task:true}
   })
  res.json(boards)
  }
catch(error){
  console.log(error)
  res.json("Something went wrong")
  }})
router.get("/dashboard-stats",authMiddleware,async(req,res)=>{
try{
  const userId=req.user.id
  const totalBoards=await prisma.board.count({
  where:{userId:userId}})
  const totalTasks=await prisma.task.count({
    where:{board:{userId:userId}}})
  const completedTasks=await prisma.task.count({
    where:{board:{userId:userId},status:"done"}})
  const pendingTasks=await prisma.task.count({
    where:{board:{userId:userId},status:{not:"done"}}})
    res.json({totalBoards,totalTasks,completedTasks,pendingTasks})}
catch(error){
  console.log(error)
  res.status(500).json("Something went wrong")
  }})
router.get("/:id",authMiddleware,async(req,res)=>{
try{
  const id=req.params.id
  const board=await prisma.board.findUnique({
  where:{id:Number(id)}
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
    await prisma.task.deleteMany({
      where:{boardId:Number(id)}})
    await prisma.board.delete({
      where:{id:Number(id)}})
    res.json("Board deleted")
  }
  catch(error){
    console.log(error)
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
})
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body;
    const updateBoard = await prisma.board.update({
      where: {
        id: Number(id)
      },
      data: {
        title,
        description
      }
    });
    res.json(updateBoard);
  }
  catch(error){
    console.log(error);
    res.status(500).json(error.message);
  }
});
router.get("/dashboard-stats",authMiddleware,async(req,res)=>{
try{
const userId=req.user.id
const totalBoards=await prisma.board.count({
where:{
userId:userId
}
})
const totalTasks=await prisma.task.count({
where:{
board:{
userId:userId
}
}
})
const completedTasks=await prisma.task.count({
where:{
board:{
userId:userId
},
status:"done"
}
})
const pendingTasks=await prisma.task.count({
where:{
board:{
userId:userId
},
status:{
not:"done"
}
}
})
res.json({
totalBoards,
totalTasks,
completedTasks,
pendingTasks
})}
catch(error){
console.log(error)
res.status(500).json("Something went wrong")
}})
export default router