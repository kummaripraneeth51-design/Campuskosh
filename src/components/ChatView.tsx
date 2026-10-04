import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Image as ImageIcon,
  Paperclip,
  CheckCheck,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  Sparkles,
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    currentUser,
    users,
    items,
    chatMessages,
    sendChatMessage,
    activeChatUserId,
    openChatWithUser,
    activeChatItemId,
    setSelectedItem,
    setIsDetailsModalOpen,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

  // Quick campus response presets for rapid coordination
  const quickReplies = [
    'Meet outside Central Library Lobby at 4 PM?',
    'I am outside Hostel 4 Reception now!',
    'Item tested and working great, thank you!',
    'Confirming return today around 6 PM.',
    'Is the security deposit in cash or UPI?',
  ];

  // List of other users who have messages or can be chatted with
  const otherUsers = users.filter(u => u.id !== currentUser.id);
  const activeUser = users.find(u => u.id === activeChatUserId) || otherUsers[0];

  // Find linked item if any
  const linkedItem = items.find(i => i.id === activeChatItemId);

  // Active conversation messages
  const conversationId = [currentUser.id, activeUser?.id].sort().join('_');
  const currentMessages = chatMessages.filter(m => m.conversationId === conversationId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !selectedAttachment) return;

    sendChatMessage(activeUser.id, inputMessage, selectedAttachment || undefined);
    setInputMessage('');
    setSelectedAttachment(null);
  };

  const handleQuickReply = (text: string) => {
    sendChatMessage(activeUser.id, text);
  };

  const handleAttachSimulatedImage = () => {
    // Add sample snapshot photo of condition
    setSelectedAttachment('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80');
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] min-h-[500px] bg-white rounded-2xl border border-slate-200 shadow-xs flex overflow-hidden">
      {/* Left Sidebar: Conversations List */}
      <div className="w-full sm:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Campus Messages</h3>
          <p className="text-[11px] text-slate-500">Secure student-to-student chats</p>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
          {otherUsers.map((user) => {
            const isSelected = user.id === activeUser?.id;
            return (
              <button
                key={user.id}
                onClick={() => openChatWithUser(user.id)}
                className={`w-full p-3.5 flex items-center gap-3 text-left transition-colors ${
                  isSelected ? 'bg-white shadow-xs' : 'hover:bg-slate-100/70'
                }`}
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  {user.isVerified && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {user.fullName}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">Today</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {user.department} ({user.year.split('/')[0].trim()})
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Area: Active Chat */}
      <div className="hidden sm:flex flex-1 flex-col bg-white">
        {/* Chat Header */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <img
              src={activeUser.avatar}
              alt={activeUser.fullName}
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                {activeUser.fullName}
                {activeUser.isVerified && (
                  <span className="text-emerald-700 text-[11px] font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 fill-emerald-100 inline" />
                    Verified Student
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500">
                {activeUser.department} · Trust Score {activeUser.trustScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Linked Item Banner (if discussing a specific item) */}
        {linkedItem && (
          <div className="px-4 py-2 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <img
                src={linkedItem.images[0]}
                alt={linkedItem.title}
                className="w-7 h-7 rounded object-cover border border-emerald-200"
              />
              <span className="font-semibold text-slate-800 truncate">{linkedItem.title}</span>
              <span className="text-emerald-700 font-medium text-[11px]">
                ({linkedItem.sharingType} · 100% Free)
              </span>
            </div>

            <button
              onClick={() => {
                setSelectedItem(linkedItem);
                setIsDetailsModalOpen(true);
              }}
              className="text-emerald-800 font-bold hover:underline shrink-0 text-[11px]"
            >
              View Item
            </button>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {currentMessages.length > 0 ? (
            currentMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md px-3.5 py-2.5 rounded-2xl text-xs space-y-1.5 shadow-xs ${
                      isMine
                        ? 'bg-emerald-700 text-white rounded-br-xs'
                        : 'bg-slate-100 text-slate-900 rounded-bl-xs'
                    }`}
                  >
                    {msg.attachmentUrl && (
                      <div className="rounded-lg overflow-hidden border border-white/20 mb-1 max-w-[200px]">
                        <img
                          src={msg.attachmentUrl}
                          alt="Attachment"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 text-[9px] font-mono ${
                        isMine ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMine && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-6 space-y-2">
              <Sparkles className="w-8 h-8 text-emerald-600 opacity-60" />
              <p className="text-xs font-semibold text-slate-700">Start the conversation</p>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Discuss pickup timings, hostel meeting points, or test item condition before handover.
              </p>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex gap-1.5 overflow-x-auto scrollbar-none">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleQuickReply(reply)}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[11px] rounded-lg border border-slate-200 whitespace-nowrap transition-colors shrink-0 font-medium"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Attachment preview if selected */}
        {selectedAttachment && (
          <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              1 Photo attached for condition check
            </span>
            <button
              onClick={() => setSelectedAttachment(null)}
              className="text-rose-600 font-bold hover:underline"
            >
              Remove
            </button>
          </div>
        )}

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white">
          <button
            type="button"
            onClick={handleAttachSimulatedImage}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Attach item photo"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${activeUser.fullName.split(' ')[0]}...`}
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() && !selectedAttachment}
            className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
