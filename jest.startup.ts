import * as jestCli from 'jest-cli'

import { Server } from './server/server'
import { environment } from './common/environment';
import { clientsRouter } from './clients/clients.router'
import { usersRouter } from './users/users.router';

let server: Server

const beforeAllTests = ()=>{
    environment.db.clients = process.env.DB_CLIENTS_URL || './data/test/test_clients.json'
    environment.server.port = process.env.SERVER_PORT || 3001
    environment.security.enableHTTPS = process.env.ENABLE_HTTPS || false,
    server = new Server()
    return server.bootstrap([clientsRouter, usersRouter])
                 .then(server=> console.log('Server is listening on: ', server.application.address()))
                 .catch(console.error)
}

const afterAllTests = ()=>{
    return server.shutdown()
}

beforeAllTests()
    .then(()=>jestCli.run())
    .then(()=>afterAllTests())
    .catch(console.error)
