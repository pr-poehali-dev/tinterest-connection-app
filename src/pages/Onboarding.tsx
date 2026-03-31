import { useState } from 'react';
import { UserProfile } from '../App';
import Icon from '@/components/ui/icon';

const INTERESTS = [
  { emoji: '🎸', label: 'Музыка' },
  { emoji: '🏃', label: 'Бег' },
  { emoji: '📚', label: 'Книги' },
  { emoji: '🎮', label: 'Игры' },
  { emoji: '🍕', label: 'Еда' },
  { emoji: '✈️', label: 'Путешествия' },
  { emoji: '🎨', label: 'Дизайн' },
  { emoji: '💻', label: 'Технологии' },
  { emoji: '🎬', label: 'Кино' },
  { emoji: '🧘', label: 'Йога' },
  { emoji: '🚴', label: 'Велоспорт' },
  { emoji: '🐶', label: 'Животные' },
  { emoji: '📸', label: 'Фото' },
  { emoji: '🏋️', label: 'Спорт' },
  { emoji: '🎭', label: 'Театр' },
  { emoji: '🌿', label: 'Природа' },
  { emoji: '🍷', label: 'Вино' },
  { emoji: '♟️', label: 'Шахматы' },
];

const DEPARTMENTS = ['Продукт', 'Разработка', 'Дизайн', 'Маркетинг', 'Аналитика', 'HR', 'Финансы', 'Риски', 'Поддержка', 'Другое'];
const CITIES = ['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск', 'Екатеринбург', 'Ростов-на-Дону', 'Удалённо'];

const AVATARS = ['🧑‍💻', '👩‍💼', '🧑‍🎨', '👨‍🔬', '👩‍🚀', '🧑‍🏫'];

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [city, setCity] = useState('');
  const [avatar, setAvatar] = useState('🧑‍💻');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);

  const totalSteps = 4;

  const goNext = () => {
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setAnimating(false);
    }, 200);
  };

  const toggleInterest = (label: string) => {
    setSelectedInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const handleComplete = () => {
    onComplete({
      name: name || 'Алексей',
      department,
      city,
      avatar,
      interests: selectedInterests,
    });
  };

  const canNext = [
    name.trim().length >= 2,
    department !== '' && city !== '',
    avatar !== '',
    selectedInterests.length >= 3,
  ][step];

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
      {step > 0 && (
        <div className="px-6 pt-8 pb-2">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => setStep((s) => s - 1)} className="text-[#767676] hover:text-[#141414] transition-colors">
              <Icon name="ArrowLeft" size={20} />
            </button>
            <div className="flex-1 progress-bar">
              <div className="progress-fill" style={{ width: `${((step) / totalSteps) * 100}%` }} />
            </div>
            <span className="text-sm text-[#767676] font-medium">{step}/{totalSteps}</span>
          </div>
        </div>
      )}

      <div className={`flex-1 px-6 py-8 flex flex-col ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'} transition-all duration-200`}>

        {step === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
            <div className="w-20 h-20 bg-[#FFDD2D] rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-lg">
              💛
            </div>
            <h1 className="text-3xl font-black text-[#141414] text-center mb-3 leading-tight">
              Добро пожаловать<br/>в Tinterest
            </h1>
            <p className="text-[#767676] text-center text-base leading-relaxed mb-12">
              Находи коллег из Т‑банка,<br/>с которыми вам есть о чём поговорить
            </p>
            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 bg-[#F6F6F6] rounded-2xl p-4">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-600 text-[#141414] text-sm font-semibold">Интересы</p>
                  <p className="text-[#767676] text-xs">Расскажи, чем ты увлекаешься</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#F6F6F6] rounded-2xl p-4">
                <span className="text-2xl">🤝</span>
                <div>
                  <p className="font-600 text-[#141414] text-sm font-semibold">Совпадения</p>
                  <p className="text-[#767676] text-xs">Находим похожих коллег</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#F6F6F6] rounded-2xl p-4">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-600 text-[#141414] text-sm font-semibold">Чат</p>
                  <p className="text-[#767676] text-xs">Начни общение внутри компании</p>
                </div>
              </div>
            </div>
            <div className="mt-auto pt-8 w-full">
              <button className="t-btn" onClick={goNext}>
                Начать знакомство
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <h2 className="text-2xl font-black text-[#141414] mb-2">Как тебя зовут?</h2>
            <p className="text-[#767676] mb-8">Коллеги увидят твоё имя в профиле</p>
            <input
              type="text"
              placeholder="Например, Алексей"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-[#E8E8E8] focus:border-[#FFDD2D] rounded-2xl px-4 py-4 text-lg font-medium outline-none transition-colors bg-white"
              autoFocus
            />
            <div className="mt-auto pt-8">
              <button className="t-btn" onClick={goNext} disabled={!canNext} style={{ opacity: canNext ? 1 : 0.4 }}>
                Продолжить
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <h2 className="text-2xl font-black text-[#141414] mb-2">Расскажи о себе</h2>
            <p className="text-[#767676] mb-6">Это поможет найти коллег рядом</p>

            <div className="mb-6">
              <p className="text-sm font-semibold text-[#141414] mb-3">Отдел</p>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map((d) => (
                  <button
                    key={d}
                    className={`chip ${department === d ? 'active' : ''}`}
                    onClick={() => setDepartment(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#141414] mb-3">Город</p>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((c) => (
                  <button
                    key={c}
                    className={`chip ${city === c ? 'active' : ''}`}
                    onClick={() => setCity(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-8">
              <button className="t-btn" onClick={goNext} disabled={!canNext} style={{ opacity: canNext ? 1 : 0.4 }}>
                Продолжить
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <h2 className="text-2xl font-black text-[#141414] mb-2">Выбери аватар</h2>
            <p className="text-[#767676] mb-8">Как тебя будут видеть коллеги</p>

            <div className="grid grid-cols-3 gap-4">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`aspect-square rounded-3xl text-5xl flex items-center justify-center transition-all duration-200 ${
                    avatar === a
                      ? 'bg-[#FFDD2D] scale-105 shadow-lg'
                      : 'bg-[#F6F6F6] hover:bg-[#E8E8E8]'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <button className="t-btn" onClick={goNext}>
                Продолжить
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <h2 className="text-2xl font-black text-[#141414] mb-2">Твои интересы</h2>
            <p className="text-[#767676] mb-6">Выбери минимум 3 — по ним найдём совпадения</p>

            <div className="flex flex-wrap gap-2 flex-1">
              {INTERESTS.map(({ emoji, label }) => (
                <button
                  key={label}
                  className={`chip ${selectedInterests.includes(label) ? 'active' : ''}`}
                  onClick={() => toggleInterest(label)}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="pt-6">
              {selectedInterests.length > 0 && (
                <p className="text-sm text-[#767676] text-center mb-3">
                  Выбрано: <span className="font-semibold text-[#141414]">{selectedInterests.length}</span>
                </p>
              )}
              <button
                className="t-btn"
                onClick={handleComplete}
                disabled={!canNext}
                style={{ opacity: canNext ? 1 : 0.4 }}
              >
                Найти коллег 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
