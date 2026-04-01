import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { getChats, getMessages, sendMessage, ApiChat, ApiMessage } from '@/api';

interface Props {
  userId: string;
}

export default function ChatsScreen({ userId }: Props) {
  const [chats, setChats] = useState<ApiChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [openChat, setOpenChat] = useState<ApiChat | null>(null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChats();
  }, [userId]);

  useEffect(() => {
    if (openChat) loadMessages(openChat.match_id);
  }, [openChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChats = async () => {
    try {
      const data = await getChats(userId);
      setChats(Array.isArray(data) ? data : []);
    } catch (_e) { /* ignore */ }
    setLoading(false);
  };

  const loadMessages = async (matchId: string) => {
    try {
      const data = await getMessages(matchId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (_e) { /* ignore */ }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !openChat || sending) return;
    setSending(true);
    const text = inputText.trim();
    setInputText('');
    try {
      const msg = await sendMessage(openChat.match_id, userId, text);
      setMessages((prev) => [...prev, msg]);
    } catch (_e) { /* ignore */ }
    setSending(false);
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  if (openChat) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="px-5 pt-10 pb-4 flex items-center gap-3 border-b border-[#F0F0F0]">
          <button onClick={() => { setOpenChat(null); loadChats(); }} className="text-[#767676] hover:text-[#141414]">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-[#F6F6F6] flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
            {openChat.partner_photo
              ? <img src={openChat.partner_photo} alt={openChat.partner_name} className="w-full h-full object-cover" />
              : <span>{openChat.partner_avatar}</span>
            }
          </div>
          <div className="flex-1">
            <p className="font-bold text-[#141414] text-sm">{openChat.partner_name}</p>
            <p className="text-xs text-[#767676]">{openChat.partner_department}</p>
          </div>
        </div>

        <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center text-[#A0A0A0] text-sm mt-8">Начните общение первым 👋</div>
          )}
          {messages.map((msg) => {
            const mine = msg.sender_id === userId;
            return (
              <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className="flex flex-col gap-1" style={{ maxWidth: '78%' }}>
                  <div className={`chat-bubble ${mine ? 'mine' : 'theirs'}`}>{msg.text}</div>
                  <span className={`text-[10px] text-[#A0A0A0] ${mine ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="px-4 pb-6 pt-3 border-t border-[#F0F0F0] flex gap-3 items-center">
          <input
            type="text"
            placeholder="Сообщение…"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-[#F6F6F6] rounded-2xl px-4 py-3 text-sm outline-none border-2 border-transparent focus:border-[#FFDD2D] transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={sending}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
            style={{ background: inputText.trim() ? '#FFDD2D' : '#E8E8E8' }}
          >
            <Icon name="Send" size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F6F6]">
      <div className="px-5 pt-10 pb-4">
        <h1 className="text-xl font-black text-[#141414]">Чаты</h1>
        <p className="text-xs text-[#767676]">Твои знакомства</p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#FFDD2D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : chats.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <span className="text-5xl mb-4">💬</span>
          <p className="text-[#141414] font-semibold text-center mb-2">Пока нет чатов</p>
          <p className="text-[#767676] text-sm text-center">Найди коллег во вкладке «Люди»</p>
        </div>
      ) : (
        <div className="px-4 space-y-2">
          {chats.map((chat) => (
            <button
              key={chat.match_id}
              onClick={() => setOpenChat(chat)}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 transition-all active:scale-[0.98]"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <div className="w-12 h-12 rounded-full bg-[#F6F6F6] flex items-center justify-center text-2xl overflow-hidden flex-shrink-0">
                {chat.partner_photo
                  ? <img src={chat.partner_photo} alt={chat.partner_name} className="w-full h-full object-cover" />
                  : <span>{chat.partner_avatar}</span>
                }
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-bold text-[#141414] text-sm">{chat.partner_name}</p>
                  <p className="text-xs text-[#A0A0A0]">{formatTime(chat.last_message_time)}</p>
                </div>
                <p className="text-xs text-[#767676] truncate">
                  {chat.last_message || 'Начните общение'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
