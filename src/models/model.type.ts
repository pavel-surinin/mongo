import { mongoose } from '../database/mongoose'

export interface TodoModel extends mongoose.Document {
    text: string,
    completed?: boolean,
    submittedAt?: number
}

export interface Token {
    access: string,
    token: string,
    _id: string
}

export interface UserModel extends mongoose.Document {
    email: string,
    password: string,
    tokens: Token[],
    generateAuthToken: () => Promise<string>
}
