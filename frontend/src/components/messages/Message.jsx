import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const fromMe = message.senderId == authUser._id;
    const formattedTime = extractTime(message.createdAt);
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const bubbleClass = fromMe
        ? "bg-accent text-black rounded-2xl px-4 py-2 shadow-md"
        : "bg-base-300 text-base-content rounded-2xl px-4 py-2 border border-black/10";

    const shakeClass = message.shouldShake ? "shake" : "";

    return (
        <div className={`chat ${chatClassName} items-end`}>
            <div className='chat-image avatar'>
                <div className='w-9 h-9 rounded-full overflow-hidden'>
                    <img alt='avatar' src={profilePic} />
                </div>
            </div>

            <div className='flex flex-col items-start'>
                <div className={`${bubbleClass} ${shakeClass} max-w-[70ch] break-words`}>{message.message}</div>
                <div className='mt-1 text-xs text-gray-400'>{formattedTime}</div>
            </div>
        </div>
    );
};
export default Message;