import Icon from '@/components/ui/icon';

const NOTIFS = [
  {
    id: 1, type: 'match', avatar: '👩‍💼', name: 'Маша Козлова',
    text: 'хочет познакомиться с тобой', time: '5 мин', match: 94, isNew: true,
  },
  {
    id: 2, type: 'message', avatar: '🧑‍💻', name: 'Артём Волков',
    text: 'написал тебе сообщение', time: '2 ч', match: 87, isNew: true,
  },
  {
    id: 3, type: 'match', avatar: '🧑‍🎨', name: 'Лена Смирнова',
    text: 'хочет познакомиться с тобой', time: '1 д', match: 81, isNew: false,
  },
  {
    id: 4, type: 'system', avatar: '💛', name: 'Tinterest',
    text: 'Обновили алгоритм подбора — теперь точнее!', time: '3 д', match: 0, isNew: false,
  },
];

export default function NotificationsScreen() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F6F6F6]">
      <div className="px-5 pt-10 pb-4">
        <h1 className="text-xl font-black text-[#141414]">Уведомления</h1>
        <p className="text-xs text-[#767676]">Новые знакомства и события</p>
      </div>

      <div className="px-4 space-y-2">
        {NOTIFS.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            {n.isNew && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFDD2D] rounded-l-2xl" />
            )}
            <div className="relative">
              <span className="text-4xl">{n.avatar}</span>
              {n.type === 'match' && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FFDD2D] rounded-full flex items-center justify-center">
                  <Icon name="Heart" size={10} />
                </span>
              )}
              {n.type === 'message' && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#141414] rounded-full flex items-center justify-center">
                  <Icon name="MessageCircle" size={10} className="text-[#FFDD2D]" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className={`text-sm ${n.isNew ? 'font-bold text-[#141414]' : 'font-medium text-[#141414]'}`}>
                  {n.name}
                </p>
                <p className="text-xs text-[#A0A0A0]">{n.time}</p>
              </div>
              <p className="text-xs text-[#767676]">{n.text}</p>
              {n.match > 0 && (
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="text-[10px] font-black text-[#141414] bg-[#FFDD2D] rounded-full px-2 py-0.5">
                    {n.match}% совпадение
                  </span>
                </div>
              )}
            </div>

            {n.type === 'match' && (
              <div className="flex flex-col gap-2">
                <button className="w-8 h-8 bg-[#FFDD2D] rounded-full flex items-center justify-center active:scale-90 transition-transform">
                  <Icon name="Check" size={14} />
                </button>
                <button className="w-8 h-8 bg-[#F6F6F6] rounded-full flex items-center justify-center active:scale-90 transition-transform">
                  <Icon name="X" size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
