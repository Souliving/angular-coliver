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