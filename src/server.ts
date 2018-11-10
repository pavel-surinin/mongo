
if (!process.env.NODE_ENV) {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
    process.env.PORT = '3000'
}

if (process.env.NODE_ENV === 'test') {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
    process.env.PORT = '3000'
}

import Express from 'express'
import { json } from 'body-parser'
import { User } from './models/user'
import { Todo } from './models/todo'
import helmet from 'helmet'
import { inCase } from 'declarative-js'
import { pick } from 'lodash'
import { constants as c } from './server.constants'

export const path = {
    user: '/user',
    todo: '/todos'
}

const app = Express()
app.use(json())
app.use(helmet())
app
    .post(path.user, (req, res) => {
        const user = new User(pick(req.body, 'email', 'password'))
        return user.save()
            .then(() => user.generateAuthToken())
            .then(token => res.header(c.AUTH_HEADER, token).status(201).json(user))
            .catch(err => res.status(400).send(err))
    }
    )
    .get(path.user + '/me', (req, res) => User.findByToken(req.header(c.AUTH_HEADER)!)
        .then(user => {
            if (user) {
                res.send(user)
            }
            throw Error()
        })
        .catch(() => res.status(401).send())
    )

    .get(path.user, (req, res) => User.find(req.query)
        .then(r => res.json(r))
        .catch(err => res.status(400).send(err))
    )
    .delete(path.user + '/:id', (req, res) => {
        return User.findByIdAndRemove(req.params['id'])
            .then(doc => {
                inCase(doc).null().do(() => res.status(404).send())
                inCase(doc).nonNull().do(() => res.status(202).send(doc))
            })
            .catch(err => res.status(404).send(err))
    })
    .post(path.todo, (req, res) => new Todo(pick(req.body, 'text', 'completed', 'submittedAt')).save()
        .then(r => res.status(201).json(r))
        .catch(err => res.status(400).send(err))
    )
    .get(path.todo, (req, res) => User.find(req.query)
        .then(r => res.json(r))
        .catch(err => res.status(400).send(err))
    )

const logStartUp = (err: Error) => {
    if (err) {
        // tslint:disable-next-line:no-console
        console.log(err)
    }
    // tslint:disable-next-line:no-console
    console.log(`server is listening on ${process.env.PORT}`)
    // tslint:disable-next-line:no-console
    console.log(`database url ${process.env.MONGODB_URI}`)
}
app.listen(process.env.PORT, logStartUp)
export const application: any = app