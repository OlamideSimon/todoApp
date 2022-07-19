/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
*/

import User from '../../../models/userModel';
import connectDb from '../../../utils/db'
import bcrypt from 'bcryptjs'
import { generateToken } from '../../../utils/generateToken';

export default async function addUser(req, res) {
    try {
        await connectDb()

        const { name, email, password } = req.body
        if(!name || !email || !password) {
            res.status(400).json({error: 'Please add all fields'})
        }

        // Check if user exists
        const userExists = await User.findOne({email})

        if(userExists) {
            res.status(400).json({error: 'User already exists'})
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        if(user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            })
        } else {
            res.status(400).json({error: 'Invalid User data'})
        }
    } catch(error) {
        console.log(error);
        res.json({ error: error });
    }
};