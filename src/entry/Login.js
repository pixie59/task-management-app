import { useState } from "react"
function Login(){
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [isSignup,setIsSignup]=useState(false)
    const handleLogin=async()=>{
        const response=await fetch(`http://localhost:5000/api/auth/${isSignup ? "signup" : "login"}`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email,
            password
        })
    })
    const data=await response.json()
    if(data==="Incorrect password" || data==="User does not exist"){
        alert(data)
    }
    else{
localStorage.setItem("token", data.token)
localStorage.setItem("email",email)
        window.location.href="/boards"
    }
    }
    return(
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-96">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">{isSignup ? "Create Account" : "Welcome Back"}</h1>
            <input type="email" placeholder="Enter email" onChange={(e)=>setEmail(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-black"/>
            <input type="password" placeholder="Enter password" onChange={(e)=>setPassword(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-black"/>
            <button onClick={handleLogin} className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-500 transition duration-300">{isSignup ? "Signup" : "Login"}</button>
            <p onClick={()=>setIsSignup(!isSignup)} className="text-center mt-4 cursor-pointer text-grey-600">
                {isSignup?"Already have an account? Login": "Don't have an account? Signup"}
            </p>
        </div>
    </div>
    )
}

export default Login