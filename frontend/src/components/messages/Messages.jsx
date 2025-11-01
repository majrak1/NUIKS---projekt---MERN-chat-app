import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
    const { messages, loading } = useGetMessages();
    useListenMessages();
    const lastMessageRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    return (
        <div className='px-6 py-4 flex-1 overflow-auto flex flex-col gap-3'>
            {!loading && messages.length > 0 &&
                messages.map((message) => (
                    <div key={message._id} ref={lastMessageRef}>
                        <Message message={message} />
                    </div>
                ))}

            {!loading && messages.length === 0 && (
                <div className='flex-1 flex items-center justify-center'>
                    <div className='text-center text-gray-500'>
                        <p className='mb-2'>No messages yet</p>
                        <p className='text-sm'>Send a message to start the conversation</p>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Messages;
