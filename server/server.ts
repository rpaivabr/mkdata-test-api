import * as restify from 'restify'
import * as fs from 'fs'
import * as corsMiddleware from 'restify-cors-middleware'
import { environment } from '../common/environment'
import { Router } from '../common/router';
import { tokenParser } from '../security/token.parser'

export class Server {

    application: restify.Server

    initRoutes(routers: Router[]): Promise<any>{
        return new Promise((resolve, reject)=>{
            try{

                const options: restify.ServerOptions = {
                    name: 'mkdata-api',
                    version: '1.0.0',
                }
                if(environment.security.enableHTTPS){
                    options.certificate = fs.readFileSync(environment.security.certificate)
                    options.key = fs.readFileSync(environment.security.key)
                }

                this.application = restify.createServer(options)
                
                const corsOptions: corsMiddleware.Options = {
                    preflightMaxAge: 10,
                    origins: ['*'],
                    allowHeaders: ['authorization'],
                    exposeHeaders: ['x-custom-header']
                }
                const cors: corsMiddleware.CorsMiddleware = corsMiddleware(corsOptions)

                this.application.pre(cors.preflight)

                this.application.use(cors.actual)
                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(tokenParser)

                //routes
                for(let router of routers){
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, ()=>{
                    resolve(this.application)
                })

            }catch(error){
                reject(error);
            }
        })
    }

    bootstrap(routers: Router[] = []): Promise<Server>{
        return this.initRoutes(routers).then(()=> this)
    }

    shutdown(){
        this.application.close()
    }
}
