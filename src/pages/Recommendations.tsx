import { useState, useEffect } from 'react';
import { UserProfile, Screen } from '../App';
import Icon from '@/components/ui/icon';
import { getRecommendations, acceptMatch, ApiRecommendation } from '@/api';

interface Props {
  profile: UserProfile;
  onNavigate: (s: Screen) => void;
}

type CardState = 'idle' | 'accept' | 'decline';

export default function RecommendationsScreen({ profile, onNavigate }: Props) {
  const [people, setPeople] = useState<ApiRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardState, setCardState] = useState<CardState>('idle');
  const [showChatModal, setShowChatModal] = useState(false);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    getRecommendations(profile.id)
      .then((data) => {
        setPeople(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [profile.id]);

  const person = people[cardIndex];
  const isFinished = !loading && cardIndex >= people.length;

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

  const handleChatYes = async () => {
    if (!person) return;
    try {
      await acceptMatch(profile.id, person.id);
    } catch (_e) { /* ignore */ }
    setAcceptedCount((c) => c + 1);
    setShowChatModal(false);
    nextCard();
  };

  const handleChatNo = () => {
    setShowChatModal(false);
    nextCard();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F6F6] flex flex-col items-center justify-center px-6">
        <div className="w-12 h-12 border-4 border-[#FFDD2D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#767676] text-sm">Подбираем коллег…</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#F6F6F6] flex flex-col items-center justify-center px-6">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-black text-[#141414] text-center mb-3">Просмотрено!</h2>
        <p className="text-[#767676] text-center text-sm mb-2">
          Принято: <span className="font-bold text-[#141414]">{acceptedCount}</span> знакомств
        </p>
        <p className="text-[#767676] text-center text-sm mb-8">Новые коллеги появятся позже</p>
        <button className="t-btn" onClick={() => { setCardIndex(0); setAcceptedCount(0); }}>Посмотреть снова</button>
      </div>
    );
  }

  if (!person) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F6F6]">
      <div className="px-5 pt-10 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#141414]">Для тебя</h1>
          <p className="text-xs text-[#767676]">На основе анкеты</p>
        </div>
        <div className="flex items-center gap-2 bg-[#141414] text-[#FFDD2D] rounded-full px-3 py-1.5">
          <Icon name="Sparkles" size={13} />
          <span className="text-xs font-semibold">{people.length - cardIndex} осталось</span>
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
            className="h-52 flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #141414 0%, #2a2a2a 100%)' }}
          >
            {person.photo ? (
              <img src={person.photo} alt={person.name} className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <span className="text-8xl">{person.avatar}</span>
            )}
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
              {person.vibe && (
                <span className="text-xs text-[#767676] bg-[#F6F6F6] rounded-full px-3 py-1">
                  💬 {person.vibe}
                </span>
              )}
              {person.goal && (
                <span className="text-xs text-[#767676] bg-[#F6F6F6] rounded-full px-3 py-1">
                  🎯 {person.goal}
                </span>
              )}
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
              <h3 className="text-xl font-black text-[#141414] mb-1">Написать {person.name}?</h3>
              <p className="text-[#767676] text-sm">Совпадение {person.match}% · {person.department}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleChatNo}
                className="flex-1 py-3.5 rounded-2xl border-2 border-[#E8E8E8] font-semibold text-[#767676]"
              >
                Не сейчас
              </button>
              <button
                onClick={handleChatYes}
                className="flex-1 py-3.5 rounded-2xl font-semibold text-[#141414]"
                style={{ background: '#FFDD2D' }}
              >
                Написать 💬
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}