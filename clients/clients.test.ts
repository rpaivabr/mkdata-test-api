import 'jest'
import * as request from 'supertest'

let address: string = (<any>global).address
let auth: string = (<any>global).auth

//Reset test db
test('delete /clients', ()=>{
    return request(address)
        .del('/clients')
        .set('Authorization', auth)
        .then(res=>{
            expect(res.status).toBe(204)
        }).catch(fail)
})

// GET /clients
test('get /clients with token', ()=>{
    return request('http://localhost:3001')
        .get('/clients')
        .set('Authorization', auth)
        .then(res=>{
            expect(res.status).toBe(200)
            expect(res.body).toBeInstanceOf(Array)
            expect(res.body).toHaveLength(0)
        }).catch(fail)
})

test('get /clients w/o token', ()=>{
    return request(address)
        .get('/clients')
        .then(res=>{
            expect(res.status).toBe(403)
            expect(res.body.code).toBe('Forbidden')
            expect(res.body.message).toBe('Permission denied.')
        }).catch(fail)
})

// POST TESTS
test('post /clients with token', ()=>{
    return request(address)
        .post('/clients')
        .set('Authorization', auth)
        .send({
            name: 'Rafael Paiva',
            type: 'PF',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cpf: '31391846893',
            rg: '402114346',
            cnpj: '30867789000143',
            ie: '111111111'
        })
        .then(res=>{
            expect(res.status).toBe(201)
            expect(res.body.id).toBeDefined()
            expect(res.body.name).toBe('Rafael Paiva')
            expect(res.body.telefones).toHaveLength(2)
        }).catch(fail)
})

test('post /clients w/o token', ()=>{
    return request(address)
        .post('/clients')
        .send({
            name: 'Rafael Paiva',
            type: 'PF',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cpf: '31391846893',
            rg: '402114346',
            cnpj: '30867789000143',
            ie: '111111111'
        })
        .then(res=>{
            expect(res.status).toBe(403)
            expect(res.body.code).toBe('Forbidden')
            expect(res.body.message).toBe('Permission denied.')
        }).catch(fail)
})

test('post /clients w/o name', ()=>{
    return request(address)
        .post('/clients')
        .set('Authorization', auth)
        .send({
            type: 'PF',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cpf: '31391846893',
            rg: '402114346',
            cnpj: '30867789000143',
            ie: '111111111'
        })
        .then(res=>{
            expect(res.status).toBe(400)
            expect(res.body.code).toBe('BadRequest')
            expect(res.body.message).toBe('Missing required client data.')
        }).catch(fail)
})

test('post /clients pf', ()=>{
    return request(address)
        .post('/clients')
        .set('Authorization', auth)
        .send({
            name: 'Rafael Paiva',
            type: 'PF',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cpf: '12379504814',
            rg: '402114346',
        })
        .then(res=>{
            expect(res.status).toBe(201)
        }).catch(fail)
})

test('post /clients pf w/o cpf', ()=>{
    return request(address)
        .post('/clients')
        .set('Authorization', auth)
        .send({
            name: 'Rafael Paiva',
            type: 'PF',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            rg: '402114346',
        })
        .then(res=>{
            expect(res.status).toBe(400)
            expect(res.body.code).toBe('BadRequest')
            expect(res.body.message).toBe('Missing required client data.')
        }).catch(fail)
})

test('post /clients pf with incomplete cpf', ()=>{
    return request(address)
        .post('/clients')
        .set('Authorization', auth)
        .send({
            name: 'Rafael Paiva',
            type: 'PF',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cpf: '313918',
            rg: '402114346',
        })
        .then(res=>{
            expect(res.status).toBe(400)
            expect(res.body.code).toBe('BadRequest')
            expect(res.body.message).toBe('Missing required client data.')
        }).catch(fail)
})

test('post /clients pj', ()=>{
    return request(address)
        .post('/clients')
        .set('Authorization', auth)
        .send({
            name: 'Rafael Paiva',
            type: 'PJ',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cnpj: '26727769000108',
            ie: '111111111'
        })
        .then(res=>{
            expect(res.status).toBe(201)
            expect(res.body.type).toBe('PJ')
        }).catch(fail)
})

