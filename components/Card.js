import { Checkbox, FormControlLabel, FormGroup, IconButton, TextField } from '@mui/material'
import { createPopper } from '@popperjs/core';
import { useRouter } from 'next/router';
import React, { createRef, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteTask, updateTask } from '../store/tasks/taskSlice';

const Card = ({id, title, completed}) => {
    const [ openModal, setOpenModal ] = useState(false)
    const [task, setTask] = useState(title)
    const [complete, setComplete] = useState(completed)
    const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
    const btnDropdownRef = createRef();
    const popoverDropdownRef = createRef()
    const openDropdownPopover = () => {
        createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: "bottom-end"
        });
        setDropdownPopoverShow(true);
    };
    const dispatch = useDispatch()
    const router = useRouter()

    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };

    const showOptions = () => {
        dropdownPopoverShow ? closeDropdownPopover(): openDropdownPopover()
    }

    const handleModal = () => {
        closeDropdownPopover()
        setOpenModal(openModal => !openModal)
    }

    const onDelete = () => {
        closeDropdownPopover()
        dispatch(deleteTask(id))
        router.replace(router.asPath)
    }

    const onUpdate = () => {
        const data = {getData: {title: task, completed: complete}, id}
        closeDropdownPopover()
        handleModal()
        dispatch(updateTask(data))
        router.replace(router.asPath)
    }

    return (
        <>
            <ToastContainer />
            <div className='text-white flex flex-row justify-between items-start p-2'>
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={completed} style={{color: '#fdfdff'}} />} label={title} />
                </FormGroup>
                <IconButton ref={btnDropdownRef} onClick={showOptions}>
                    <BsThreeDots className='text-white' size='18px' />
                </IconButton>
            </div>

            <div 
            ref={popoverDropdownRef} 
            className={
                (dropdownPopoverShow ? "block " : "hidden ") +
                "text-base bg-[#546a7b]  text-[#fdfdff] py-2 z-50 float-left list-none text-left rounded shadow-lg"
            }
            >
                <div className='space-y-1'>
                    <div>
                        <p className='hover:bg-[#93a9b9] p-1 px-3' onClick={handleModal}>Edit</p>
                    </div>
                    <div>
                        <p className='hover:bg-[#93a9b9] p-1 px-3' onClick={onDelete}>Delete</p>
                    </div>
                </div>
            </div>

            {openModal && (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-sm">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#546a7b] outline-none focus:outline-none">
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <div className='space-y-3'>
                                        <p className='text-white text-sm'>What is to be Done?</p>
                                        <TextField value={task} onChange={(e) => setTask(e.target.value)} variant='standard' sx={{color: 'white'}} />
                                        <FormGroup className='text-white'>
                                            <FormControlLabel control={<Checkbox checked={complete} onChange={(e) => setComplete(e.target.checked)} style={{color: '#fdfdff'}} />} label='Task Finished?' />
                                        </FormGroup>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={handleModal}
                                >
                                    Close
                                </button>
                                <button
                                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={onUpdate}
                                >
                                    Save
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            )}
        </>
    )
}

export default Card