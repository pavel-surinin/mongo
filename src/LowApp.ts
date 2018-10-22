import e from 'express'
import { json } from 'body-parser'
import { Router } from 'express'
import { MongoClient, Db } from 'mongodb'
import { todoAppEndpointGroup } from './endpoint/Endpoint'
import helmet from 'helmet'
function connect() { return MongoClient.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }) }
const getDb = (name: string) => (client: MongoClient): Db => client.db(name)

const app = () => {
    const express = e()
    const router = Router()
    const db = connect().then(getDb(todoAppEndpointGroup.dababaseName))
    const { deleteOne, read, update, write } = todoAppEndpointGroup.endpoints
    router
        .get('/', (req, res) => req && res.json({ message: 'Hello world' }))
        .get(read.url, read.fx(db))
        .post(write.url, write.fx(db))
        .put(update.url, update.fx(db))
        .delete(deleteOne.url, deleteOne.fx(db))
    express.use(json())
    express.use(helmet())
    express.use('/', router)
    return express
}

export const application: e.Express = app()
