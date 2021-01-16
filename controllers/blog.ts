import { renderFileToString} from 'https://deno.land/x/dejs/mod.ts';
import { select ,  insert } from '../models/pg_model.ts';
import TSql from '../models/sql.ts';
// import { makeJwt, setExpiration, Jose, Payload } from 'https://deno.land/x/djwt@v1.7/create.ts';
import { create, getNumericDate, verify } from 'https://deno.land/x/djwt/mod.ts';
import type { Header, Payload } from 'https://deno.land/x/djwt/mod.ts';



const home = async({response, state} : {response : any, state: any}) => {
    let userLoged : string ='User Tamu';
    if((state.currentUser != undefined) && (state.currentUser != '')){
        userLoged = state.currentUser;
    }
    
    const dataTabel = await select(
        [
        {text : TSql['ktgFindAll']},
        {text : TSql['BlogInfoFindAll']}
        ]
    )
    const html = await renderFileToString("./views/home.ejs", {
        data : {
            pemrograman : dataTabel[0],
            blogInfo : dataTabel[1],
            userInfo : userLoged
        },
        subview : {
            namafile : "./views/blog-main.ejs",
            showjumbutron : true
        }
    });
    response.body = new TextEncoder().encode(html);


}
const signup = async({response , request, state} : {response : any, request : any , state : any}) => {
    if(!request.hasBody){
        let signupError : string = '';
        if((state.pesanError != undefined) && (state.pesanError != '')){
            signupError = state.pesanError;
        }
    const html = await renderFileToString("./views/home.ejs", {
        data :{
            pemrograman : await select({
                text : TSql['ktgFindInKode'],
                args : ['php', 'ts', 'js']
            }),
            blogInfo : await select({
                text : TSql['BlogInfoFindAll']
            }),
            statusSignup : signupError
        },

        subview : {
            namafile : "./views/signup.ejs",
            showjumbutron : false
        },
        
    });
    
    response.body = new TextEncoder().encode(html);
    
}else{
    const body = await request.body().value;
    const parseData = new URLSearchParams(body)
    const namalengkap = parseData.get("fullname");
    const namauser = parseData.get("username");
    const pwd = parseData.get("passwd");
   
    let hasil = await insert({
        text : TSql['InUser'],
        args : [namauser, namalengkap, pwd]
    })
    if(hasil[0] == 'Sukses'){
        state.pesanError = '';
        response.body = "sukses menyimpan data ke database";
    }else{
        state.pesanError = hasil[1];
        response.redirect('/daftar');
    }
   
}

}

const login = async({response , request, state, cookies} : {response : any, request : any , state : any, cookies : any}) => {  
    if(!request.hasBody){
        let loginError : string = '';
        if((state.statusLogin != undefined) && (state.statusLogin != '')){
            loginError = state.statusLogin;
        }

        let userLoged : string ='User Tamu';
        if((state.currentUser != undefined) && (state.currentUser != '')){
            userLoged = state.currentUser;
        }
        const html = await renderFileToString("./views/home.ejs", {
            data :{
                pemrograman : await select({
                    text : TSql['ktgFindInKode'],
                    args : ['php', 'ts', 'js']
                }),
                blogInfo : await select({
                    text : TSql['BlogInfoFindAll']
                }),
                statusLogin : loginError,
                userInfo : userLoged
            },
    
            subview : {
                namafile : "./views/login.ejs",
                showjumbutron : false
            }
            
        });
        
        response.body = new TextEncoder().encode(html);
    }else{
        const body = await request.body().value;
        const parseData = new URLSearchParams(body);
        const namauser : string = parseData.get("username") || '' ;
        const pwd = parseData.get("passwd");

        let hasil = await select({
            text : TSql['SelUser'],
            args : [namauser, pwd]
        });

        if(hasil.length > 0){
            const key = "you-secreat";
            const payload : Payload ={
                iss: namauser,
                exp: getNumericDate(new Date().getTime()+1000 * 60 * 60),
            };
            const header : Header = {
                alg: "HS256",
                typ: "JWT",
            };

            const jwt = await create(header, payload, key);
            cookies.set("jwt_saya",jwt);

            state.statusLogin = '';
            response.body = 'sukses login';
        }else{
            state.statusLogin = 'Username atau password anda salah!';
            response.redirect('/login');
        }
    }
}

const kategori = async({params , response} : {params :{id : string}, response:any }) =>{
    response.body = "ID parameter : " + params.id;
}


export{home , signup , kategori, login}