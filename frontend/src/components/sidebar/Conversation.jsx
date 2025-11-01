import { useSocketContext } from '../../context/SocketContext'
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx, emoji }) => {
    const { selectedConversation, setSelectedConversation } = useConversation();

    const isSelected = selectedConversation?._id === conversation._id;
    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers.includes(conversation._id);

    return (
        <>
            <div
                className={`flex gap-2 items-center hover:bg-accent/10 rounded p-2 py-1 cursor-pointer transition-colors duration-150
                		${isSelected ? "bg-accent/10" : ""}
            	`}
                onClick={() => setSelectedConversation(conversation)}
            >
                <div className={`avatar ${isOnline ? "ring-2 ring-accent/50" : ""}`}>
                    <div className='w-12 rounded-full'>
                        <img src={conversation.profilePic} alt='user avatar' />
                    </div>
                </div>

                <div className='flex flex-col flex-1'>
                    <div className='flex gap-3 justify-between items-center'>
                        <p className={`font-medium text-gray-200 ${isSelected ? 'text-accent' : ''}`}>{conversation.fullName}</p>
                        <span className='text-lg opacity-60'>{emoji}</span>
                    </div>
                </div>
            </div>

            {!lastIdx && <div className='h-[1px] bg-black/20 my-1' />}
        </>
    )
}

export default Conversation