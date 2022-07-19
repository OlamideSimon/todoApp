import { Avatar, IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import React, { createRef, useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch'
import { VscListSelection } from 'react-icons/vsc'
import { toast } from 'react-toastify'
import Card from '../components/Card'
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { createTask, getTasks } from '../store/tasks/taskSlice'
import { createPopper } from '@popperjs/core'

export default function Home() {
  const router = useRouter()
  const [task, setTask] = useState('')
  const { tasks, isLoading, isError, message } = useSelector(state => state.tasks)
  const dispatch = useDispatch()
  const day = new Date().toLocaleString('default', {weekday: 'long'})
  const date = new Date().toLocaleString('default', {month: 'short', day: '2-digit', year: 'numeric'});
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const btnDropdownRef = createRef();
  const popoverDropdownRef = createRef()
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
        placement: "bottom-end"
    });
    setDropdownPopoverShow(true);
};

const closeDropdownPopover = () => {
  setDropdownPopoverShow(false);
};

  useEffect(() => {
    if(!localStorage.getItem('token') || message === 'Not Authorized' || message === 'Request failed with status code 401') {
      router.push('/login')
    }

    dispatch(getTasks())
  }, [router, dispatch, message])

  const showOption = () => {
    dropdownPopoverShow ? closeDropdownPopover(): openDropdownPopover()
  }

  const onSubmit = (e) => {
    e.preventDefault()

    dispatch(createTask({title: task}))
    setTask('')
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.replace(router.asPath)
  }

  const newArr = [...tasks]
  newArr.sort((a, b) => a.completed - b.completed)

  return (
    <div className='flex justify-center items-center h-[100vh]'>
      <div className='bg-[#3c424a] h-[600px] w-[500px] font-mono'>
        <div className='flex justify-end border-b-[#a05171] border-b-2'>
          <IconButton ref={btnDropdownRef} onClick={showOption}>
            <Avatar sx={{width: 35, height: 35, backgroundColor: '#f06292'}}>{localStorage.getItem('name').slice(0, 1)}</Avatar>
          </IconButton>
          <div 
            ref={popoverDropdownRef} 
            className={
                (dropdownPopoverShow ? "block " : "hidden ") +
                "text-base bg-[#546a7b]  text-[#fdfdff] py-2 z-50 float-left list-none text-left rounded shadow-lg"
            }
          >
            <div className='space-y-1 p-2'>
              <p onClick={logout}>Logout</p>
            </div>
          </div>
        </div>
        <div className='flex items-center h-[30%] justify-center'>
          <div className='text-center'>
            <p className='text-slate-100 text-4xl'>{day}</p>
            <p className='text-[#6d737c]'>{date}</p>
          </div>
        </div>
        <div className='px-5 pb-2 sm:px-16'>
          <form onSubmit={onSubmit}>
            <div className='bg-[#343a40] flex items-center text-[#9ba3af] p-2 space-x-2'>
                <VscListSelection size='25px' />
                <input type='text' placeholder='Add a task...' value={task} onChange={(e) => setTask(e.target.value)} className='bg-transparent flex-1 p-1 text-base focus:outline-none' />
            </div>
            <button type='submit' className='hidden'></button>
          </form>

          {!isLoading && !isError && (
            <div className='h-80 overflow-y-auto'>
              {newArr.map(({_id, title, completed}) => (
                <Card key={_id} id={_id} title={title} completed={completed} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}