import { Server } from './server/server'
import { usersRouter } from './users/users.router'
import { clientsRouter } from './clients/clients.router';

const server = new Server()

server.bootstrap([usersRouter, clientsRouter]).then(server=>{
    console.log('Server is listening on: ', server.application.address())
}).catch(error=>{
    console.log('Server failed to start')
    console.error(error)
    process.exit(1)
})



