/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
*/

import Todo from '../../../models/todoModel'
import connectDb from '../../../utils/db'
import { authMiddleware } from './auth/authentication'

async function addTodo(req, res) {
    if(req.method !== 'POST') {
        res.status(400).json({error: 'Bad Request'})
    }
    try {
        await connectDb()
        const { title, description, deadline } = req.body
        if(!title) {
            res.status(400).json({error: 'Please add a title'})
        }

        const todo = await Todo.create({
            title,
            description: description ? description : '',
            deadline: deadline ? deadline : '',
            user: req.user._id
        })
    
        res.status(200).json(todo)
    } catch(error) {
        console.log(error)
        res.json({error})
    }
}

export default authMiddleware(addTodo)