/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
*/

import User from "../../../../models/userModel";
import jwt from 'jsonwebtoken'

export function authMiddleware(handler) {
    return async(req, res) => {
        let token;
    
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try{
                // get token from header
                token = req.headers.authorization.split(' ')[1]
    
                // verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
                // Get user from token
                req.user = await User.findById(decoded.id).select('-password')
    
                return handler(req, res)
            } catch (error) {
                res.status(401).json({error: 'Not Authorized'})
            }
        }
    
        if(!token) {
            res.status(401).json({error: 'Not authorized!! No token'})
        }
    }
}