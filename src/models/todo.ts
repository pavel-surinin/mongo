import { mongoose } from '../database/mongoose'
import { Schema } from 'mongoose'

export const Todo = mongoose.model(
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
        submitedAt: {
            type: Number
        }
    })
)
