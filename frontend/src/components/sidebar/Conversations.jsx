import React from 'react'
import Conversation from './Conversation'
import useGetConversations from '../../hooks/useGetConversations';

const Conversations = () => {

    const { loading, conversations } = useGetConversations();
    // console.log("loadinggggg", loading)
    // console.log(conversations)

    return (
        <aside className="w-80 border-r border-black/20 bg-base-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-100">Chats</h2>
                {/* <button className="text-accent text-sm font-medium">New</button> */}
            </div>

            {/* <div className="form-control mb-4">
                <input type="text" placeholder="Search" className="input input-sm input-bordered" />
            </div> */}

            <div className='py-2 flex flex-col overflow-auto chat-scroll'>
                {conversations.map((conversation, idx) => (
                    <Conversation
                        key={conversation._id}
                        conversation={conversation}
                        // emoji={getRandomEmoji()}
                        lastIdx={idx === conversations.length - 1}
                    />
                    // <div><h1>asfasifbaib</h1></div>
                ))}
                {loading ? <span className='loading loading-spinner mx-auto'></span> : null}
            </div>
        </aside>
    )
}

export default Conversations