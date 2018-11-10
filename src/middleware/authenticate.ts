import { User } from '../models/user'
import { constants } from '../server.constants'
import { NextFunction } from 'express'
export const authenticate = (req: any, res: any, next: NextFunction) => {
    const token = (req.header(constants.AUTH_HEADER)!)
    return User.findByToken(token)
        .then(user => {
            if (user) {
                req.token = token
                req.user = user
                next()
            }
            throw Error()
        })
        .catch(() => res.status(401).send())
}