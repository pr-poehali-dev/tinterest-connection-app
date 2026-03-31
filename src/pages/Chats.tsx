import { useState } from 'react';
import Icon from '@/components/ui/icon';

const MOCK_CHATS = [
  {
    id: 1, name: 'Маша Козлова', avatar: '👩‍💼', lastMessage: 'Привет! Тоже обожаю горы 🏔',
    time: '14:32', unread: 2, match: 94,
  },
  {
    id: 2, name: 'Артём Волков', avatar: '🧑‍💻', lastMessage: 'Слышал про новый релиз Swift?',
    time: '11:05', unread: 0, match: 87,
  },
];

const MOCK_MESSAGES: Record<number, { text: string; mine: boolean; time: string }[]> = {
  1: [
    { text: 'Привет! Увидел, что ты тоже любишь путешествия 🌍', mine: false, time: '14:28' },
    { text: 'Да, обожаю! Особенно горы. Ты куда последний раз ездил?', mine: true, time: '14:29' },
    { text: 'Алтай этим летом. Невероятно красиво! А ты?', mine: false, time: '14:31' },
    { text: 'Привет! Тоже обожаю горы 🏔', mine: false, time: '14:32' },
  ],
  2: [
    { text: 'Привет! Увидел что ты iOS-разработчик', mine: true, time: '11:00' },
    { text: 'Да, уже 5 лет. А ты?', mine: false, time: '11:02' },
    { text: 'Слышал про новый релиз Swift?', mine: false, time: '11:05' },
  ],
};

export default function ChatsScreen() {
  const [openChatId, setOpenChatId] = useState<number | null>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const openChat = MOCK_CHATS.find((c) => c.id === openChatId);

  const sendMessage = () => {
    if (!inputText.trim() || !openChatId) return;
    setMessages((prev) => ({
      ...prev,
      [openChatId]: [
        ...(prev[openChatId] || []),
        { text: inputText.trim(), mine: true, time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) },
      ],
    }));
    setInputText('');
  };

  if (openChat) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="px-5 pt-10 pb-4 flex items-center gap-3 border-b border-[#F0F0F0]">
          <button onClick={() => setOpenChatId(null)} className="text-[#767676] hover:text-[#141414]">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <span className="text-3xl">{openChat.avatar}</span>
          <div className="flex-1">
            <p className="font-bold text-[#141414] text-sm">{openChat.name}</p>
            <p className="text-xs text-[#767676]">Совпадение {openChat.match}%</p>
          </div>
        </div>

        <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
          {(messages[openChat.id] || []).map((msg, i) => (
            <div key={i} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}>
              <div className="flex flex-col gap-1" style={{ maxWidth: '78%' }}>
                <div className={`chat-bubble ${msg.mine ? 'mine' : 'theirs'}`}>{msg.text}</div>
                <span className={`text-[10px] text-[#A0A0A0] ${msg.mine ? 'text-right' : 'text-left'}`}>{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 pb-6 pt-3 border-t border-[#F0F0F0] flex gap-3 items-center">
          <input
            type="text"
            placeholder="Сообщение…"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-[#F6F6F6] rounded-2xl px-4 py-3 text-sm outline-none border-2 border-transparent focus:border-[#FFDD2D] transition-colors"
          />
          <button
            onClick={sendMessage}
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

      {MOCK_CHATS.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <span className="text-5xl mb-4">💬</span>
          <p className="text-[#141414] font-semibold text-center mb-2">Пока нет чатов</p>
          <p className="text-[#767676] text-sm text-center">Найди коллег во вкладке «Люди»</p>
        </div>
      ) : (
        <div className="px-4 space-y-2">
          {MOCK_CHATS.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setOpenChatId(chat.id)}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 transition-all active:scale-[0.98]"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <div className="relative">
                <span className="text-4xl">{chat.avatar}</span>
                {chat.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFDD2D] text-[#141414] text-[10px] font-black rounded-full flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-bold text-[#141414] text-sm">{chat.name}</p>
                  <p className="text-xs text-[#A0A0A0]">{chat.time}</p>
                </div>
                <p className="text-xs text-[#767676] truncate">{chat.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
