export interface User {
    email: string,
    jwt: {
        expirationDate: Date,
        issueDate: Date,
        token: string,
        userId: number, 
    },
    name: string
}

export interface UserData{
    id: number,
    email: string,
    password: string,
    role: string,
    name: string,
    age: number,
    gender: string,
    enabled: boolean,
    createDate: Date,
    modifyDate: Date
}