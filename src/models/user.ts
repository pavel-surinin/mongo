import { mongoose } from '../database/mongoose'
import { Schema } from 'mongoose'

export const User = mongoose.model(
    'UserMongo',
    new Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true,
            min: [6, 'Min chars count is 6']
        },
        email: {
            type: String,
            required: true,
            minlength: 5,
            trim: true
        }
    })
)
