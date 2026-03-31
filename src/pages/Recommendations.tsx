import { useState } from 'react';
import { UserProfile, Screen } from '../App';
import Icon from '@/components/ui/icon';

interface Props {
  profile: UserProfile;
  onNavigate: (s: Screen) => void;
}

const MOCK_PEOPLE = [
  {
    id: 1, name: 'Маша Козлова', avatar: '👩‍💼', department: 'Продукт', city: 'Москва',
    interests: ['Путешествия', 'Йога', 'Книги', 'Кино'],
    vibe: 'Глубокие темы', goal: 'Нетворкинг', match: 94,
    about: 'Продакт в команде карт. Обожаю горы и хорошие книги.',
  },
  {
    id: 2, name: 'Артём Волков', avatar: '🧑‍💻', department: 'Разработка', city: 'Казань',
    interests: ['Технологии', 'Игры', 'Музыка', 'Бег'],
    vibe: 'Всё понемногу', goal: 'Друзей по хобби', match: 87,
    about: 'Senior iOS. Пишу код, гоняю на велике, слушаю jazz.',
  },
  {
    id: 3, name: 'Лена Смирнова', avatar: '🧑‍🎨', department: 'Дизайн', city: 'Москва',
    interests: ['Дизайн', 'Фото', 'Кино', 'Театр'],
    vibe: 'Шучу и веселюсь', goal: 'Тусовку после работы', match: 81,
    about: 'UX/UI дизайнер. Люблю кино, фотоплёнку и котов.',
  },
  {
    id: 4, name: 'Дима Орлов', avatar: '👨‍🔬', department: 'Аналитика', city: 'Санкт-Петербург',
    interests: ['Шахматы', 'Книги', 'Вино', 'Природа'],
    vibe: 'Глубокие темы', goal: 'Профессиональный рост', match: 76,
    about: 'Data scientist. Шахматы, хорошее вино и байдарки.',
  },
];

type CardState = 'idle' | 'accept' | 'decline';

