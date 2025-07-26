import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-3">
      <div className="flex items-center justify-center pt-8 px-4 h-full">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[calc(100vh-4rem)] border border-gray-200 overflow-hidden mt-4">
          <div className="flex h-full">
            {/* Sidebar with subtle border */}
            <div className="border-r border-gray-200">
              <Sidebar />
            </div>
            
            {/* Main content area */}
            <main className="flex-1 flex flex-col">
              {!selectedUser ? (
                <NoChatSelected />
              ) : (
                <ChatContainer />
              )}
              
              {/* Subtle footer */}
              <footer className="py-2 px-4 text-center text-xs text-gray-500 border-t border-gray-100">
                Chat App © {new Date().getFullYear()}
              </footer>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;