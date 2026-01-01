import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Send, Image as ImageIcon, Loader2 } from "lucide-react";
import { api } from "../api";

type Message = {
  id: string;
  sender_phone: string;
  receiver_phone: string;
  content: string;
  image_url?: string;
  created_at: string;
  is_read: boolean;
};

type ChatScreenProps = {
  myPhone: string;
  otherPhone: string;
  otherName: string;
  onBack: () => void;
};

export function ChatScreen({
  myPhone,
  otherPhone,
  otherName,
  onBack,
}: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await api.chat.getConversation(myPhone, otherPhone);
        setMessages(data);
        setIsLoading(false);
        scrollToBottom();

        // Mark as read
        await api.chat.markAsRead(otherPhone, myPhone);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3s

    return () => clearInterval(interval);
  }, [myPhone, otherPhone]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      await api.chat.send(myPhone, otherPhone, newMessage);
      setNewMessage("");
      // Optimistic update
      const tempMsg: Message = {
        id: Date.now().toString(),
        sender_phone: myPhone,
        receiver_phone: otherPhone,
        content: newMessage,
        created_at: new Date().toISOString(),
        is_read: false,
      };
      setMessages([...messages, tempMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;

      setIsSending(true);
      try {
        await api.chat.send(myPhone, otherPhone, undefined, base64String);
        // Optimistic update
        const tempMsg: Message = {
          id: Date.now().toString(),
          sender_phone: myPhone,
          receiver_phone: otherPhone,
          content: "",
          image_url: base64String,
          created_at: new Date().toISOString(),
          is_read: false,
        };
        setMessages([...messages, tempMsg]);
      } catch (error) {
        console.error("Error sending image:", error);
        alert("Failed to send image");
      } finally {
        setIsSending(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-screen bg-[#efeae2]">
      {/* Header */}
      <div className="bg-[#008069] p-4 shadow-sm flex items-center gap-3 z-10 text-white">
        <button onClick={onBack} className="p-2 hover:bg-[#006c59] rounded-full">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div>
          <h2 className="font-semibold text-white">{otherName}</h2>
          <p className="text-xs text-green-100">{otherPhone}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_phone === myPhone;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl p-3 shadow-sm ${
                    isMe
                      ? "bg-[#d9fdd3] text-gray-900 rounded-tr-none"
                      : "bg-white text-gray-900 rounded-tl-none"
                  }`}
                >
                  {msg.image_url && (
                    <img
                      src={msg.image_url}
                      alt="Shared image"
                      className="rounded-lg mb-2 max-w-full"
                    />
                  )}
                  {msg.content && <p className="text-sm">{msg.content}</p>}
                  <p className="text-[10px] mt-1 text-right text-gray-500">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#f0f2f5] p-3 border-t border-gray-200 flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
          disabled={isSending}
        >
          <ImageIcon className="w-6 h-6" />
        </button>

        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message"
          className="flex-1 bg-white border-0 rounded-lg px-4 py-2 focus:ring-0 outline-none"
          disabled={isSending}
        />

        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || isSending}
          className="p-3 bg-[#00a884] text-white rounded-full hover:bg-[#008f6f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
