/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
*/

import Todo from '../../../models/todoModel'
import connectDb from '../../../utils/db'
import { authMiddleware } from './auth/authentication'

async function getTasks(req, res) {
    if(req.method !== 'GET') {
        res.status(400).json({error: 'Bad Request'})
    }
    await connectDb()
    const todos = await Todo.find({user: req.user.id})

    res.status(200).json(todos)
}

export default authMiddleware(getTasks)