import socket from "../socket";
import {useEffect,useState} from "react"
import {useParams} from "react-router-dom"
import React from "react"
import {DragDropContext,Droppable,Draggable} from "@hello-pangea/dnd"
import {motion} from "framer-motion"
const Tasks = () => {
  const [search,setSearch]=useState("")
  const [tasks,setTasks]=useState([])
  const [title,setTitle]=useState("")
  const [priority,setPriority]=useState("medium")
  const [dueDate,setDueDate]=useState("")
  const [filterStatus,setFilterStatus]=useState("all")
  const [darkMode,setDarkMode]=useState(()=>{
return localStorage.getItem("darkMode")==="true"
})
  const [sortOrder,setSortOrder]=useState("newest")
  const [description,setDescription]=useState("")
  const {id}=useParams()
  const [loading,setLoading]=useState(false)
  const [isOpen,setIsOpen]=useState(false)
const [editTitle,setEditTitle]=useState("")
const [selectedTask,setSelectedTask]=useState(null)
  const fetchTasks=async()=>{
    const token=localStorage.getItem("token")
    const res=await fetch(`http://localhost:5000/api/task/board/${id}`,{
      headers:{
        authorization:token
      }
  })
    const data=await res.json()
    console.log(data)
    setTasks(data)
  }
useEffect(()=>{
fetchTasks();
socket.on("connect",()=>{
console.log("Connected:",socket.id);
});
socket.on("task-added", (task) => {
  console.log("RECEIVED TASK EVENT", task);
  fetchTasks();
});
socket.on("task-deleted", (id) => {
  console.log("RECEIVED DELETE EVENT", id);
  fetchTasks();
});
socket.on("task-moved", (task) => {
  console.log("RECEIVED MOVE EVENT", task);
  fetchTasks();
});
return ()=>{
socket.off("task-added");
socket.off("task-deleted");
socket.off("task-moved");
};
},[])
useEffect(()=>{
const token = localStorage.getItem("token")
if(!token){
window.location.href="/"}},[])
useEffect(()=>{
localStorage.setItem("darkMode",darkMode)
},[darkMode])
const create=async()=>{
  setLoading(true)
const token=localStorage.getItem("token")
const res=await fetch("http://localhost:5000/api/task/create-task",{
method:"POST",
headers:{
"Content-Type":"application/json",
authorization:token
},
body:JSON.stringify({
title:title,
description:description,
boardId:Number(id),
dueDate
})
})
const data=await res.json()
socket.emit("task-added", data);
console.log(data)
fetchTasks()
setTitle("")
setDescription("")
setLoading(false)
}
const moveToDoing=async(id)=>{
const token=localStorage.getItem("token")
await fetch(`http://localhost:5000/api/task/${id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json",
authorization:token
},
body:JSON.stringify({
status:"doing"
})
})
socket.emit("task-moved", {
id:id,
status:"doing"
})
fetchTasks()
}
const moveToDone=async(id)=>{
const token=localStorage.getItem("token")
await fetch(`http://localhost:5000/api/task/${id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json",
authorization:token
},
body:JSON.stringify({
status:"done"
})
})
socket.emit("task-moved",{
id:id,
status:"done"
})
fetchTasks()
}
const deleteTask=async(id)=>{
const confirmDelete=window.confirm("Delete this task?")
if(!confirmDelete) return
const token=localStorage.getItem("token")
await fetch(`http://localhost:5000/api/task/${id}`,{
method:"DELETE",
headers:{
authorization:token
}
})
socket.emit("task-deleted", id)
fetchTasks()
}
const editTask=(task)=>{
setSelectedTask(task)
setEditTitle(task.title)
setIsOpen(true)
}
const saveTask=async()=>{
const token=localStorage.getItem("token")
await fetch(`http://localhost:5000/api/task/${selectedTask.id}`,{
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
fetchTasks()
}
const handleDragEnd = async(result)=>{
if(!result.destination) return
const taskId = Number(result.draggableId)
const newStatus = result.destination.droppableId
const updatedTasks = tasks.map(task =>
task.id === taskId
? {...task,status:newStatus}
: task
)
setTasks(updatedTasks)
const token = localStorage.getItem("token")
try{
await fetch(`http://localhost:5000/api/task/${taskId}`,{
method:"PUT",
headers:{
"Content-Type":"application/json",
authorization:token
},
body:JSON.stringify({
status:newStatus
})
})
socket.emit("task-moved",{
id:taskId,
status:newStatus
})
}
catch(error){
console.log(error)
fetchTasks()
}
}
const sortedTasks=[...tasks].sort((a,b)=>
sortOrder==="newest"
? new Date(b.createdAt)-new Date(a.createdAt)
: new Date(a.createdAt)-new Date(b.createdAt)
)
const filteredTasks = sortedTasks.filter((task)=>
(task.title.toLowerCase().includes(search.toLowerCase()) ||
(task.description || "").toLowerCase().includes(search.toLowerCase()))
&&
(filterStatus==="all" ||task.status===filterStatus))
return (
<div className={`min-h-screen p-6 ${ darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black" }`}>
 <div className="flex justify-end gap-4 mb-4">
<button
onClick={()=>{
localStorage.removeItem("token")
window.location.href="/"
}}
className="bg-black text-white px-5 py-2 rounded-xl hover:bg-red-600 transition shadow-md">
Logout
</button>
<button
onClick={()=>window.location.href="/profile"}
className="bg-blue-500 text-white px-5 py-2 rounded-full"
>
Profile
</button>
<button
onClick={()=>setDarkMode(!darkMode)}
className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition shadow-md">
{darkMode ? "☀️ Light" : "🌙 Dark"}
</button>
</div>
<h1 className="text-4xl font-bold text-center mb-10">
Tasks Board
</h1>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
<div className={`rounded-3xl shadow-md p-6 text-center ${ darkMode ? "bg-gray-800 text-white" : "bg-white" }`}>
<h3 className={`mb-2 ${ darkMode ? "text-gray-300" : "text-gray-500"}`}>
📋 Total Tasks
</h3>
<p className="text-4xl font-bold">
{tasks.length}
</p>
</div>
<div className={`rounded-3xl shadow-md p-6 text-center ${ darkMode ? "bg-gray-800 text-white" : "bg-white" }`}>
<h3 className={`mb-2 ${ darkMode ? "text-gray-300" : "text-gray-500"}`}>
⚡ In Progress
</h3>
<p className="text-4xl font-bold text-blue-600">
{sortedTasks.filter(task=>task.status==="doing").length}
</p>
</div>
<div className={`rounded-3xl shadow-md p-6 text-center ${ darkMode ? "bg-gray-800 text-white" : "bg-white" }`}>
<h3 className={`mb-2 ${ darkMode ? "text-gray-300" : "text-gray-500"}`}>
✅ Completed
</h3>
<p className="text-4xl font-bold text-green-600">
{sortedTasks.filter(task=>task.status==="done").length}
</p>
</div>
</div>
<div className={`max-w-2xl mx-auto mb-10 p-4 rounded-3xl ${ darkMode ? "bg-gray-800" : "bg-white" }`}>

<p className="text-center mb-3 text-xl font-bold">
Project Progress 🚀
</p>
<div className="w-full bg-gray-300 rounded-full h-4">
<div
className="bg-green-500 h-4 rounded-full transition-all duration-500"
style={{
width:`${
tasks.length===0
?0
:(sortedTasks.filter(task=>task.status==="done").length/tasks.length)*100}%`}}>
</div>
</div>
<p className="text-center mt-4 text-lg font-semibold">
{tasks.length===0
? "0%"
: Math.round(
(sortedTasks.filter(task=>task.status==="done").length/tasks.length)*100)}% Complete</p>
</div>
<div className={`p-8 rounded-3xl shadow-md flex flex-col gap-4 mb-10 max-w-2xl mx-auto ${ darkMode ? "bg-gray-800" : "bg-white" }`}>
<input
value={title}
type="text"
placeholder="Enter task title"
onChange={(e)=>setTitle(e.target.value)}
className={`flex-1 p-3 rounded-xl border outline-none focus:ring-2 focus:ring-black ${
darkMode
? "bg-white text-black border-gray-300"
: "bg-white text-black border-gray-300"
}`}
/>
<textarea
placeholder="Enter task description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
className="flex-1 p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black bg-white text-black"
/>
<input
type="date"
value={dueDate}
onChange={(e)=>setDueDate(e.target.value)}
className="w-full border p-3 rounded-xl"
/>
<select
value={priority}
onChange={(e)=>setPriority(e.target.value)}
className="w-full border p-3 rounded-xl"
>
<option value="high">High</option>
<option value="medium">Medium</option>
<option value="low">Low</option>
</select>
<button
onClick={create} disabled={loading}
className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50">
Create Task
</button>
</div>
<input
type="text"
placeholder="🔍 Search tasks..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className={`w-full max-w-2xl mx-auto block p-3 rounded-xl border mb-8 outline-none ${  darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-gray-300" }`} 
/>
<select
value={filterStatus}
onChange={(e)=>setFilterStatus(e.target.value)}
className="p-3 rounded-xl border border-gray-300 bg-white text-black outline-none mb-8"
>
<option value="all">All Tasks</option>
<option value="todo">Todo</option>
<option value="doing">Doing</option>
<option value="done">Done</option>
</select>
{
search &&
filteredTasks.length===0 && (
<div className="bg-white p-6 rounded-2xl shadow-md text-center mb-6 text-gray-500">
No tasks found for "{search}"
</div>
)
}
<select
value={sortOrder}
onChange={(e)=>setSortOrder(e.target.value)}
className="p-3 rounded-xl border border-gray-300 bg-white text-black outline-none mx-4"
>
  <option value="newest">Newest First</option>
  <option value="oldest">Oldest First</option>
</select>
<DragDropContext onDragEnd={handleDragEnd}>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<Droppable droppableId="todo">
{(provided,snapshot)=>(
<div
ref={provided.innerRef}
{...provided.droppableProps}
className={`rounded-3xl p-4 min-h-[500px] shadow-md ${ darkMode ? "bg-gray-800" : "bg-gray-50" }`}>
<h2 className="text-2xl font-bold mb-6 text-center text-yellow-600">
📝Todo 
<span className="ml-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
{sortedTasks.filter(task=>task.status==="todo").length}
</span>
</h2>
{filteredTasks
.filter((task)=>task.status==="todo")
.map((task,index)=>(
<Draggable
key={task.id}
draggableId={task.id.toString()}
index={index}
>
{(provided,snapshot)=>(
<div
ref={provided.innerRef}
{...provided.draggableProps}
{...provided.dragHandleProps}
className={`p-5 rounded-2xl shadow-md border-l-4 hover:shadow-xl hover:-translate-y-1 cursor-grab active:cursor-grabbing transition-all duration-300 mb-4 ${snapshot.isDragging ? "scale-105 rotate-1 shadow-2xl" : ""} ${ darkMode ? "bg-gray-700 text-white" : "bg-white" }`}>
<h3 className="text-xl font-semibold">
{task.title}
</h3>
{
task.priority==="high" ? (
<span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
🔴 High
</span>
) :
task.priority==="medium" ? (
<span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
🟡 Medium
</span>
) : (
<span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
🟢 Low
</span>
)
}
{
task.dueDate && (
<div className="mt-2">
{
new Date(task.dueDate).toDateString() === new Date().toDateString()
? (
<span className="text-yellow-600 font-semibold">
🟡 Due Today
</span>
)
: new Date(task.dueDate) < new Date() &&
task.status !== "done"
? (
<span className="text-red-600 font-semibold">
🔴 Overdue
</span>
)
: (
<span className="text-green-600 font-semibold">
🟢 Future
</span>
)
}
</div>
)
}
{
task.dueDate && (
<p className="text-sm text-gray-500 mt-2">
📅 Due: {new Date(task.dueDate).toLocaleDateString("en-GB")}
</p>
)
}
<button
onClick={()=>setDarkMode(!darkMode)}
className="absolute top-6 right-6 bg-black text-white px-4 py-2 rounded-xl"
>
{darkMode ? "☀️ Light" : "🌙 Dark"}
</button>
<div className="flex justify-between items-center mt-4">
<button
onClick={()=>moveToDoing(task.id)}
className="bg-black text-white px-4 py-2 rounded-lg">
Move to Doing
</button>
<div className="flex gap-4">
<button
onClick={()=>deleteTask(task.id)}
className="text-red-500 font-semibold">
Delete
</button>
<button
onClick={()=>editTask(task)}
className="text-blue-500 font-semibold">
Edit
</button>
</div>
</div>
</div>
)}
</Draggable>
))}
{provided.placeholder}
</div>
)}
</Droppable>
<Droppable droppableId="doing">
{(provided,snapshot)=>(
<div
ref={provided.innerRef}
{...provided.droppableProps}
className={`rounded-3xl p-4 min-h-[500px] shadow-md ${ darkMode ? "bg-gray-800" : "bg-gray-50" }`}>
<h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
⚡Doing 
<span className="ml-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
{sortedTasks.filter(task=>task.status==="doing").length}
</span>
</h2>
{filteredTasks
.filter((task)=>task.status==="doing")
.map((task,index)=>(
<Draggable
key={task.id}
draggableId={task.id.toString()}
index={index}
>
{(provided,snapshot)=>(
<div
ref={provided.innerRef}
{...provided.draggableProps}
{...provided.dragHandleProps}
className={`p-5 rounded-2xl shadow-md border-l-4 border-blue-500 hover:shadow-xl hover:-translate-y-1 cursor-grab active:cursor-grabbing transition-all duration-300 mb-4 ${snapshot.isDragging ? "scale-105 rotate-1 shadow-2xl" : ""} ${ darkMode ? "bg-gray-700 text-white" : "bg-white"}`}>
<h3 className={`text-sm mt-2 ${darkMode? "text-gray-300": "text-gray-500"}`}>
{task.title}
</h3>
<div className="flex justify-between items-center mt-4">
<button
onClick={()=>moveToDone(task.id)}
className="bg-black text-white px-4 py-2 rounded-lg">
Move to Done
</button>
<div className="flex gap-4">
<button
onClick={()=>deleteTask(task.id)}
className="text-red-500 font-semibold">
Delete
</button>
<button
onClick={()=>editTask(task)}
className="text-blue-500 font-semibold">
Edit
</button>
</div>
</div>
</div>
)}
</Draggable>
))}
{provided.placeholder}
</div>
)}
</Droppable>
<Droppable droppableId="done">
{(provided,snapshot)=>(
<div
ref={provided.innerRef}
{...provided.droppableProps}
className={`rounded-3xl p-4 min-h-[500px] shadow-md ${ darkMode ? "bg-gray-800" : "bg-gray-50" }`}>
<h2 className="text-2xl font-bold mb-6 text-center text-green-600">
✅Done 
<span className="ml-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
{sortedTasks.filter(task=>task.status==="done").length}
</span>
</h2>
{filteredTasks
.filter((task)=>task.status==="done")
.map((task,index)=>(
<Draggable
key={task.id}
draggableId={task.id.toString()}
index={index}
>
{(provided,snapshot)=>(
<div
ref={provided.innerRef}
{...provided.draggableProps}
{...provided.dragHandleProps}
className={`p-5 rounded-2xl shadow-md border-l-4 mb-4 transition-all duration-200
${snapshot.isDragging ? "scale-105 rotate-1 shadow-2xl" : ""}
${darkMode ? "bg-gray-700 text-white" : "bg-white"}
`}>
<div className="flex justify-between items-center">
<h3 className="text-xl font-semibold">
{task.title}
</h3>
<span
className={
task.status==="todo"
? "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold"
: task.status==="doing"
? "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
: "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"
}
>
{
task.status==="todo"
? "📝 Todo"
: task.status==="doing"
? "⚡ Doing"
: "✅ Done"
}
</span>
</div>
{task.description &&(
<p className="text-sm text-gray-500 mt-2">
{task.description}
</p>
)}
<p className="text-xs text-gray-400 mt-3">
Created: {new Date(task.createdAt).toLocaleDateString()}
</p>
<div className="flex justify-end mt-4">
<button
onClick={()=>deleteTask(task.id)}
className="text-red-500 font-semibold">
Delete
</button>
</div>
</div>
)}
</Draggable>
))}
{provided.placeholder}
</div>
)}
</Droppable>
</div>
</DragDropContext>
{ 
isOpen && (
<div className="fixed inset-0 bg-black/100 backdrop-blur-lg flex justify-center items-center">
<div className={`p-8 rounded-3xl w-96 shadow-2xl ${ darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
<h2 className="text-3xl font-bold mb-6">
Edit Task
</h2>
<input
value={editTitle}
onChange={(e)=>setEditTitle(e.target.value)}
className={`w-full p-3 rounded-xl mb-6 outline-none ${
  darkMode
  ? "bg-gray-700 text-white border-gray-600"
  : "bg-white border-gray-300"
}`}
/>
<div className="flex justify-end gap-6 mt-8">
<button
onClick={()=>setIsOpen(false)}
className={darkMode ? "text-gray-300" : "text-gray-500"}>
Cancel
</button>
<button
onClick={saveTask}
className="bg-black text-white px-5 py-2 rounded-xl">
Save
</button>
</div>
</div>
</div>
)
}
</div>
)
}
export default Tasks