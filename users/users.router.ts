import { Router } from '../common/router'
import * as restify from 'restify'
import { authenticate } from '../security/auth.handler'

class UsersRouter extends Router {

    applyRoutes(application: restify.Server){

        application.post('/users/auth', authenticate)
    }
}

export const usersRouter = new UsersRouter()