export default function RecommendationsScreen({ profile }: Props) {
  const [cardIndex, setCardIndex] = useState(0);
  const [cardState, setCardState] = useState<CardState>('idle');
  const [showChatModal, setShowChatModal] = useState(false);
  const [acceptedPeople, setAcceptedPeople] = useState<number[]>([]);
  const [expanded, setExpanded] = useState(false);

  const person = MOCK_PEOPLE[cardIndex];
  const isFinished = cardIndex >= MOCK_PEOPLE.length;

  const sharedInterests = person
    ? person.interests.filter((i) => profile.interests.includes(i))
    : [];

  const animateAndNext = (state: CardState, accepted: boolean) => {
    setCardState(state);
    setTimeout(() => {
      if (accepted) setShowChatModal(true);
      else nextCard();
    }, 400);
  };

  const nextCard = () => {
    setCardState('idle');
    setExpanded(false);
    setCardIndex((i) => i + 1);
  };

  const handleAccept = () => animateAndNext('accept', true);
  const handleDecline = () => animateAndNext('decline', false);

  const handleChatYes = () => {
    setAcceptedPeople((p) => [...p, person.id]);
    setShowChatModal(false);
    nextCard();
  };

  const handleChatNo = () => {
    setShowChatModal(false);
    nextCard();
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#F6F6F6] flex flex-col items-center justify-center px-6">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-black text-[#141414] text-center mb-3">Просмотрено!</h2>
        <p className="text-[#767676] text-center text-sm mb-2">
          Принято: <span className="font-bold text-[#141414]">{acceptedPeople.length}</span> знакомств
        </p>
        <p className="text-[#767676] text-center text-sm mb-8">Новые коллеги появятся позже</p>
        <button className="t-btn" onClick={() => setCardIndex(0)}>Посмотреть снова</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F6F6]">
      <div className="px-5 pt-10 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#141414]">Для тебя</h1>
          <p className="text-xs text-[#767676]">На основе анкеты</p>
        </div>
        <div className="flex items-center gap-2 bg-[#141414] text-[#FFDD2D] rounded-full px-3 py-1.5">
          <Icon name="Sparkles" size={13} />
          <span className="text-xs font-semibold">{MOCK_PEOPLE.length - cardIndex} осталось</span>
        </div>
      </div>

      <div className="flex-1 px-5 flex flex-col">
        <div
          className="match-card flex-1 flex flex-col"
          style={{
            opacity: cardState !== 'idle' ? 0 : 1,
            transform: cardState === 'accept'
              ? 'translateX(80px) rotate(8deg)'
              : cardState === 'decline'
              ? 'translateX(-80px) rotate(-8deg)'
              : 'none',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
            minHeight: 440,
          }}
        >
          <div
            className="h-52 flex items-center justify-center relative"
            style={{ background: 'linear-gradient(135deg, #141414 0%, #2a2a2a 100%)' }}
          >
            <span className="text-8xl">{person.avatar}</span>
            <div
              className="absolute top-3 right-3 rounded-full px-3 py-1.5 flex items-center gap-1"
              style={{ background: '#FFDD2D' }}
            >
              <Icon name="Heart" size={12} />
              <span className="text-xs font-black text-[#141414]">{person.match}%</span>
            </div>
            {sharedInterests.length > 0 && (
              <div className="absolute bottom-3 left-3 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5">
                <p className="text-white text-xs font-medium">
                  {sharedInterests.length} общих интереса
                </p>
              </div>
            )}
          </div>

          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-black text-[#141414]">{person.name}</h3>
                <p className="text-sm text-[#767676]">{person.department} · {person.city}</p>
              </div>
              <button
                onClick={() => setExpanded((e) => !e)}
                className="w-8 h-8 rounded-full bg-[#F6F6F6] flex items-center justify-center transition-transform"
                style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
              >
                <Icon name="ChevronDown" size={16} />
              </button>
            </div>

            {expanded && (
              <p className="text-sm text-[#767676] mb-4 leading-relaxed animate-fade-in">{person.about}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {person.interests.map((interest) => (
                <span
                  key={interest}
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: profile.interests.includes(interest) ? '#FFDD2D' : '#F6F6F6',
                    color: '#141414',
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-auto">
              <span className="text-xs text-[#767676] bg-[#F6F6F6] rounded-full px-3 py-1">
                💬 {person.vibe}
              </span>
              <span className="text-xs text-[#767676] bg-[#F6F6F6] rounded-full px-3 py-1">
                🎯 {person.goal}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 py-5">
          <button
            onClick={handleDecline}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-[#E8E8E8] bg-white font-semibold text-[#767676] transition-all active:scale-95 hover:border-[#ccc]"
          >
            <Icon name="X" size={18} />
            Пропустить
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-[#141414] transition-all active:scale-95"
            style={{ background: '#FFDD2D', boxShadow: '0 4px 16px rgba(255,221,45,0.4)' }}
          >
            <Icon name="MessageCircle" size={18} />
            Написать
          </button>
        </div>
      </div>

      {showChatModal && person && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center backdrop-blur-sm">
          <div
            className="bg-white w-full max-w-md rounded-t-3xl p-6 animate-slide-up"
            style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
          >
            <div className="w-10 h-1 bg-[#E8E8E8] rounded-full mx-auto mb-6" />
            <div className="text-center mb-6">
              <span className="text-6xl block mb-4">{person.avatar}</span>
              <h3 className="text-xl font-black text-[#141414] mb-1">Начать чат с {person.name}?</h3>
              <p className="text-[#767676] text-sm">
                Совпадение <span className="font-bold text-[#141414]">{person.match}%</span>
                {sharedInterests.length > 0 && ` · ${sharedInterests.length} общих интереса`}
              </p>
            </div>
            {sharedInterests.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {sharedInterests.map((i) => (
                  <span key={i} className="text-sm px-3 py-1 bg-[#FFDD2D] rounded-full font-medium text-[#141414]">{i}</span>
                ))}
              </div>
            )}
            <div className="space-y-3">
              <button className="t-btn" onClick={handleChatYes}>
                Да, начать чат! 💬
              </button>
              <button className="t-btn-outline" onClick={handleChatNo}>
                Не сейчас
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
