import 'jest'
import * as request from 'supertest'

let address: string = (<any>global).address
let auth: string = (<any>global).auth

// POST /users/auth
test('post /users/auth with wrong password', ()=>{
    return request(address)
        .post('/users/auth')
        .send({
            email: 'admin@admin.com',
            password: 'geraldo'
        })
        .then(res=>{
            expect(res.status).toBe(403)
            expect(res.body.code).toBe('NotAuthorized')
            expect(res.body.message).toBe('Invalid Credentials.')
        }).catch(fail)
})

test('post /users/auth', ()=>{
    return request(address)
        .post('/users/auth')
        .send({
            email: 'admin@admin.com',
            password: 'admin'
        })
        .then(res=>{
            expect(res.status).toBe(200)
            expect(res.body.accessToken).toBeDefined()
        }).catch(fail)
})
