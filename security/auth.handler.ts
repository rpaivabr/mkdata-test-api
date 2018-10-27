import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import { NotAuthorizedError, ForbiddenError } from 'restify-errors'
import { User } from '../users/users.model';
import { environment } from '../common/environment'

export const authenticate: restify.RequestHandler = (req, res, next)=>{
    const {email, password} = req.body
    User.findByEmail(email)
        .then(user=>{
            if(user && user.password === password){
                //gerar o token
                const token = jwt.sign(
                    {sub: user.email, iss: 'mkdata-api'},
                    environment.security.apiSecret,
                    // {expiresIn: '30m'}
                )
                res.json({name: user.name, email: user.email, accessToken: token})
                return next(false)
            }else{
                return next(new NotAuthorizedError('Invalid Credentials.'))
            }
        }).catch(next)
}

export const authorize: ()=> restify.RequestHandler = ()=>{
    return (req, res, next)=>{
        if(req.authenticated !== undefined){
            next()
        } else {
            next(new ForbiddenError('Permission denied.'))
        }
    }
}
