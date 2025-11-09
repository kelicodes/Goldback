import express from 'express'
import userRouter from "./Routes/userRouter.js"
import productRouter from "./Routes/productRoute.js"
import DB from "./Config/DB.js"
import "dotenv/config"
import cookieParser from "cookie-parser";
import cors from "cors"
import Cartrouter from './Routes/Cartroutes.js'
import Orderrouter from './Routes/OrderRoutes.js'
import Pesarouter from './Routes/Pesaroutes.js'



const app=express()
const PORT = process.env.PORT || 4000
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
	origin:["http://localhost:5173","https://mygold-two.vercel.app"],
	credentials: true,
}))



DB()

app.use('/user',userRouter)
app.use('/products',productRouter)
app.use('/cart',Cartrouter)
app.use("/orders",Orderrouter)
app.use("/pesa",Pesarouter)


app.listen(PORT,()=>{
	console.log(`listening on port ${PORT}`)
})