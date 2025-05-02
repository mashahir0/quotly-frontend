 export interface User {
    _id : string,
    name : string,
    photo?:string,
    email : string,
    password ?: string,
    userStatus ?: "Active" | "Blocked";
 }