test('post /clients pj w/o cnpj', ()=>{
    return request(address)
        .post('/clients')
        .set('Authorization', auth)
        .send({
            name: 'Rafael Paiva',
            type: 'PF',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            ie: '111111111'
        })
        .then(res=>{
            expect(res.status).toBe(400)
            expect(res.body.code).toBe('BadRequest')
            expect(res.body.message).toBe('Missing required client data.')
        }).catch(fail)
})

test('post /clients pf with incomplete cnpj', ()=>{
    return request(address)
        .post('/clients')
        .set('Authorization', auth)
        .send({
            name: 'Rafael Paiva',
            type: 'PF',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cnpj: '308000143',
            ie: '111111111'
        })
        .then(res=>{
            expect(res.status).toBe(400)
            expect(res.body.code).toBe('BadRequest')
            expect(res.body.message).toBe('Missing required client data.')
        }).catch(fail)
})

// GET /clients/:id
test('get /clients/1', ()=>{
    return request(address)
        .get('/clients/1')
        .set('Authorization', auth)
        .then(res=>{
            expect(res.status).toBe(200)
            expect(res.body.id).toBe('1')
        }).catch(fail)
})

test('get /clients/1 w/o token', ()=>{
    return request(address)
        .get('/clients/1')
        .then(res=>{
            expect(res.status).toBe(403)
            expect(res.body.code).toBe('Forbidden')
            expect(res.body.message).toBe('Permission denied.')
        }).catch(fail)
})

test('get /clients/aaaaa', ()=>{
    return request(address)
        .get('/clients/aaaa')
        .set('Authorization', auth)
        .then(res=>{
            expect(res.status).toBe(404)
            expect(res.body.code).toBe('NotFound')
            expect(res.body.message).toBe('Client not found.')
        }).catch(fail)
})

test('get /clients/0', ()=>{
    return request(address)
        .get('/clients/0')
        .set('Authorization', auth)
        .then(res=>{
            expect(res.status).toBe(404)
            expect(res.body.code).toBe('NotFound')
            expect(res.body.message).toBe('Client not found.')
        }).catch(fail)
})

// GET /clients
test('get /clients', ()=>{
    return request(address)
        .get('/clients')
        .set('Authorization', auth)
        .then(res=>{
            expect(res.status).toBe(200)
            expect(res.body).toBeInstanceOf(Array)
            expect(res.body.length).toBeGreaterThan(0)
        }).catch(fail)
})

// DELETE /clients/:id
test('delete /clients/1 w/o token', ()=>{
    return request(address)
        .del('/clients/1')
        .then(res=>{
            expect(res.status).toBe(403)
            expect(res.body.code).toBe('Forbidden')
            expect(res.body.message).toBe('Permission denied.')
        }).catch(fail)
})

// DELETE /clients/:id
test('delete /clients/1', ()=>{
    return request(address)
        .del('/clients/1')
        .set('Authorization', auth)
        .then(res=>{
            expect(res.status).toBe(204)
        }).catch(fail)
})

test('delete /clients/10', ()=>{
    return request(address)
        .del('/clients/10')
        .set('Authorization', auth)
        .then(res=>{
            expect(res.status).toBe(404)
            expect(res.body.code).toBe('NotFound')
            expect(res.body.message).toBe('Client not found.')
        }).catch(fail)
})

test('delete /clients', ()=>{
    return request(address)
        .del('/clients')
        .set('Authorization', auth)
        .then(res=>{
            expect(res.status).toBe(204)
        }).catch(fail)
})

test('delete /clients', ()=>{
    return request(address)
        .del('/clients')
        .set('Authorization', auth)
        .then(res=>{
            expect(res.status).toBe(404)
            expect(res.body.code).toBe('NotFound')
            expect(res.body.message).toBe('Client not found.')
        }).catch(fail)
})

// GET /clients
test('get /clients', ()=>{
    return request(address)
        .get('/clients')
        .set('Authorization', auth)
        .then(res=>{
            expect(res.status).toBe(200)
            expect(res.body).toBeInstanceOf(Array)
            expect(res.body).toHaveLength(0)
        }).catch(fail)
})

// PUT /clients (all tests)
test('post /clients pf', ()=>{
    return request(address)
        .post('/clients')
        .set('Authorization', auth)
        .send({
            name: 'Rafael Paiva',
            type: 'PF',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cpf: '31391846893',
            rg: '402114346',
        })
        .then(res=>{
            expect(res.status).toBe(201)
            expect(res.body.id).toBe('1')
        }).catch(fail)
})

