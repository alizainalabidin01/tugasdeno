import { verify } from 'https://deno.land/x/djwt/mod.ts';


const userMidleware = async({cookies, state} : {cookies:any , state : any} , next : Function) => {
    const jwt = cookies.get("jwt_saya");
    if(jwt){
        const key = "you-secreat";
        const data : any =  await verify(jwt, key,  "HS256");
        if(data.isValid){
            const username = data.payload.iss;
            state.currentUser = username;
            console.log("oke");
        }else{
            state.currentUser = '';
            cookies.delete("jwt_saya");
            console.log("gagal")
        }
    }
    await next();
}
export default userMidleware;