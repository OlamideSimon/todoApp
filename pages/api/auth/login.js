/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
*/

import User from '../../../models/userModel';
import bcrypt from 'bcryptjs'
import { generateToken } from '../../../utils/generateToken';
import connectDb from '../../../utils/db';

export default async function loginuser(req, res){
    try {
        await connectDb()
        const {email, password} = req.body;
    
        // check for user email
        const user = await User.findOne({email})
    
        if(user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            })
        } else {
            res.status(400).json({error: 'Invalid Credentials'})
        }
    } catch (error) {
        console.log(error)
        res.json({error})
    }
}