/* eslint-disable react-hooks/rules-of-hooks */
import { Alert, CircularProgress } from '@mui/material'
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from 'react-icons/ai'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const login = () => {
    const router = useRouter()
    const [openTab, setOpenTab] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        password: ''
    })

    const { name, email, password } = formData

    useEffect(() => {
        if(localStorage.getItem('token')) {
            router.push('/')
        }
    }, [router])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async(e) => {
        e.preventDefault()
        setIsLoading(true)
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }

        if(openTab === 1) {
            const data = { email, password }
            fetch("http://localhost:3000/api/auth/login", { 
                method: "POST",
                body: JSON.stringify(data),
                headers: headersList
            }).then(function(response) {
                return response.text();
            }).then(function(data) {
                const response = JSON.parse(data)
                setIsLoading(false)
                if(response.error) {
                    toast.error(response.error)
                    setFormData({password: '', email: ''})
                } else {
                    localStorage.setItem('token', JSON.parse(data).token);
                    localStorage.setItem('name', JSON.parse(data).name);
                    router.push('/')
                }
            })
        } else {
            const data = { name, email, password }
            fetch("http://localhost:3000/api/auth/register", { 
                method: "POST",
                body: JSON.stringify(data),
                headers: headersList
            }).then(function(response) {
                return response.text();
            }).then(function(data) {
                const response = JSON.parse(data)
                setIsLoading(false)
                if(response.error) {
                    toast.error(response.error)
                    setFormData({password: '', email: ''})
                } else {
                    localStorage.setItem('token', JSON.parse(data).token);
                    localStorage.setItem('name', JSON.parse(data).name);
                    router.push('/')
                }
            })
        }
    }
    
    return (
        <>
            <ToastContainer />
            <div className='h-[100vh] flex justify-center items-center'>
                <div className='bg-[#3c424a] p-2'>
                    <div className='flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row' role='tablist'>
                        <p onClick={() => setOpenTab(1)} className={openTab === 1 ? 'header-item border-b-[#a05171] border-b-2': 'header-item'}>
                            Login
                        </p>
                        <p onClick={() => setOpenTab(2)} className={openTab === 2 ? 'header-item border-b-[#a05171] border-b-2': 'header-item'}>
                            Register
                        </p>
                    </div>
                    <Alert severity="warning">Please Login or signup to access Tasks</Alert>
                    {openTab === 2 ? (
                        <form className='p-5 grid gap-3' onSubmit={onSubmit}>
                            <div className='bg-[#343a40] flex items-center text-[#9ba3af] p-2 space-x-2'>
                                <AiOutlineUser size='25px' />
                                <input required type='text' placeholder='Enter Name' name='name' value={name} onChange={onChange} className='bg-transparent flex-1 focus:outline-none' />
                            </div>
                            <div className='bg-[#343a40] flex items-center text-[#9ba3af] p-2 space-x-2'>
                                <AiOutlineMail size='25px' />
                                <input required type='email' placeholder='Enter Mail' name='email' value={email} onChange={onChange} className='bg-transparent flex-1 focus:outline-none' />
                            </div>
                            <div className='bg-[#343a40] flex items-center text-[#9ba3af] p-2 space-x-2'>
                                <AiOutlineLock size='25px' />
                                <input required type='password' placeholder='Enter Password' name='password' value={password} onChange={onChange} className='bg-transparent flex-1 focus:outline-none' />
                            </div>
                            <div className='flex justify-center'>
                                <button className='button' type='submit'>
                                {isLoading ? <CircularProgress size='19px' /> : 'Signin'}
                                </button>
                            </div>
                        </form>
                    ): (
                        <form className='p-5 grid gap-3' onSubmit={onSubmit}>
                            <div className='bg-[#343a40] flex items-center text-[#9ba3af] p-2 space-x-2'>
                                <AiOutlineMail size='25px' />
                                <input required type='email' placeholder='Enter Mail' name='email' value={email} onChange={onChange} className='bg-transparent flex-1 focus:outline-none' />
                            </div>
                            <div className='bg-[#343a40] flex items-center text-[#9ba3af] p-2 space-x-2'>
                                <AiOutlineLock size='25px' />
                                <input required type='password' placeholder='Enter Password' name='password' value={password} onChange={onChange} className='bg-transparent flex-1 focus:outline-none' />
                            </div>
                            <div className='flex justify-center'>
                                <button className='button' type='submit'>
                                    {isLoading ? <CircularProgress size='19px' /> : 'Signup'}
                                </button>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </>
    )
}

export default login