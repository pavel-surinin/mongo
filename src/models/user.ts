import { mongoose } from '../database/mongoose'
import { Schema } from 'mongoose'
import { isEmail } from 'validator'

export interface UserModel extends mongoose.Document {
    email: string,
    password: string,
    tokens: {
        access: string,
        token: string
    }
}

export const User = mongoose.model<UserModel>(
    'UserMongo',
    new Schema({
        password: {
            type: String,
            required: true,
            trim: true,
            min: [6, 'Min chars count is 6']
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: isEmail,
                message: (props: any) => `${props.value} is not an email`
            }
        },
        tokens: [{
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }]
    })
)
