import JWT from 'jsonwebtoken'


export const UserAuth=async(req,res)=>{
	try{
		const {token}=req.cookie
		if(!token){
			return res.json({success:false,message:"error in userAuth"})
		}
		const tokencheck= JWT.verify(token,process.env.SECRETWORD)
		if(tokencheck.id){
			req.user= {_id:tokencheck.id}
			next()
		}else{
			return res.json({success:false,message:"userauth failed"})
		}
	}catch(e){
		return res.json({success:false,message:"eror in userauth middleware."})
	}
}