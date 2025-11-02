import mongoose from "mongoose"

const DB=()=>{
	try{
		mongoose.connect(process.env.MONGOURL)
		console.log("db connected")
	}catch(e){
		process.exit(1)
		console.log("error in DB",e.message)
	}
}


export default DB