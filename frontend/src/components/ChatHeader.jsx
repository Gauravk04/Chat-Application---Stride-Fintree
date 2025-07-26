import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="avatar relative">
            <div className="size-12 rounded-full overflow-hidden ring-2 ring-gray-200">
              <img 
                src={selectedUser.profilePic || "/avatar.png"} 
                alt={selectedUser.fullName} 
                className="object-cover w-full h-full"
              />
              <span 
                className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white ${
                  onlineUsers.includes(selectedUser._id) ? "bg-green-400" : "bg-gray-400"
                }`}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{selectedUser.fullName}</h3>
            <p className="text-sm text-gray-500">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close chat"
        >
          <X className="size-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;