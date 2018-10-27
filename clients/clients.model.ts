import * as fs from 'fs'
import * as _ from 'lodash'
import { environment } from '../common/environment';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

const data = fs.readFileSync(environment.db.clients)
const clients: Client[] = JSON.parse(data.toString())

export class Phone {
    constructor(
        public ddd: string,
        public number: string
    ){}
}
export class Client {
    constructor(
        public name: string,
        public type: string,
        public email: string,
        public date_create: Date,
        public status: boolean = true,
        public telefones: Phone[],
        public group?: string,
        public cpf?: string,
        public cnpj?: string,
        public rg?: string,
        public ie?: string,
        public id?: string) {}

    static findAll(): Promise<Client[]>{
        return Promise.resolve(clients)
    }

    static findById(id: string): Promise<Client>{
        return new Promise(resolve=>{
            const filtered = clients.filter(client=> client.id === id)
            let client: Client = undefined
            if(filtered.length > 0){
                client = filtered[0]
            }
            resolve(client)
        })
    }

    static save(client: Client): Promise<Client>{
        return new Promise(resolve=>{
            //get new id
            if(clients.length > 0){
                client.id = (+_.last(clients).id + 1).toString()
            } else {
                client.id = '1'
            }
            //validate required
            let validClient: Client = undefined
            if(client.name && client.name !== ''){
                if(client.email && client.email !== ''){
                    if(client.type  === 'PF'){
                        if(client.cpf && client.cpf.length === 11 && !this.findByCPF(client.cpf) && this.validateCPF(client.cpf)){
                            validClient = client
                            clients.push(validClient)
                            this.saveData()
                        }
                    }else if(client.type === 'PJ'){
                        if(client.cnpj && client.cnpj.length === 14 && !this.findByCNPJ(client.cnpj) && this.validateCNPJ(client.cnpj)){
                            validClient = client
                            clients.push(validClient)
                            this.saveData()
                        }
                    }
                }
            }
            resolve(validClient)
        })
    }

    static update(client: Client): Promise<Client>{
        return new Promise(resolve=>{
            //get id
            let index = _.findIndex(clients, {id: client.id})
            //validate required
            let validClient: Client = undefined
            if (index >= 0) {
                if(client.name && client.name !== ''){
                    if(client.email && client.email !== ''){
                        if(client.type  === 'PF'){
                            if(client.cpf && client.cpf.length === 11 && !this.findByCPF(client.cpf, client.id) && this.validateCPF(client.cpf)){
                                validClient = client
                                clients.splice(index, 1, validClient)
                                this.saveData()
                            }
                        }else if(client.type === 'PJ'){
                            if(client.cnpj && client.cnpj.length === 14 && !this.findByCNPJ(client.cnpj, client.id) && this.validateCNPJ(client.cnpj)){
                                validClient = client
                                clients.splice(index, 1, validClient)
                                this.saveData()
                            }
                        }
                    }
                }
            }
            resolve(validClient)
        })
    }

    static delete(id: string): Promise<{id: string} | void>{
        return new Promise(resolve=>{
            let removedClients: Client[] = _.remove(clients, client => client.id === id)
            if(removedClients.length > 0){
                this.saveData()
                resolve({id})
            }else{
                resolve()
            }
        })
    }

    static deleteAll(): Promise<{id: string} | void>{
        return new Promise(resolve=>{
            const id = '0'
            if(clients.length > 0){
                clients.splice(0)
                this.saveData()
                resolve({id})
            }else{
                resolve()
            }
        })
    }

    private static saveData(): void {
        const data = JSON.stringify(clients, null, 2)
        fs.writeFile(environment.db.clients, data, (err)=> console.error(err))
    }

    private static findByCPF(cpf: string, id: string = '0'): boolean {
        const filtered = clients.filter(client=> client.cpf === cpf && client.id !== id)
        let findCPF = false
        if(filtered.length > 0){
            findCPF = true
        }
        return findCPF
    }

    private static findByCNPJ(cnpj: string, id: string = '0'): boolean {
        const filtered = clients.filter(client=> client.cnpj === cnpj && client.id !== id)
        let findCNPJ = false
        if(filtered.length > 0){
            findCNPJ = true
        }
        return findCNPJ
    }

    private static validateCPF(cpf: string): boolean {
        // Elimina CPFs invalidos conhecidos
        if (
            cpf.length !== 11 ||
            cpf === '00000000000' ||
            cpf === '11111111111' ||
            cpf === '22222222222' ||
            cpf === '33333333333' ||
            cpf === '44444444444' ||
            cpf === '55555555555' ||
            cpf === '66666666666' ||
            cpf === '77777777777' ||
            cpf === '88888888888' ||
            cpf === '99999999999'
        ) {
            return false;
        }

        // Valida 1o digito
        let add = 0
        for (let i = 0; i < 9; i++) { add += parseInt(cpf.charAt(i)) * (10 - i) }
        let rev = 11 - (add % 11)
        if (rev === 10 || rev === 11) { rev = 0; }
        if (rev !== parseInt(cpf.charAt(9))) {
            return false
        }

        // Valida 2o digito
        add = 0
        for (let i = 0; i < 10; i++) { add += parseInt(cpf.charAt(i)) * (11 - i) }
        rev = 11 - (add % 11)
        if (rev === 10 || rev === 11) { rev = 0 }
        if (rev !== parseInt(cpf.charAt(10))) {
            return false
        }
        return true    
    }

    private static validateCNPJ(cnpj: string): boolean {
        // Elimina CNPJs invalidos conhecidos
        if (
            cnpj === '00000000000000' ||
            cnpj === '11111111111111' ||
            cnpj === '22222222222222' ||
            cnpj === '33333333333333' ||
            cnpj === '44444444444444' ||
            cnpj === '55555555555555' ||
            cnpj === '66666666666666' ||
            cnpj === '77777777777777' ||
            cnpj === '88888888888888' ||
            cnpj === '99999999999999'
        ) {
            return false
        }

        // Valida 1o digito
        const numeros = [6,5,4,3,2,9,8,7,6,5,4,3,2]
        let add = 0
        for (let i = 0; i < 12; i++) { add += parseInt(cnpj.charAt(i)) * numeros[i+1] }
        let rev = 11 - (add % 11)
        if (rev === 10 || rev === 11) { rev = 0 }
        if (rev !== parseInt(cnpj.charAt(12))) { 
            return false
        }

        // Valida 2o digito
        add = 0
        for (let i = 0; i < 13; i++) { add += parseInt(cnpj.charAt(i)) * numeros[i] }
        rev = 11 - (add % 11)
        if (rev === 10 || rev === 11) { rev = 0 }
        if (rev !== parseInt(cnpj.charAt(13))) {
            return false
        }
        return true
    }
}
