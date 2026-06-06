import {useState,useEffect} from "react"
import { motion } from "framer-motion"
function Boards(){
const [isOpen,setIsOpen]=useState(false)
const [editTitle,setEditTitle]=useState("")
const [showDeleteModal,setShowDeleteModal]=useState(false)
const [boardToDelete,setBoardToDelete]=useState(null)
const [selectedBoard,setSelectedBoard]=useState(null)
const [boards,setBoards]=useState([])
const [title,setTitle]=useState("")
const [description,setDescription]=useState("")
const [loading,setLoading]=useState(false)
const [saving,setSaving]=useState(false)
const [darkMode,setDarkMode]=useState(()=>{
return localStorage.getItem("darkMode")==="true"})
const fetchBoards=async()=>{
const token=localStorage.getItem("token")
const response=await fetch("http://localhost:5000/api/board/get-boards",{
headers:{
authorization:token}})
const data=await response.json()
setBoards(Array.isArray(data)?data:[])}
useEffect(()=>{
fetchBoards()},[])
useEffect(()=>{
localStorage.setItem("darkMode",darkMode)},[darkMode])
const createBoard=async()=>{
    console.log("Create board clicked")
    console.log(title)
console.log(description)
setLoading(true)
const token=localStorage.getItem("token")
console.log("token:",token)
const res=await fetch("http://localhost:5000/api/board/create-board",{
method:"POST",
headers:{
"Content-Type":"application/json",
authorization:token},
body:JSON.stringify({
title:title,
description:description})})
const data = await res.json()
console.log("Status:", res.status)
console.log("Response:", data)
fetchBoards()
setTitle("")
setDescription("")
setLoading(false)}
const logout=()=>{
localStorage.removeItem("token")
window.location.href="/"}
const deleteBoard=async(id)=>{
setBoardToDelete(id)
setShowDeleteModal(true)}
const confirmDeleteBoard=async()=>{
const token=localStorage.getItem("token")
await fetch(`http://localhost:5000/api/board/${boardToDelete}`,{
method:"DELETE",
headers:{
authorization:token}})
setShowDeleteModal(false)
setBoardToDelete(null)
fetchBoards()}
const openEditModal=(board)=>{
setSelectedBoard(board)
setEditTitle(board.title)
setIsOpen(true)}
const saveBoard=async()=>{
const token=localStorage.getItem("token")
await fetch(`http://localhost:5000/api/board/${selectedBoard.id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json",
authorization:token},
body:JSON.stringify({
title:editTitle})})
setIsOpen(false)
fetchBoards()}
return(
<div className={`min-h-screen p-8 ${ darkMode ? "bg-gradient-to-br from-gray-900 to-black text-white" : "bg-gradient-to-br from-gray-100 to-gray-200 text-black" }`}>
<div className="flex justify-end gap-4 mb-4">
<button
onClick={()=>setDarkMode(!darkMode)}
className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition">
{darkMode ? "☀️ Light" : "🌙 Dark"}
</button>
<button
onClick={()=>window.location.href="/profile"}
className="bg-green-500 text-white px-5 py-2 rounded-full">
Profile
</button>
<button onClick={logout}className="bg-black text-white px-5 py-2 rounded-full">
Logout
</button>
</div>
<h1 className="text-5xl font-extrabold text-center mb-10 tracking-tight">
Boards Dashboard
</h1>
<div
className={`p-8 rounded-3xl shadow-md flex flex-col gap-5 mb-10 max-w-xl mx-auto ${
darkMode
? "bg-gray-800"
: "bg-white"}`}>
<input
type="text"
placeholder="Enter board title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
className={`border p-3 rounded-xl w-full shadow-sm outline-none ${
darkMode
? "bg-white text-black border-gray-300"
: "bg-white border-gray-300"}`}/>
<input
type="text"
placeholder="Enter board description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
className={`border p-3 rounded-xl w-full shadow-sm outline-none ${
darkMode
? "bg-white text-black border-gray-300"
: "bg-white text-black border-gray-300"}`}/>
<button
onClick={createBoard}
disabled={loading}
className={`border p-3 rounded-xl w-full shadow-sm outline-none ${
darkMode
? "bg-white text-black border-gray-300"
: "bg-white text-black border-gray-300"}`}>
{loading ? "Creating..." : "Create Board"}
</button>
</div>{
boards.length===0 ? (
<div
className={`rounded-3xl shadow-md p-12 text-center ${
darkMode
? "bg-gray-800 text-white"
: "bg-white"}`}>
<h2 className="text-2xl font-bold mb-2">
No Boards Yet
</h2>
<p className="text-gray-500">
Create your first board to get started 🚀
</p>
</div>) : (
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{boards.map((board)=>(
<div
key={board.id}
className={`p-6 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ${
darkMode
? "bg-gray-800 text-white"
: "bg-white"}`}>
<div>
<h3
onClick={()=>window.location.href=`/tasks/${board.id}`}
className={`text-2xl font-bold cursor-pointer transition ${
darkMode
? "text-white hover:text-gray-300"
: "text-black hover:text-gray-700"}`}>
{board.title}
</h3>
<p
className={`text-sm mt-4 ${
darkMode
? "text-gray-300"
: "text-gray-400"}`}>
{board.description}
</p>
</div>
<div className="flex justify-between items-end mt-6">
<button
onClick={(e)=>{
e.stopPropagation()
openEditModal(board)}}
className="text-blue-500">
Edit
</button>
<button
onClick={(e)=>{
e.stopPropagation()
deleteBoard(board.id)}}
className="text-red-500">
Delete
</button>
</div>
</div>))}
</div>)}
{isOpen && (
<div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center">
<motion.div
initial={{opacity:0,scale:0.9}}
animate={{opacity:1,scale:1}}
transition={{duration:0.2}}
className={`p-8 rounded-3xl shadow-md flex flex-col gap-5 max-w-xl mx-auto ${
darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
<h2 className="text-3xl font-extrabold mb-6 tracking-tight">
Edit Board
</h2>
<input
value={editTitle}
onChange={(e)=>setEditTitle(e.target.value)}
className="w-full border p-3 rounded-xl mb-6 outline-none"/>
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
</div>)}{
showDeleteModal && (
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
<div className={`p-8 rounded-3xl shadow-2xl w-96 ${
darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
<h2 className="text-2xl font-bold mb-4">
Delete Board?
</h2>
<p className="mb-6">
This action cannot be undone.
</p>
<div className="flex justify-end gap-4">
<button
onClick={()=>{
setShowDeleteModal(false)
setBoardToDelete(null)}}
className="px-4 py-2 rounded-xl bg-gray-300 text-black"
>
Cancel
</button>
<button
onClick={confirmDeleteBoard}
className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600">
Delete
</button>
</div>
</div>
</div>)}
</div>)}
export default Boards