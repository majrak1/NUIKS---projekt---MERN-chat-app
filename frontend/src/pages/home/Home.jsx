import React from 'react'
import ChatLayout from '../../components/ChatLayout'

const Home = () => {
    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-6 overscroll-none">
            <div className="w-full">
                <ChatLayout />
            </div>
        </div>
    )
}

export default Home