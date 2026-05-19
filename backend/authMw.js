import jwt from "jsonwebtoken"
const middle=(req,res,next)=>{
    try{
    const a=req.headers.authorization
    const b=jwt.verify(
        a,
        "sk"
    )
    req.user=b
    if(a){
next()
}
else{
return res.json("Invalid token")
}}
    catch{
        return res.json("ehhhhh")
    }

}
export default middle