import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
// import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversation();

    useEffect(() => {
        // cleanup function (unmounts)
        return () => setSelectedConversation(null);
    }, [setSelectedConversation]);

    return (
        <div className='md:min-w-[520px] flex flex-col bg-transparent'>
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (
                <>
                    {/* Header: sticky, compact */}
                    <div className='flex items-center gap-3 px-4 py-3 border-b border-black/10 bg-transparent sticky top-0 z-10'>
                        <div className='w-10 h-10 rounded-full overflow-hidden'>
                            <img src={selectedConversation.profilePic} alt='avatar' />
                        </div>
                        <div className='flex-1'>
                            <div className='text-sm font-semibold text-gray-100'>{selectedConversation.fullName}</div>
                        </div>
                    </div>

                    <div className='flex-1 overflow-auto chat-scroll bg-transparent'>
                        <Messages />
                    </div>

                    <div className='border-t border-black/10 bg-transparent sticky bottom-0'>
                        <MessageInput />
                    </div>
                </>
            )}
        </div>
    );
};
export default MessageContainer;

const NoChatSelected = () => {
    const { authUser } = useAuthContext();
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
                <p>Welcome {authUser.fullName}!</p>
                <p>Select a chat to start messaging</p>
                {/* <TiMessages className='text-3xl md:text-6xl text-center' /> */}
            </div>
        </div>
    );
};
