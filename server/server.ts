import * as restify from 'restify'
import * as fs from 'fs'
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
