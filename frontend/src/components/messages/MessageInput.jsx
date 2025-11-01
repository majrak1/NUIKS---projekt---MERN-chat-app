import { useState } from "react";
// lightweight inline SVG icons to avoid new deps
const SendIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 21L23 12L2 3L2 10L17 12L2 14L2 21Z" fill="currentColor" />
    </svg>
);

const AttachIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.44 11.05L12.53 20.96C10.83 22.66 8.02 22.66 6.32 20.96C4.62 19.26 4.62 16.45 6.32 14.75L16.19 4.88C17.17 3.9 18.66 3.9 19.64 4.88C20.62 5.86 20.62 7.35 19.64 8.33L10.77 17.2C10.17 17.8 9.16 17.8 8.56 17.2C7.96 16.6 7.96 15.59 8.56 14.99L17.47 6.08" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const { loading, sendMessage } = useSendMessage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) return;
        await sendMessage(message);
        setMessage("");
    };

    return (
        <form onSubmit={handleSubmit} className='px-4 py-3'>
            <div className='flex items-center gap-3'>
                <button type='button' className='p-2 rounded-md text-gray-400 hover:text-accent hover:bg-black/5'>
                    <AttachIcon />
                </button>

                <input
                    type='text'
                    className='flex-1 bg-transparent border border-black/12 rounded-full px-4 py-2 text-sm placeholder-gray-500 text-gray-100 focus:outline-none'
                    placeholder='Write a message...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { handleSubmit(e); } }}
                />

                <button
                    type='submit'
                    className='bg-accent text-black rounded-full p-2 hover:brightness-95 flex items-center justify-center'
                    aria-label='Send message'
                >
                    {loading ? <div className='loading loading-spinner' /> : <SendIcon className='w-4 h-4' />}
                </button>
            </div>
        </form>
    );
};

export default MessageInput;
