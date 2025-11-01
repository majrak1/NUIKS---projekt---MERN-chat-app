import React from 'react'

import Sidebar from './sidebar/Sidebar'
import MessageContainer from './messages/MessageContainer'

const ChatLayout = () => {
    return (
        <div className="h-[90vh] max-w-6xl mx-auto bg-base-200 rounded-lg shadow-md overflow-hidden ring-1 ring-black/30">
            <div className="flex h-full">
                <Sidebar />
                <MessageContainer />
            </div>
        </div>
    )
}

export default ChatLayout
