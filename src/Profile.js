import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
function Profile(){
const [email,setEmail]=useState("")
const [currentPassword,setCurrentPassword]=useState("")
const [newPassword,setNewPassword]=useState("")
const [confirmPassword,setConfirmPassword]=useState("")
const [boardsCount,setBoardsCount]=useState(0)
const [tasksCount,setTasksCount]=useState(0)
const navigate = useNavigate()
useEffect(()=>{
    fetchStats()
    setEmail(localStorage.getItem("email"))},[])
const logout=()=>{
localStorage.removeItem("token")
localStorage.removeItem("email")
window.location.href="/"}
const changePassword=async()=>{
if(newPassword!==confirmPassword){
alert("Passwords do not match")
return}
const res=await fetch(
"http://localhost:5000/api/auth/change-password",{
method:"PUT",
headers:{
"Content-Type":"application/json"},
body:JSON.stringify({
email,
currentPassword,
newPassword})})
const data=await res.json()
alert(data)
setCurrentPassword("")
setNewPassword("")
setConfirmPassword("")}
const fetchStats=async()=>{
const token=localStorage.getItem("token")
const response=await fetch(
"http://localhost:5000/api/auth/profile-stats",{
headers:{
authorization:token}})
const data=await response.json()
setBoardsCount(data.boardsCount)
setTasksCount(data.tasksCount)}
return(
<div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center items-center">
<div className="bg-white p-10 rounded-3xl shadow-2xl w-[550px]">
<button
onClick={()=>navigate("/boards")}
className="mb-6 bg-light-200 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
>⬅ Back</button>
<div className="text-center mb-8">
<div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-4xl text-white mb-4">
👤
</div>
<h1 className="text-4xl font-bold">
Profile
</h1>
<p className="text-gray-500 mt-2">
{email}
</p>
</div>
<div className="mb-6">
<p className="text-gray-500">
Email
</p>
<p className="text-xl font-semibold">
{email}
</p>
</div>
<div className="grid grid-cols-2 gap-4 mb-8">
<div className="bg-blue-50 p-4 rounded-2xl text-center shadow-sm">
<h3 className="text-sm text-gray-500">
Boards
</h3>
<p className="text-3xl font-bold text-blue-600">{boardsCount}</p>
</div>
<div className="bg-green-50 p-4 rounded-2xl text-center shadow-sm">
<h3 className="text-sm text-gray-500">
Tasks
</h3>
<p className="text-3xl font-bold text-green-600">{tasksCount}</p>
</div>
</div>
<button
onClick={()=>window.location.href="/change-password"}
className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-2xl mb-4 hover:scale-[1.02] transition">
Change Password
</button>
<h2 className="text-2xl font-bold mt-8 mb-4">
Change Password
</h2>
<input
type="password"
placeholder="Current Password"
value={currentPassword}
onChange={(e)=>setCurrentPassword(e.target.value)}
className="w-full border border-gray-300 p-3 rounded-2xl mb-3 outline-none focus:ring-2 focus:ring-indigo-500"/>
<input
type="password"
placeholder="New Password"
value={newPassword}
onChange={(e)=>setNewPassword(e.target.value)}
className="w-full border border-gray-300 p-3 rounded-2xl mb-3 outline-none focus:ring-2 focus:ring-indigo-500"/>
<input
type="password"
placeholder="Confirm Password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
className="w-full border p-3 rounded-xl mb-4"/>
<button
onClick={changePassword}
className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-2xl mb-4 hover:scale-[1.02] transition">
Update Password
</button>
<button
onClick={logout}
className="w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-800 transition">
Logout
</button>
</div>
</div>)}
export default Profile