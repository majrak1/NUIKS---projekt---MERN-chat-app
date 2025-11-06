import React from 'react'
import Conversations from './Conversations'
import useLogout from '../../hooks/useLogout'
import { Navigate, Route, Routes } from "react-router-dom";

const Sidebar = () => {
    const { loading, logout } = useLogout()

    return (
        <aside className='flex flex-col h-full w-80 bg-transparent px-4 py-4'>
            {/* Brand / top */}
            <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 rounded-full bg-gradient-to-br from-black/20 to-black/10 flex items-center justify-center ring-1 ring-black/20'>
                    <span className='text-accent font-bold'>N</span>
                </div>
                <div>
                    <div className='text-xl font-semibold text-gray-100'>NotWhatsApp</div>
                </div>
            </div>

            {/* Search */}
            <div className='mb-3'>
                <input
                    placeholder='Search'
                    className='w-full rounded-md bg-transparent border border-black/15 px-3 py-2 text-sm placeholder-gray-500'
                />
            </div>

            {/* Conversations list */}
            <div className='flex-1 overflow-auto'>
                <Conversations />
            </div>

            {/* Footer actions */}
            <div className='mt-4 flex items-center justify-between'>

                <div>
                    {!loading ? (
                        <button
                            onClick={logout}
                            className='text-sm text-gray-300 hover:text-white cursor-pointer'
                        >Logout</button>
                    ) : (
                        <span className='loading loading-spinner'></span>
                    )}
                </div>

                {/* button to navigate to files collection */}
                <div>
                    <a
                        href="/files"
                        className="text-sm text-gray-300 hover:text-white cursor-pointer"
                    >
                        Files
                    </a>
                </div>

            </div>
        </aside>
    )
}

export default Sidebar
