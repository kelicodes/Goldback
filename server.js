import express from 'express'
import userRouter from "./Routes/userRouter.js"
import productRouter from "./Routes/productRoute.js"
import DB from "./Config/DB.js"
import "dotenv/config"
import cors from "cors"



const app=express()
const PORT = process.env.PORT || 4000
app.use(express.json())
app.use(cors({
	origin:"http://localhost:5173",
	credentials:true
}))



DB()

app.use('/user',userRouter)
app.use('/products',productRouter)


app.listen(PORT,()=>{
	console.log(`listening on port ${PORT}`)
})