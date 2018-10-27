import { Router } from '../common/router'
import * as restify from 'restify'
import { Client } from './clients.model';
import { authorize } from '../security/auth.handler'
import { NotFoundError, BadRequestError } from 'restify-errors';

class ClientsRouter extends Router {

    applyRoutes(application: restify.Server){

        application.get('/clients', authorize(), (req, res, next)=>{
            Client.findAll().then(this.render(res, next))
        })

        application.get('/clients/:id', authorize(), (req, res, next)=>{
            Client.findById(req.params.id).then(this.render(res, next))
        })

        application.post('/clients', authorize(), (req, res, next)=>{
            Client.save(req.body).then(this.render(res, next, 201, 400))
        })

        application.put('/clients/:id', authorize(), (req, res, next)=>{
            req.body.id = req.params.id
            Client.update(req.body).then(this.render(res, next, 200, 400,'Missing required client data or client not found.'))
        })

        application.del('/clients/:id', authorize(), (req, res, next)=>{
            Client.delete(req.params.id).then(this.render(res, next, 204))
        })

        application.del('/clients', authorize(), (req, res, next)=>{
            Client.deleteAll().then(this.render(res, next, 204))
        })
    }
}

export const clientsRouter = new ClientsRouter()
