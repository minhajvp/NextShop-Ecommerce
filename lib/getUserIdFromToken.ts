import { cookies } from "next/headers";

import jwt from 'jsonwebtoken'



export async function getUserIdFromToken(){
    const token = (await cookies()).get("token")?.value
    if(!token){
        return null
    }
    try{
        const decoded:any = jwt.verify(token,process.env.JWT_SECRET!)
        return decoded.id as string;
    }catch(err){
        return null
    }
}