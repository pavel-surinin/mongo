import { agent } from 'supertest'
import { application as app, path } from '../src/server'
import { User, userVisibleFields } from '../src/models/user'
import { Todo } from '../src/models/todo'
import { constants } from '../src/server.constants'
import { TodoModel } from '../src/models/model.type'
import { pick } from 'lodash'

const defaultUsers = [
    {
        _id: '5bce079f7a3b020f9c726cb1',
        email: 'email@ex.ex',
        password: 'password',
        tokens: [{ access: '1', token: 't1' }]
    },
    {
        _id: '5bce079f7a3b020f9c726cb2',
        email: 'email2@ex.ex',
        password: 'password',
        tokens: [{ access: '2', token: 't2' }]
    }
]

const defaultTodos = [
    {
        _id: '5bce079f7a3b020f9c726cb1',
        text: 'text1'
    },
    {
        _id: '5bce079f7a3b020f9c726cb2',
        text: 'text2'
    }
]

const OLD_ENV = process.env

afterEach(async () => {
    process.env = OLD_ENV
})
beforeEach(async () => {
    await User.deleteMany({})
        .then(() => defaultUsers.forEach(u => new User(u).save()))
    await Todo.deleteMany({})
        .then(() => defaultTodos.forEach(u => new Todo(u).save()))
    process.env = { ...OLD_ENV }
    process.env.NODE_ENV = 'test'
})
describe('User endpoints', () => {
    describe('GET /user', () => {
        it('should get all users', async () => {
            const { body, status } = await agent(app).get(path.user).send()
            expect(status).toBe(200)
            expect(body).toBeInstanceOf(Array)
            expect(body).toHaveLength(2)
        })
        it('should get get users by param', async () => {
            const { body, status } = await agent(app).get(path.user).query('email=email@ex.ex').send()
            expect(status).toBe(200)
            expect(body).toBeInstanceOf(Array)
            expect(body).toHaveLength(1)
            expect(body[0]).toMatchObject(pick(defaultUsers[0], userVisibleFields)
        })
        it('should check to be empty database ', async () => {
            const { status, body } = await agent(app).get(path.user).send()
            expect(status).toBe(200)
            expect(body).toBeInstanceOf(Array)
            expect(body).toHaveLength(2)
        })
    })
    describe('POST /user', () => {
        it('should create one user', async () => {
            const userPost = {
                email: 'email@qwe.rt',
                password: 'password'
            }
            const { body, status, header } = await agent(app)
                .post(path.user)
                .send(userPost)
            expect(status).toBe(201)
            expect(body).toBeInstanceOf(Object)
            expect(body.email).toBe(userPost.email)
            expect(header).toHaveProperty(constants.AUTH_HEADER)
            expect(body.tokens).toBeUndefined()
            expect(body.password).toBeUndefined()

            const users = await User.find(userPost) as any[]
            expect(users).toHaveLength(1)
            expect(users[0].email).toBe(userPost.email)
            expect(users[0].id).not.toBeUndefined()
        })
        it('should fail with invalid data to POST', done => {
            agent(app).post(path.user)
                .send({})
                .expect(400)
                .end((err, r) => {
                    expect(r.status).toBe(400)
                    expect(err).toBeDefined()
                    done()
                })
        })
    })
    describe('GET /user/:id', () => {
        it('should fail with invalid id', done => {
            agent(app).get(path.user + '/1')
                .send()
                .expect(404)
                .end((err, r) => {
                    expect(r.status).toBe(404)
                    expect(err).toBeDefined()
                    done()
                })
        })
        it('should not find by non existing id', async () => {
            const { body, status } = await agent(app).get(path.user + '/' + '7bce079f7a3b020f9c726cb3').send()
            expect(status).toBe(404)
            expect(body).toMatchObject({})
        })
        it('should find by id', async () => {
            const { body, status } = await agent(app).get(path.user + '/' + defaultUsers[0]._id).send()
            expect(status).toBe(200)
            expect(body).not.toBeNull()
            expect(body).toMatchObject(pick(defaultUsers[0], userVisibleFields))
        })
    })
    describe('DELETE /user/:id', () => {
        it('should fail with invalid id', done => {
            agent(app).delete(path.user + '/1')
                .send()
                .expect(404)
                .end((err, r) => {
                    expect(r.status).toBe(404)
                    expect(err).toBeDefined()
                    done()
                })
        })
        it('should not find by non existing id', async () => {
            const { body, status } = await agent(app).delete(path.user + '/' + '7bce079f7a3b020f9c726cb3').send()
            expect(status).toBe(404)
            expect(body).toMatchObject({})
        })
        it('should delete by id', async () => {
            const { body, status } = await agent(app).delete(path.user + '/' + defaultUsers[0]._id).send()
            expect(status).toBe(202)
            expect(body).not.toBeNull()
            expect(body).toMatchObject(pick(defaultUsers[0], userVisibleFields))

            const allUsersResponse = await agent(app).get(path.user).send()
            expect(allUsersResponse.body).toBeInstanceOf(Array)
            expect(allUsersResponse.body).toHaveLength(1)
        })
    })
})

describe('Todo endpoints', () => {
    describe('GET /todo', () => {
        it('should get all todos', async () => {
            const { body, status } = await agent(app).get(path.todo).send()
            expect(status).toBe(200)
            expect(body).toBeInstanceOf(Array)
            expect(body).toHaveLength(2)
        })
    })
    describe('POST /todo', () => {
        it('should create one todo', async () => {
            const todo: Partial<TodoModel> = {
                text: 'demo'
            }
            const { body, status } = await agent(app)
                .post(path.todo)
                .send(todo)
            expect(status).toBe(201)
            expect(body).toBeInstanceOf(Object)
            expect(body.text).toBe(todo.text)

            const todos = await Todo.find(todo) as TodoModel[]
            expect(todos).toHaveLength(1)
            expect(todos[0].text).toBe(todo.text)
        })
    })
})