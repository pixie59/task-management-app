import {useState,useEffect} from "react"
import { motion } from "framer-motion"
function Boards(){
const [isOpen,setIsOpen]=useState(false)
const [editTitle,setEditTitle]=useState("")
const [selectedBoard,setSelectedBoard]=useState(null)
const [boards,setBoards]=useState([])
const [title,setTitle]=useState("")
const [description,setDescription]=useState("")
const [loading,setLoading]=useState(false)
const [saving,setSaving]=useState(false)
const fetchBoards=async()=>{
const token=localStorage.getItem("token")
const response=await fetch("http://localhost:5000/api/board/get-boards",{
headers:{
authorization:token
}
})
const data=await response.json()
setBoards(Array.isArray(data)?data:[])
}
useEffect(()=>{
fetchBoards()
},[])
const createBoard=async()=>{
    console.log("Create board clicked")
    console.log(title)
console.log(description)
setLoading(true)
const token=localStorage.getItem("token")
const res=await fetch("http://localhost:5000/api/board/create-board",{
method:"POST",
headers:{
"Content-Type":"application/json",
authorization:token
},
body:JSON.stringify({
title:title,
description:description
})
})
const data = await res.json()
console.log("Status:", res.status)
console.log("Response:", data)
fetchBoards()
setTitle("")
setDescription("")
setLoading(false)
}
const logout=()=>{
localStorage.removeItem("token")
window.location.href="/"
}
const deleteBoard=async(id)=>{
const confirmDelete=window.confirm("Delete this board?")
if(!confirmDelete) return
const token=localStorage.getItem("token")
await fetch(`http://localhost:5000/api/board/${id}`,{
method:"DELETE",
headers:{
authorization:token
}
})
fetchBoards()
}
const openEditModal=(board)=>{
setSelectedBoard(board)
setEditTitle(board.title)
setIsOpen(true)
}
const saveBoard=async()=>{
const token=localStorage.getItem("token")
await fetch(`http://localhost:5000/api/board/${selectedBoard.id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json",
authorization:token
},
body:JSON.stringify({
title:editTitle
})
})
setIsOpen(false)
fetchBoards()
}
return(
<div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
<div className="flex justify-end mb-4">
<button
onClick={logout}
className="bg-black text-white px-5 py-2 rounded-full">
Logout
</button>
</div>
<h1 className="text-5xl font-extrabold text-center mb-10 tracking-tight">
Boards Dashboard
</h1>
<div className="bg-white p-8 rounded-3xl shadow-md flex flex-col gap-5 mb-10 max-w-xl mx-auto">
<input
type="text"
placeholder="Enter board title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
className="border p-3 rounded-xl w-full shadow-sm outline-none focus:ring-2 focus:ring-black"
/>
<input
type="text"
placeholder="Enter board description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
className="border p-3 rounded-xl w-full shadow-sm outline-none focus:ring-2 focus:ring-black"
/>
<button
onClick={createBoard}
disabled={loading}
className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition disabled:opacity-50">
{loading ? "Creating..." : "Create Board"}
</button>
</div>
{
boards.length===0 ? (
<div className="bg-white rounded-3xl shadow-md p-12 text-center">
<h2 className="text-2xl font-bold mb-2">
No Boards Yet
</h2>
<p className="text-gray-500">
Create your first board to get started 🚀
</p>
</div>
) : (
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{boards.map((board)=>(
<div
key={board.id}
className="bg-white p-6 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 border border-gray-100 min-h-[200px] flex flex-col justify-between">
<div>
<h3
onClick={()=>window.location.href=`/tasks/${board.id}`}
className="text-2xl font-bold cursor-pointer hover:text-gray-700 transition">
{board.title}
</h3>
<p className="text-sm text-gray-400 mt-3">
{board.description}
</p>
</div>
<div className="flex justify-between items-end mt-6">
<button
onClick={(e)=>{
e.stopPropagation()
openEditModal(board)
}}
className="text-blue-500">
Edit
</button>
<button
onClick={(e)=>{
e.stopPropagation()
deleteBoard(board.id)
}}
className="text-red-500">
Delete
</button>
</div>
</div>
))}
</div>
)
}
{
isOpen&&(
<div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center">
<motion.div
initial={{opacity:0,scale:0.9}}
animate={{opacity:1,scale:1}}
transition={{duration:0.2}}
className="bg-white p-8 rounded-3xl w-96 shadow-2xl border border-gray-100">
<h2 className="text-3xl font-extrabold mb-6 tracking-tight">
Edit Board
</h2>
<input
value={editTitle}
onChange={(e)=>setEditTitle(e.target.value)}
className="w-full border p-3 rounded-xl mb-6 outline-none"
/>
<div className="flex justify-end gap-4">
<button
onClick={()=>setIsOpen(false)}
className="text-gray-500">
Cancel
</button>
<button
onClick={saveBoard}
className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition">
{saving ? "Saving..." : "Save"}
</button>
</div>
</motion.div>
</div>
)
}
</div>
)
}
export default Boards