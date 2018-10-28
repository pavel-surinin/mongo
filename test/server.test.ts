import { agent } from 'supertest'
import { application as app, path } from '../src/server'
import { User } from '../src/models/user'

const defaultUsers = [
    {
        _id: '5bce079f7a3b020f9c726cb1',
        name: 'one',
        email: 'email',
        password: 'password'
    },
    {
        _id: '5bce079f7a3b020f9c726cb2',
        name: 'two',
        email: 'email',
        password: 'password'
    }
]

beforeEach(done => {
    User.deleteMany({})
        .then(() => defaultUsers.forEach(u => new User(u).save()))
        .then(() => done())
})

describe('User endpoints', () => {
    describe('GET /todos', () => {
        it('should get all users', async () => {
            const { body, status } = await agent(app).get(path.user).send()
            expect(status).toBe(200);
            expect(body).toBeInstanceOf(Array)
            expect(body).toHaveLength(2)
        });
        it('should get get users by param', async () => {
            const { body, status } = await agent(app).get(path.user).query('name=one').send()
            expect(status).toBe(200);
            expect(body).toBeInstanceOf(Array)
            expect(body).toHaveLength(1)
            expect(body[0]).toMatchObject(defaultUsers[0])
        });
        it('should check to be empty database ', async () => {
            const { status, body } = await agent(app).get(path.user).send()
            expect(status).toBe(200)
            expect(body).toBeInstanceOf(Array)
            expect(body).toHaveLength(2)
        });
    });
    describe('POST /todos', () => {
        it('should create one user', async () => {
            const userPost = {
                name: 'name',
                email: 'email',
                password: 'password'
            };
            const { body, status } = await agent(app)
                .post(path.user)
                .send(userPost)
            expect(status).toBe(201)
            expect(body).toBeInstanceOf(Object)
            expect(body.name).toBe('name')
            expect(body.email).toBe('email')
            expect(body.password).toBe('password')

            const users = await User.find(userPost) as any[]
            expect(users).toHaveLength(1)
            expect(users[0].name).toBe(userPost.name)
            expect(users[0].email).toBe(userPost.email)
            expect(users[0].password).toBe(userPost.password)
            expect(users[0].id).not.toBeUndefined()
        });
        it('should fail with invalid data to POST', done => {
            agent(app).post(path.user)
                .send({})
                .expect(400)
                .end((err, r) => {
                    expect(r.status).toBe(400)
                    expect(err).toBeDefined()
                    done()
                })
        });
    });
    describe('GET /todos/:id', () => {
        it('should fail with invalid id', done => {
            agent(app).get(path.user + '/1')
                .send()
                .expect(404)
                .end((err, r) => {
                    expect(r.status).toBe(404)
                    expect(err).toBeDefined()
                    done()
                })
        });
        it('should not  find by non existing id', async () => {
            const { body, status } = await agent(app).get(path.user + '/' + '7bce079f7a3b020f9c726cb3').send()
            expect(status).toBe(404);
            expect(body).toMatchObject({});
        });
        it('should find by id', async () => {
            const { body, status } = await agent(app).get(path.user + '/' + defaultUsers[0]._id).send()
            expect(status).toBe(200);
            expect(body).not.toBeNull();
            expect(body).toMatchObject(defaultUsers[0]);
        });
    });
});