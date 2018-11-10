import { isEmail } from 'validator'
import { mongoose } from '../database/mongoose'
import { UserModel } from './model.type'
import { sign, verify } from 'jsonwebtoken'
import { pick } from 'lodash'

export const userVisibleFields = ['email', '_id']

const UserSchema = new mongoose.Schema({
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

/**
 * @override
 */
UserSchema.methods.toJSON = function () {
    return pick(this.toObject(), userVisibleFields)
}

UserSchema.methods.generateAuthToken = function () {
    const user = this
    const access = 'auth'
    const token = sign({ _id: user._id.toHexString(), access }, 'abc')
    user.tokens = user.tokens.concat({ access, token })
    return user.save().then(() => token)
}

UserSchema.statics.findByToken = function (token: string) {
    const StaticUser = this as mongoose.Model<UserModel>
    try {
        const decoded = verify(token, 'abc') as { _id: string, auth: string }
        return StaticUser.findOne({
            '_id': decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth'
        })
    } catch (error) {
        return Promise.reject(error)
    }
}

export type FindByToken = { findByToken(token: string): Promise<UserModel> }

export const User = mongoose.model<UserModel>('User', UserSchema) as mongoose.Model<UserModel> & FindByToken
