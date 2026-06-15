import jwt from "jsonwebtoken"
const middle=(req,res,next)=>{
    try{
        const a=req.headers.authorization
        if(a){
            const b=jwt.verify(
                a,
                "sk"
            )
            req.user=b
            next()
        }
        else{
            return res.status(401).json("Invalid Token")
        }
    }
    catch(error){
    console.log(error)
    return res.status(401).json(error.message)
}
}
export default middle