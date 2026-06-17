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
  const [priority,setPriority]=useState("")
  const [dueDate,setDueDate]=useState("")
  const [filterStatus,setFilterStatus]=useState("all")
  const [darkMode,setDarkMode]=useState(()=>{
return localStorage.getItem("darkMode")==="true"
})
  const [sortOrder,setSortOrder]=useState("newest")
  const getDueDateColor = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diff =
    Math.ceil(
      (due - today) /
      (1000 * 60 * 60 * 24)
    );
  if (diff < 0)
    return "border-red-500";
  if (diff <= 3)
    return "border-yellow-500";
  return "border-green-500";
};
  const [description,setDescription]=useState("")
  const {id}=useParams()
  const [loading,setLoading]=useState(false)
  const [isOpen,setIsOpen]=useState(false)
const [editTitle,setEditTitle]=useState("")
const [editDescription,setEditDescription]=useState("")
const [selectedTask,setSelectedTask]=useState(null)
const [showDeleteModal,setShowDeleteModal]=useState(false)
const [deleteTaskId,setDeleteTaskId]=useState(null)
const [taskComments,setTaskComments]=useState({})
const [commentDrafts,setCommentDrafts]=useState({})

const getTaskComments = (taskId) => taskComments[taskId] || []
const handleCommentDraftChange = (taskId, value) =>
  setCommentDrafts((prev) => ({ ...prev, [taskId]: value }))
const addTaskComment = (taskId) => {
  const commentText = (commentDrafts[taskId] || "").trim()
  if (!commentText) return
  setTaskComments((prev) => ({
    ...prev,
    [taskId]: [
      ...(prev[taskId] || []),
      { id: Date.now(), author: "You", text: commentText },
    ],
  }))
  setCommentDrafts((prev) => ({ ...prev, [taskId]: "" }))
}

