import { useState, useEffect } from "react";
import { ChevronLeft, MessageCircle, Loader2 } from "lucide-react";
import { ChatScreen } from "../ChatScreen";
import { api } from "../../api";

type Conversation = {
  phone: string;
  lastMessage: {
    content: string;
    image_url?: string;
    created_at: string;
  };
  unreadCount: number;
};

type ChatListScreenProps = {
  myPhone: string;
  onBack: () => void;
};

export function ChatListScreen({ myPhone, onBack }: ChatListScreenProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await api.chat.getList(myPhone);
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);

    return () => clearInterval(interval);
  }, [myPhone]);

  if (selectedChat) {
    return (
      <ChatScreen
        myPhone={myPhone}
        otherPhone={selectedChat}
        otherName={selectedChat} // In a real app, we'd look up the customer name
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white p-6 pb-8">
        <button onClick={onBack} className="mb-4">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <button
                key={conv.phone}
                onClick={() => setSelectedChat(conv.phone)}
                className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {conv.phone}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(conv.lastMessage.created_at).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.lastMessage.image_url
                      ? "📷 Image"
                      : conv.lastMessage.content}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="ml-4 bg-green-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {conv.unreadCount}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
