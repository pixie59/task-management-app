import { useEffect, useState } from "react"
function Profile(){
const [email,setEmail]=useState("")
const [currentPassword,setCurrentPassword]=useState("")
const [newPassword,setNewPassword]=useState("")
const [confirmPassword,setConfirmPassword]=useState("")
useEffect(()=>{
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
return(
<div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center items-center">
<div className="bg-white p-10 rounded-3xl shadow-xl w-[500px]">
<h1 className="text-4xl font-bold text-center mb-8">
👤 Profile
</h1>
<div className="mb-6">
<p className="text-gray-500">
Email
</p>
<p className="text-xl font-semibold">
{email}
</p>
</div>
<button
onClick={()=>window.location.href="/change-password"}
className="w-full bg-blue-500 text-white py-3 rounded-xl mb-4">
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
className="w-full border p-3 rounded-xl mb-3"/>
<input
type="password"
placeholder="New Password"
value={newPassword}
onChange={(e)=>setNewPassword(e.target.value)}
className="w-full border p-3 rounded-xl mb-3"/>
<input
type="password"
placeholder="Confirm Password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
className="w-full border p-3 rounded-xl mb-4"/>
<button
onClick={changePassword}
className="w-full bg-blue-500 text-white py-3 rounded-xl mb-4">
Update Password
</button>
<button
onClick={logout}
className="w-full bg-red-500 text-white py-3 rounded-xl">
Logout
</button>
</div>
</div>)}
export default Profile