const renderCommentSection = (task) => (
  <div className={`mt-4 rounded-2xl border px-4 py-3 ${darkMode ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
    <div className="flex items-center justify-between">
      <span className="font-semibold">💬 Comments</span>
      <span className="text-xs text-slate-400">{getTaskComments(task.id).length} saved</span>
    </div>
    <div className="mt-3 space-y-2 text-sm">
      {getTaskComments(task.id).length > 0 ? (
        getTaskComments(task.id).map((comment) => (
          <p key={comment.id}>
            <span className="font-semibold">{comment.author}:</span> {comment.text}
          </p>
        ))
      ) : (
        <p className="text-slate-500">No comments yet. Add one below.</p>
      )}
    </div>
    <div className="mt-3 space-y-3">
      <textarea
        value={commentDrafts[task.id] || ""}
        onChange={(e) => handleCommentDraftChange(task.id, e.target.value)}
        rows={2}
        placeholder="Write a comment..."
        className={`w-full rounded-2xl border px-3 py-2 bg-transparent outline-none ${darkMode ? "border-slate-700 text-white placeholder:text-slate-500" : "border-slate-200 text-slate-900 placeholder:text-slate-400"}`}
      />
      <button
        onClick={() => addTaskComment(task.id)}
        className="rounded-2xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Add comment
      </button>
    </div>
  </div>
)

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
  const res=await fetch(`http://localhost:5000/api/task/create-task`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      authorization:token
    },
    body:JSON.stringify({
      title:title,
      description:description,
      boardId:Number(id),
      dueDate,
      priority
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
const requestDeleteTask=(id)=>{
  setDeleteTaskId(id)
  setShowDeleteModal(true)
}
const cancelDeleteTask=()=>{
  setDeleteTaskId(null)
  setShowDeleteModal(false)
}
const deleteTask=async()=>{
  if(!deleteTaskId) return
  const token=localStorage.getItem("token")
  await fetch(`http://localhost:5000/api/task/${deleteTaskId}`,{
    method:"DELETE",
    headers:{
      authorization:token
    }
  })
  socket.emit("task-deleted", deleteTaskId)
  setShowDeleteModal(false)
  setDeleteTaskId(null)
  fetchTasks()
}
const editTask=(task)=>{
  setSelectedTask(task)
  setEditTitle(task.title)
  setEditDescription(task.description || "")
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
    title:editTitle,
    description:editDescription
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

const getNotifications = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return sortedTasks
    .filter((task) => task.dueDate)
    .map((task) => {
      const due = new Date(task.dueDate)
      due.setHours(0, 0, 0, 0)
      const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24))
      if (diffDays < 0) {
        return { id: task.id, message: `Task "${task.title}" is overdue.` }
      }
      if (diffDays === 1) {
        return { id: task.id, message: `Task "${task.title}" is due tomorrow.` }
      }
      return null
    })
    .filter(Boolean)
}
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
{/* <button
onClick={()=>window.location.href="/profile"}
className="bg-blue-500 text-white px-5 py-2 rounded-full"
>
Profile
</button> */}
<button onClick={() => (window.location.href = "/profile")} className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition border border-gray-700">
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
      <div className={`mx-auto max-w-4xl mb-8 rounded-3xl p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        <p className="text-xl font-semibold mb-4">🔔 Notifications</p>
        {getNotifications().length > 0 ? (
          <div className="space-y-2">
            {getNotifications().map((notification) => (
              <p key={notification.id} className={`rounded-2xl border p-4 text-sm ${darkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                {notification.message}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No urgent notifications right now.</p>
        )}
      </div>
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
className="w-full border p-3 rounded-xl text-gray-400 outline-none focus:ring-2 focus:ring-black bg-white"
/>
<select
  value={priority}
  onChange={(e)=>setPriority(e.target.value)}
  className="w-full border p-3 rounded-xl text-gray-400 outline-none focus:ring-2 focus:ring-black bg-white"
>
  <option value="" disabled>
    Select Priority
  </option>

  <option value="high">🔴 High</option>
  <option value="medium">🟡 Medium</option>
  <option value="low">🟢 Low</option>
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
{renderCommentSection(task)}
<div className="flex justify-between items-center mt-4">
<button
onClick={()=>moveToDoing(task.id)}
className="bg-black text-white px-4 py-2 rounded-lg">
Move to Doing
</button>
<div className="flex gap-4">
<button
onClick={()=>requestDeleteTask(task.id)}
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
className={`p-5 rounded-2xl shadow-md border-l-4 border-blue-500 hover:shadow-xl hover:-translate-y-1 cursor-grab active:cursor-grabbing transition-all duration-300 mb-4 ${
snapshot.isDragging ? "scale-105 rotate-1 shadow-2xl" : ""
} ${
darkMode ? "bg-gray-700 text-white" : "bg-white"
}`}
>

<h3 className="text-xl font-semibold">
{task.title}
</h3>

{
task.dueDate && (
<>
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

<p className="text-sm text-gray-500 mt-2">
📅 Due: {new Date(task.dueDate).toLocaleDateString("en-GB")}
</p>
</>)}

{renderCommentSection(task)}
<div className="flex justify-between items-center mt-4">
  <button
    onClick={()=>moveToDone(task.id)}
    className="bg-black text-white px-4 py-2 rounded-lg"
  >
    Move to Done
  </button>
  <div className="flex gap-4">
    <button
      onClick={()=>requestDeleteTask(task.id)}
      className="text-red-500 font-semibold"
    >
      Delete
    </button>
    <button
      onClick={()=>editTask(task)}
      className="text-blue-500 font-semibold"
    >
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
{renderCommentSection(task)}
<p className="text-xs text-gray-400 mt-3">
Created: {new Date(task.createdAt).toLocaleDateString()}
</p>
<div className="flex justify-end mt-4">
<button
onClick={()=>requestDeleteTask(task.id)}
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
<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 px-4">
  <div className={`w-full max-w-md rounded-3xl border ${darkMode ? "border-white/10 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-900"} p-6 shadow-2xl`}>
    <div className="mb-5">
      <h2 className="text-2xl font-semibold">Edit Task</h2>
      <p className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
        Update the task title and save your changes.
      </p>
    </div>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-400">Task title</label>
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className={`mt-2 w-full rounded-2xl border px-4 py-3 text-base outline-none transition ${darkMode ? "border-slate-700 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-900"}`}
          placeholder="Enter new title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-400">Description</label>
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          rows={4}
          className={`mt-2 w-full rounded-2xl border px-4 py-3 text-base outline-none transition ${darkMode ? "border-slate-700 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-900"}`}
          placeholder="Update description"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          onClick={() => setIsOpen(false)}
          className={`rounded-2xl px-5 py-3 text-sm font-medium transition ${darkMode ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
        >
          Cancel
        </button>
        <button
          onClick={saveTask}
          className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</div>
)
}
{showDeleteModal && (
<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 px-4">
  <div className={`w-full max-w-md rounded-[28px] border ${darkMode ? "border-white/10 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-900"} p-6 shadow-2xl`}> 
    <div className="mb-5">
      <p className="text-sm uppercase tracking-[0.24em] text-red-400">Confirm delete</p>
      <h2 className="mt-3 text-3xl font-semibold">Delete this task?</h2>
      <p className="mt-2 text-sm text-slate-500">This action cannot be undone. The task will be permanently removed.</p>
    </div>
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <button
        onClick={cancelDeleteTask}
        className={`rounded-3xl px-5 py-3 font-medium transition ${darkMode ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
      >
        Cancel
      </button>
      <button
        onClick={deleteTask}
        className="rounded-3xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
      >
        Delete task
      </button>
    </div>
  </div>
</div>
)}
</div>
)
}
export default Tasks