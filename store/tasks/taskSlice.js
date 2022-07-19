import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import taskService from './taskService'

const initialState = {
    tasks: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
}

export const createTask = createAsyncThunk('tasks/create', async(title, thunkAPI) => {
    try {
        const token = localStorage.getItem('token')
        return await taskService.createTask(title, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
}) 

// Get all Tasks
export const getTasks = createAsyncThunk('tasks/get', async(_, thunkAPI) => {
    try {
        const token = localStorage.getItem('token')
        return await taskService.getTasks(token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// update Task
export const updateTask = createAsyncThunk('tasks/update', async(data, thunkAPI) => {
    try {
        const token = localStorage.getItem('token')
        return await taskService.updateTask(data, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Delete Task
export const deleteTask = createAsyncThunk('tasks/delete', async(id, thunkAPI) => {
    try {
        const token = localStorage.getItem('token')
        return await taskService.deleteTask(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
}) 

export const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(createTask.pending, (state) => {
            state.isLoading = true
        })
        .addCase(createTask.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.tasks.push(action.payload)
        })
        .addCase(createTask.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(getTasks.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getTasks.fulfilled, (state, action) => {
            state.tasks = action.payload
            state.isLoading = false
            state.isSuccess = true
            state.message = ''
        })
        .addCase(getTasks.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(updateTask.pending, (state) => {
            state.isLoading = true
        })
        .addCase(updateTask.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = ''
        })
        .addCase(updateTask.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(deleteTask.pending, (state) => {
            state.isLoading = true
        })
        .addCase(deleteTask.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = ''
            state.tasks = state.tasks.filter((task) => task._id !== action.payload._id)
        })
        .addCase(deleteTask.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const { reset } = taskSlice.actions
export default taskSlice.reducer