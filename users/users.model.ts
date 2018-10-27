import * as fs from 'fs'
import * as _ from 'lodash'
import { environment } from '../common/environment';

const data = fs.readFileSync(environment.db.users)
const users: User[] = JSON.parse(data.toString())

export class User {

    constructor(
        public name: string,
        public email: string,
        public password: string,
        public id?: string) {}

    static findByEmail(email: string): Promise<User>{
        return new Promise(resolve=>{
            const filtered = users.filter(user=> user.email === email)
            let user: User = undefined
            if(filtered.length > 0){
                user = filtered[0]
            }
            resolve(user)
        })
    }
}

