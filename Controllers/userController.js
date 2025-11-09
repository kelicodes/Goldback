import user from "../Models/Usermodel.js"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"

export const userRegistration=async (req,res)=>{
	try{
		const {name,email,password}=req.body
		if(!name || !email || !password){
			return res.json({success:false,message:"all fields are required"})
		}
		const existingmail=await user.findOne({email})
		if(existingmail){
			return res.json({success:false,message:"user with email already registred"})
		}
		const salt= await bcrypt.genSalt(10)
		const hashedpassword=await bcrypt.hash(password,salt)

		const newuser= new user({
			name:req.body.name,
			password:hashedpassword,
			email:req.body.email
		})

		await newuser.save()
		const token=JWT.sign({id:newuser._id},process.env.SECRETWORD)
		res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true if using HTTPS
  maxAge: 1000 * 60 * 60 * 24, // 1 day
});


		return res.json({success:true,message:"userRegistration successfull",token})
	}catch(e){
		console.log(e)
		return res.json({message:"user reg failed",success:false})
	}
}


export const userSignin=async(req,res)=>{
	try{
		const {email,password}=req.body
		if(!email || !password){
			return res.json({success:false,message:"all fields are required."})
		}
		const theuser= await user.findOne({email})
		if(!theuser){
			return res.json({success:false,message:"user with email dpenot exists."})
		}

		const passwordcompare= await bcrypt.compare(password,theuser.password)
		if(!passwordcompare){
			return res.json({success:false,message:"invalid password"})
		}
		const token=JWT.sign({id:theuser._id},process.env.SECRETWORD)
		res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true if using HTTPS
  maxAge: 1000 * 60 * 60 * 24, // 1 day
});

		return res.json({success:true,message:"user signin successfull",token})
	}catch(e){
		console.log(e)
		return res.json({message:"user login failed",success:false})
	}
}


export const logout=async(req,res)=>{
	try{
		res.clearCookie('token')
		return res.json({success:true,message:"user logged out"})
	}catch(e){
		return res.json({success:false,messaagfe:e.message})
	}
}