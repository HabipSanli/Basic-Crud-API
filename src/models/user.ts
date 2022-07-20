export interface User{
    name : string,
    surname : string,
    email : string,
    password : string
}

export interface UserFullForm{
    name : string,
    surname : string,
    email : string,
    password : string;
    user_id : number
}

export interface LogUser{
    email : string,
    password : string
}

export interface CheckUser{
    name : string,
    surname : string
}

export interface userPassword{
    name ?: string,
    password : string
}

export interface userCredentials{
    name : string,
    surname : string,
    email : string
}