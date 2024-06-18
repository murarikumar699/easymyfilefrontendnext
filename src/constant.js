import { env } from "./env"
let backendUrl = "";
let url = "";
if(env.server === 'local'){
    backendUrl = 'http://localhost:4000';
    url = 'http://localhost:3000';
}else{
    backendUrl = 'http://65.0.32.114:4000';
    url = 'http://65.0.32.114:3000'
}
const constant =  {
        "url" :  backendUrl,
        "projectName" :"easymyfile",
        "deleteImage":url+"/bin.png",
        "menuImage":url+"/menu.png",
        "logo":url+"/logo.png"
}
export default constant;
