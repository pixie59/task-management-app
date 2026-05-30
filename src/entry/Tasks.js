import {useEffect,useState} from "react"
import {useParams} from "react-router-dom"
import React from "react"
import {DragDropContext,Droppable,Draggable} from "@hello-pangea/dnd"
import {motion} from "framer-motion"
const Tasks = () => {
  const [search,setSearch]=useState("")
  const [tasks,setTasks]=useState([])
  const [title,setTitle]=useState("")
  const [darkMode,setDarkMode]=useState(false)
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
    setTasks(data)
  }
useEffect(()=>{
fetchTasks()
},[])
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
boardId:Number(id)
})
})
const data=await res.json()
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
const handleDragEnd=async(result)=>{
if(!result.destination) return
const taskId=result.draggableId
const newStatus=result.destination.droppableId
const token=localStorage.getItem("token")
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
fetchTasks()
}
const filteredTasks = sortedTasks.filter((task)=>
task.title.toLowerCase().includes(search.toLowerCase()) || (task.description || "").toLowerCase().includes(search.toLowerCase())
)
const sortedTasks=[...tasks].sort((a,b)=>
sortOrder==="newest"
? new Date(b.createdAt)-new Date(a.createdAt)
: new Date(a.createdAt)-new Date(b.createdAt)
)
return (
<div className={`min-h-screen p-6 ${ darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black" }`}>
<h1 className="text-4xl font-bold text-center mb-10">
Tasks Board
</h1>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
<div className="bg-white rounded-3xl shadow-md p-6 text-center">
<h3 className="text-gray-500 mb-2">
📋 Total Tasks
</h3>
<p className="text-4xl font-bold">
{tasks.length}
</p>
</div>
<div className="bg-white rounded-3xl shadow-md p-6 text-center">
<h3 className="text-gray-500 mb-2">
⚡ In Progress
</h3>
<p className="text-4xl font-bold text-blue-600">
{sortedTasks.filter(task=>task.status==="doing").length}
</p>
</div>
<div className="bg-white rounded-3xl shadow-md p-6 text-center">
<h3 className="text-gray-500 mb-2">
✅ Completed
</h3>
<p className="text-4xl font-bold text-green-600">
{sortedTasks.filter(task=>task.status==="done").length}
</p>
</div>
</div>
<div className="max-w-2xl mx-auto mb-10">
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
:(sortedTasks.filter(task=>task.status==="done").length/tasks.length)*100
}%`
}}
>
</div>
</div>
</div>
<p className="text-center mt-3 text-lg font-semibold">
{tasks.length===0
? "0%"
: Math.round(
(sortedTasks.filter(task=>task.status==="done").length/tasks.length)*100
)
} Complete
</p>
<div className="bg-white p-8 rounded-3xl shadow-md flex flex-col gap-4 mb-10 max-w-2xl mx-auto">
<input
value={title}
type="text"
placeholder="Enter task title"
onChange={(e)=>setTitle(e.target.value)}
className="flex-1 p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
/>
<textarea
placeholder="Enter task description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
className="flex-1 p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
/>
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
className="w-full max-w-2xl mx-auto block p-3 rounded-xl border border-gray-300 mb-8 outline-none focus:ring-2 focus:ring-black"
/>
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
className="p-3 rounded-xl border border-gray-300 outline-none"
>
<option value="newest">Newest First</option>
<option value="oldest">Oldest First</option>
</select>
<DragDropContext onDragEnd={handleDragEnd}>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<Droppable droppableId="todo">
{(provided)=>(
<div
ref={provided.innerRef}
{...provided.droppableProps}
className="bg-gray-50 rounded-3xl p-4 min-h-[500px] shadow-md">
<h2 className="text-2xl font-bold mb-6 text-center text-yellow-600">
📝Todo 
<span className="ml-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
{sortedTasks.filter(task=>task.status==="todo").length}
</span>
</h2>
{tasks
.filter((task)=>task.status==="todo")
.map((task,index)=>(
<Draggable
key={task.id}
draggableId={task.id.toString()}
index={index}
>
{(provided)=>(
<div
ref={provided.innerRef}
{...provided.draggableProps}
{...provided.dragHandleProps}
className="bg-white p-5 rounded-2xl shadow-md border-l-4 border-yellow-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mb-4">
<h3 className="text-xl font-semibold">
{task.title}
</h3>
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
{(provided)=>(
<div
ref={provided.innerRef}
{...provided.droppableProps}
className="bg-gray-50 rounded-3xl p-4 min-h-[500px] shadow-md">
<h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
⚡Doing 
<span className="ml-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
{sortedTasks.filter(task=>task.status==="todo").length}
</span>
</h2>
{tasks
.filter((task)=>task.status==="doing")
.map((task,index)=>(
<Draggable
key={task.id}
draggableId={task.id.toString()}
index={index}
>
{(provided)=>(
<div
ref={provided.innerRef}
{...provided.draggableProps}
{...provided.dragHandleProps}
className="bg-white p-5 rounded-2xl shadow-md border-l-4 border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mb-4">
<h3 className="text-xl font-semibold">
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
{(provided)=>(
<div
ref={provided.innerRef}
{...provided.droppableProps}
className="bg-gray-50 rounded-3xl p-4 min-h-[500px] shadow-md">
<h2 className="text-2xl font-bold mb-6 text-center text-green-600">
✅Done 
<span className="ml-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
{sortedTasks.filter(task=>task.status==="todo").length}
</span>
</h2>
{tasks
.filter((task)=>task.status==="done")
.map((task,index)=>(
<Draggable
key={task.id}
draggableId={task.id.toString()}
index={index}
>
{(provided)=>(
<div
ref={provided.innerRef}
{...provided.draggableProps}
{...provided.dragHandleProps}
className="bg-white p-5 rounded-2xl shadow-md border-l-4 border-green-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mb-4">
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
<div className="bg-white p-8 rounded-3xl w-96 shadow-2xl border border-gray-100">
<h2 className="text-3xl font-bold mb-6">
Edit Task
</h2>
<input
value={editTitle}
onChange={(e)=>setEditTitle(e.target.value)}
className="w-full border p-3 rounded-xl mb-6 outline-none"
/>
<div className="flex justify-end gap-6 mt-8">
<button
onClick={()=>setIsOpen(false)}
className="text-gray-500">
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