import { mongoose } from '../database/mongoose'
import { Schema } from 'mongoose'

export interface TodoModel extends mongoose.Document {
    text: string,
    completed?: boolean,
    submittedAt?: number
}

export const Todo = mongoose.model<TodoModel>(
    'Todo',
    new Schema({
        text: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        submittedAt: {
            type: Number
        }
    })
)