test('put /clients not found', ()=>{
    return request(address)
        .put('/clients/2')
        .set('Authorization', auth)
        .send({
            name: 'Rafael Paiva',
            type: 'PF',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cpf: '31391846893',
            rg: '402114346',
        })
        .then(res=>{
            expect(res.status).toBe(400)
            expect(res.body.code).toBe('BadRequest')
            expect(res.body.message).toBe('Missing required client data or client not found.')
        }).catch(fail)
})

test('put /clients pf alter name', ()=>{
    return request(address)
        .put('/clients/1')
        .set('Authorization', auth)
        .send({
            name: 'Geraldo Oliveira',
            type: 'PF',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cpf: '31391846893',
            rg: '402114346',
        })
        .then(res=>{
            expect(res.status).toBe(200)
            expect(res.body.name).toBe('Geraldo Oliveira')
            expect(res.body.cpf).toBe('31391846893')
            expect(res.body.id).toBe('1')
        }).catch(fail)
})

test('put /clients pf w/o name', ()=>{
    return request(address)
        .put('/clients/1')
        .set('Authorization', auth)
        .send({
            type: 'PF',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cpf: '31391846893',
            rg: '402114346',
        })
        .then(res=>{
            expect(res.status).toBe(400)
            expect(res.body.code).toBe('BadRequest')
            expect(res.body.message).toBe('Missing required client data or client not found.')
        }).catch(fail)
})

test('post /clients pf id=2', ()=>{
    return request(address)
        .post('/clients')
        .set('Authorization', auth)
        .send({
            name: 'Rafael Paiva',
            type: 'PF',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cpf: '12379504814',
            rg: '402114346',
        })
        .then(res=>{
            expect(res.status).toBe(201)
            expect(res.body.id).toBe('2')
        }).catch(fail)
})

test('put /clients pf to pj', ()=>{
    return request(address)
        .put('/clients/2')
        .set('Authorization', auth)
        .send({
            name: 'Rafael Paiva',
            type: 'PJ',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cpf: '31391846893',
            rg: '402114346',
        })
        .then(res=>{
            expect(res.status).toBe(400)
            expect(res.body.code).toBe('BadRequest')
            expect(res.body.message).toBe('Missing required client data or client not found.')
        }).catch(fail)
})

test('put /clients pf to pj and cpf to cnpj with 11 (length)', ()=>{
    return request(address)
        .put('/clients/2')
        .set('Authorization', auth)
        .send({
            name: 'Rafael Paiva',
            type: 'PJ',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cnpj: '31391846893',
            rg: '402114346',
        })
        .then(res=>{
            expect(res.status).toBe(400)
            expect(res.body.code).toBe('BadRequest')
            expect(res.body.message).toBe('Missing required client data or client not found.')
        }).catch(fail)
})

test('put /clients pf to pj w/o token', ()=>{
    return request(address)
        .put('/clients/2')
        .send({
            name: 'Rafael Paiva',
            type: 'PJ',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cnpj: '30768789111021',
            rg: '402114346',
        })
        .then(res=>{
            expect(res.status).toBe(403)
            expect(res.body.code).toBe('Forbidden')
            expect(res.body.message).toBe('Permission denied.')
        }).catch(fail)
})

test('put /clients pf to pj and cpf to cnpj with 14 (length)', ()=>{
    return request(address)
        .put('/clients/2')
        .set('Authorization', auth)
        .send({
            name: 'Rafael Paiva',
            type: 'PJ',
            email: 'r.paivabr@gmail.com',
            date_create: new Date(),
            group: 'R',
            status: true,
            telefones: [{ ddd: '19', number: '997646554' }, { ddd: '19',number: '36016233'}],
            cnpj: '09431106000114',
            rg: '402114346',
        })
        .then(res=>{
            expect(res.status).toBe(200)
            expect(res.body.cnpj).toBe('09431106000114')
        }).catch(fail)
})

test('delete /clients', ()=>{
    return request(address)
        .del('/clients')
        .set('Authorization', auth)
        .then(res=>{
            expect(res.status).toBe(204)
        }).catch(fail)
})