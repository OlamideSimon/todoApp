import axios from "axios"

const API_URL = '/api/todo/'

// Create tasks
const createTask = async(title, token) => {
    let headersList = {
        "Accept": "*/*",
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }

    const response = await axios.post(API_URL + 'add', title, {headers: headersList})

    return response.data
}

// Get tasks
const getTasks = async(token) => {
    let headersList = {
        "Accept": "*/*",
        "Authorization": `Bearer ${token}`,
    }

    const response = await axios.get(API_URL, {headers: headersList})

    return response.data
}

// update task
const updateTask = async(taskData, token) => {
    let headersList = {
        "Accept": "*/*",
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }

    console.log(taskData)
    const { getData, id } = taskData

    const response = await axios.post(API_URL + id, getData, {headers: headersList})
    console.log(response.data)
    return response.data
}

// Delete task
const deleteTask = async(id, token) => {
    let headersList = {
        "Accept": "*/*",
        "Authorization": `Bearer ${token}`
    }

    const response = await axios.delete(API_URL + id, {headers: headersList})
    return response.data
}

const taskService = {
    createTask,
    getTasks,
    deleteTask,
    updateTask
}

export default taskService;