import * as restify from 'restify'
import { NotFoundError, BadRequestError } from 'restify-errors';

export abstract class Router {
    abstract applyRoutes(application: restify.Server)

    render( response: restify.Response, next: restify.Next, 
            success: number = 200, error: number = 404, errorMsg: string = 'Missing required client data.'){
        return (document)=>{
            if(document){
                response.json(success, document)
                return next()
            }else{
                if(error === 400){
                    next(new BadRequestError(errorMsg))
                } else {
                    next(new NotFoundError('Client not found.'))
                }
            }
            
        }
    }
}
