import product from "../Models/Productmodel.js" 



export const productUpload=async(req,res)=>{
	try{
		const {name,price,category,desc}=req.body

		const image1 = req.files?.image1?.[0]?.path;
        const image2 = req.files?.image2?.[0]?.path;
        const image3 = req.files?.image3?.[0]?.path;
        const image4 = req.files?.image4?.[0]?.path;

        const imagesurl = [image1, image2, image3, image4].filter(Boolean);

        if(!name || !price || !category || !desc ){
        	return res.json({
        		success:false,
        		message:"all fields are required"
        	})
        }

		if(imagesurl.length < 1){
			return res.json({message:"an immage is required",success:false})
		}


		const newproduct= new product({
			name:req.body.name,
			price,
			category,
			desc,
			images:imagesurl
		})

		await newproduct.save()
		return res.json({success:true,message:"product upload successfull"})
	}catch(e){
		console.log(e)
		return res.json({message:"product upload failed",success:false})
	}
}

export const fetchproducts=async(req,res)=>{
	try{
		const products= await product.find({})
		return res.json({success:true,message:"products fetvhed",products})
	}catch(e){
		console.log(e)
		return res.json({message:"fecthproduct failed",success:false})
	}
}


export const fetchproduct=async(req,res)=>{
	try{
		const {productid}=req.params
		const theproduct= await product.findById({productid})
		return res.json({success:true,message:"product fetched",theproduct})
	}catch(e){
		console.log(e)
		return res.json({message:"fetchproduct failed",success:false,})
	}
}


export const removeProduct=async(req,res)=>{
	try{
		const {itemId}=req.params
		await product.findByIdAndDelete(itemId)
		return res.json({success:true,message:"product remove"})
	}catch(e){
		console.log(e)
		return res.json({success:false,message:"product removed"})
	}
}