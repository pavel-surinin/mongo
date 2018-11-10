import { mongoose } from '../database/mongoose'
import { Schema } from 'mongoose'
import { TodoModel } from './model.type'

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
