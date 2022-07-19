/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
*/

import Todo from "../../../models/todoModel"
import connectDb from "../../../utils/db"
import { authMiddleware } from "./auth/authentication"

async function deleteTask(req, res) {
    const { id } = req.query
    const todo = await Todo.findById(id)
    await connectDb()

    if(!todo) {
        res.status(400)
        throw new Error('Task not found')
    }

    // check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // make sure the logged in user matches the goal user
    if(todo.user.toString() !== req.user.id) {
        res.status(401).json({error: 'User not authorized'})
    }

    switch(req.method){
        case 'DELETE':
            await todo.remove()

            res.status(200).json({id})
            break;

        case 'POST':
            const updateTodo = await Todo.findByIdAndUpdate(id, req.body, {new: true})

            res.status(200).json(updateTodo)
            break;

        default: 
            res.status(400).json({error: 'Bad Request'})
    }
}

export default authMiddleware(deleteTask)