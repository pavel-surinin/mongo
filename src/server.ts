import Express from 'express'
import { json } from 'body-parser'
import { User } from './models/user'
import { Todo } from './models/todo'
import helmet from 'helmet'

/**
 * 
 */
export const path = {
    user: '/user',
    todo: '/todos'
}

const app = Express()
app.use(json())
app.use(helmet())

app
    .post(path.user, (req, res) => new User(req.body).save()
        .then(r => res.status(201).json(r))
        .catch(err => res.status(400).send(err))
    )
    .get(path.user, (req, res) => User.find(req.query)
        .then(r => res.json(r))
        .catch(err => res.status(400).send(err))
    )
    .delete(path.user, (req, res) => User.deleteOne(req.query)
        .then(r => res.json(r))
        .catch(err => res.status(400).send(err))
    )

app
    .post(path.todo, (req, res) => new Todo(req.body)
        .save()
        .then(r => res.json(r))
    )
    .get(path.todo, (req, res) => Todo.find(req.query).then(r => res.json(r))
    )

export { app }
