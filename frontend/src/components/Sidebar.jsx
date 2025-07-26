import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-64 bg-white shadow-sm flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="w-full p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 text-gray-800">
          <Users className="size-5 text-blue-500" />
          <span className="font-semibold hidden lg:block text-lg">Contacts</span>
        </div>
        
        {/* Online filter toggle */}
        <div className="mt-4 hidden lg:flex items-center justify-between">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="toggle toggle-xs bg-gray-200 checked:bg-blue-500"
            />
            <span className="text-sm text-gray-600">Online only</span>
          </label>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
            {onlineUsers.length - 1} online
          </span>
        </div>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto w-full py-2">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full px-3 py-3 flex items-center gap-3
              hover:bg-blue-50 transition-colors
              ${selectedUser?._id === user._id ? "bg-blue-50 border-l-4 border-blue-500" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-10 object-cover rounded-full border-2 border-white shadow-sm"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-2.5 bg-green-400 
                  rounded-full ring-2 ring-white"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium text-gray-800 truncate">{user.fullName}</div>
              <div className={`text-xs mt-0.5 ${
                onlineUsers.includes(user._id) ? "text-green-500" : "text-gray-400"
              }`}>
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-400 py-6 px-3">
            <Users className="size-5 mx-auto mb-2 text-gray-300" />
            No {showOnlineOnly ? "online" : ""} users found
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;