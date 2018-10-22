import { Db } from 'mongodb'
import { Request, Response } from 'express'

export interface Endpoint {
    url: string
    fx: (db: Promise<Db>) => (req: Request, res: Response) => void
}

export interface EndpointGroup extends DatabaseNameAware {
    endpoints: { [keyof: string]: Endpoint }
}

export type DatabaseNameAware = {dababaseName: string}

export const todoAppEndpointGroup = {
    endpoints: {
        read: {
            url: '/read/:table',
            fx: (db: Promise<Db>) => (req: Request, res: Response) => db
                .then(getCollection(req.params['table']))
                .then(c => c.find(req.query).toArray())
                .then(r => res.json(r))
    
        } as Endpoint,
        write: {
            url: '/write/:table',
            fx: (db: Promise<Db>) => (req: Request, res: Response) => db
                .then(getCollection(req.params['table']))
                .then(c => c.insertOne(req.body))
                .then(r => res.json(r.ops))
        } as Endpoint,
        deleteOne: {
            url: '/delete/:table',
            fx: (db: Promise<Db>) => (req: Request, res: Response) => db
                .then(getCollection(req.params['table']))
                .then(c => c.findOneAndDelete(req.query))
                .then(r => res.json(r))
        } as Endpoint,
        update: {
            url: '/update/:table',
            fx: (db: Promise<Db>) => (req: Request, res: Response) => db
                .then(getCollection(req.params['table']))
                .then(c => c.updateOne(req.query, {$set: req.body}, {upsert: false} ))
                .then(r => res.json(r.result))
        } as Endpoint
    },
    dababaseName: 'TodoApp'
}

const getCollection = (name: string) => (db: Db) => db.collection(name)