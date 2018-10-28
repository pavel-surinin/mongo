import Express from 'express'
import { json } from 'body-parser'
import { User } from './models/user'
import { Todo } from './models/todo'
import helmet from 'helmet'
import { inCase } from 'declarative-js'

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
    .get(path.user + '/:id', (req, res) => {
        return User.findById(req.params['id'])
            .then(r => {
                inCase(r).null().do(() => res.status(404).send())
                inCase(r).nonNull().do(() => res.status(200).send(r))
            })
            .catch(err => res.status(404).send(err))
    }
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

export const application: any = app