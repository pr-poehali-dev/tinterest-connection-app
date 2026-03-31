import { useState, useRef } from 'react';
import { UserProfile } from '../App';
import Icon from '@/components/ui/icon';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const INTERESTS_LIST = [
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
  { emoji: '♟️', label: 'Шахматы' },
  { emoji: '🍷', label: 'Вино' },
];

const DEPARTMENTS = ['Продукт', 'Разработка', 'Дизайн', 'Маркетинг', 'Аналитика', 'HR', 'Финансы', 'Поддержка', 'Другое'];
const CITIES = ['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск', 'Екатеринбург', 'Удалённо'];

const QUESTIONS = [
  {
    id: 'format',
    question: 'Как ты предпочитаешь знакомиться?',
    options: [
      { emoji: '☕', label: 'Кофе вживую' },
      { emoji: '💬', label: 'Сначала в чате' },
      { emoji: '🍽️', label: 'Совместный обед' },
      { emoji: '🎉', label: 'На корпоративах' },
    ],
  },
  {
    id: 'vibe',
    question: 'Какой ты в общении?',
    options: [
      { emoji: '🤓', label: 'Люблю говорить о работе' },
      { emoji: '😄', label: 'Шучу и веселюсь' },
      { emoji: '🧐', label: 'Глубокие темы' },
      { emoji: '🌀', label: 'Всё понемногу' },
    ],
  },
  {
    id: 'goal',
    question: 'Что ищешь в Tinterest?',
    options: [
      { emoji: '🤝', label: 'Нетворкинг' },
      { emoji: '👯', label: 'Друзей по хобби' },
      { emoji: '🧠', label: 'Профессиональный рост' },
      { emoji: '🍻', label: 'Тусовку после работы' },
    ],
  },
];

type Step = 'welcome' | 'name' | 'photo' | 'about' | 'department' | 'interests' | 'q0' | 'q1' | 'q2' | 'searching';
const STEPS: Step[] = ['welcome', 'name', 'photo', 'about', 'department', 'interests', 'q0', 'q1', 'q2', 'searching'];
const TOTAL_STEPS = 8;

export default function OnboardingScreen({ onComplete }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [about, setAbout] = useState('');
  const [department, setDepartment] = useState('');
  const [city, setCity] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [searchProgress, setSearchProgress] = useState(0);
  const [fade, setFade] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const step = STEPS[stepIndex];

  const goNext = () => {
    setFade(false);
    setTimeout(() => {
      const next = stepIndex + 1;
      setStepIndex(next);
      setFade(true);
      if (STEPS[next] === 'searching') startSearch();
    }, 180);
  };

  const goBack = () => {
    setFade(false);
    setTimeout(() => {
      setStepIndex((i) => i - 1);
      setFade(true);
    }, 180);
  };

  const startSearch = () => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 8;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          onComplete({
            name: name || 'Алексей',
            department,
            city,
            avatar: '🧑‍💻',
            photo,
            about,
            interests,
          });
        }, 700);
      }
      setSearchProgress(Math.min(p, 100));
    }, 300);
  };

  const toggleInterest = (label: string) => {
    setInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const canNext: Record<Step, boolean> = {
    welcome: true,
    name: name.trim().length >= 2,
    photo: true,
    about: true,
    department: department !== '' && city !== '',
    interests: interests.length >= 3,
    q0: !!answers['format'],
    q1: !!answers['vibe'],
    q2: !!answers['goal'],
    searching: false,
  };

  const progress = stepIndex / (STEPS.length - 1);
  const showBack = stepIndex > 0 && step !== 'searching' && step !== 'welcome';
  const showProgress = step !== 'welcome' && step !== 'searching';

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
      {showProgress && (
        <div className="px-6 pt-10 pb-2 flex items-center gap-3">
          {showBack && (
            <button onClick={goBack} className="text-[#767676] hover:text-[#141414] transition-colors flex-shrink-0">
              <Icon name="ArrowLeft" size={20} />
            </button>
          )}
          <div className="flex-1 progress-bar">
            <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      )}

      <div
        className="flex-1 px-6 py-6 flex flex-col"
        style={{
          opacity: fade ? 1 : 0,
          transform: fade ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
        }}
      >

        {step === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="w-24 h-24 bg-[#FFDD2D] rounded-[28px] flex items-center justify-center text-5xl mb-8"
              style={{ boxShadow: '0 8px 32px rgba(255,221,45,0.4)' }}
            >
              💛
            </div>
            <h1 className="text-[32px] font-black text-[#141414] text-center leading-tight mb-3">Tinterest</h1>
            <p className="text-[#767676] text-center text-base leading-relaxed mb-10">
              Знакомства с коллегами из Т‑банка<br />по интересам и вайбу
            </p>
            <div className="w-full space-y-3 mb-10">
              {[
                { e: '📝', t: 'Пройди анкету', d: 'Расскажи о себе и интересах' },
                { e: '🔍', t: 'Находим совпадения', d: 'Алгоритм подбирает похожих коллег' },
                { e: '💬', t: 'Начни общение', d: 'Прими или отклони предложение чата' },
              ].map(({ e, t, d }) => (
                <div key={t} className="flex items-center gap-4 bg-[#F6F6F6] rounded-2xl p-4">
                  <span className="text-2xl">{e}</span>
                  <div>
                    <p className="font-semibold text-[#141414] text-sm">{t}</p>
                    <p className="text-[#767676] text-xs">{d}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="t-btn" onClick={goNext}>Начать анкету →</button>
          </div>
        )}

        {step === 'name' && (
          <div className="flex-1 flex flex-col pt-4">
            <span className="text-xs font-bold text-[#FFDD2D] bg-[#141414] self-start px-3 py-1 rounded-full mb-6">
              Шаг 1 из {TOTAL_STEPS}
            </span>
            <h2 className="text-2xl font-black text-[#141414] mb-2">Как тебя зовут?</h2>
            <p className="text-[#767676] mb-8 text-sm">Коллеги увидят твоё имя в профиле</p>
            <input
              type="text"
              placeholder="Например, Алексей"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canNext.name && goNext()}
              className="w-full border-2 border-[#E8E8E8] focus:border-[#FFDD2D] rounded-2xl px-5 py-4 text-lg font-medium outline-none transition-colors"
              autoFocus
            />
            <div className="mt-auto pt-8">
              <button className="t-btn" onClick={goNext} disabled={!canNext.name} style={{ opacity: canNext.name ? 1 : 0.35 }}>
                Продолжить
              </button>
            </div>
          </div>
        )}

        {step === 'photo' && (
          <div className="flex-1 flex flex-col pt-4">
            <span className="text-xs font-bold text-[#FFDD2D] bg-[#141414] self-start px-3 py-1 rounded-full mb-6">
              Шаг 2 из {TOTAL_STEPS}
            </span>
            <h2 className="text-2xl font-black text-[#141414] mb-2">Добавь фото</h2>
            <p className="text-[#767676] mb-8 text-sm">Профили с фото получают в 3 раза больше откликов</p>

            <div className="flex flex-col items-center flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />

              {photo ? (
                <div className="relative mb-6">
                  <img
                    src={photo}
                    alt="Фото профиля"
                    className="w-44 h-44 rounded-[36px] object-cover"
                    style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 w-9 h-9 bg-[#FFDD2D] rounded-full flex items-center justify-center"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                  >
                    <Icon name="Pencil" size={15} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-44 h-44 rounded-[36px] border-2 border-dashed border-[#E8E8E8] bg-[#F6F6F6] flex flex-col items-center justify-center gap-3 mb-6 transition-all hover:border-[#FFDD2D] active:scale-95"
                >
                  <div className="w-14 h-14 bg-[#FFDD2D] rounded-2xl flex items-center justify-center">
                    <Icon name="Camera" size={24} />
                  </div>
                  <p className="text-sm font-semibold text-[#141414]">Загрузить фото</p>
                  <p className="text-xs text-[#A0A0A0]">JPG, PNG до 10 МБ</p>
                </button>
              )}

              {photo && (
                <p className="text-sm text-[#767676] text-center mb-2">
                  Отлично выглядишь, {name}! 👍
                </p>
              )}
            </div>

            <div className="pt-4 space-y-3">
              <button className="t-btn" onClick={goNext}>
                {photo ? 'Продолжить' : 'Продолжить без фото'}
              </button>
              {!photo && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="t-btn-outline"
                >
                  Выбрать фото
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'about' && (
          <div className="flex-1 flex flex-col pt-4">
            <span className="text-xs font-bold text-[#FFDD2D] bg-[#141414] self-start px-3 py-1 rounded-full mb-6">
              Шаг 3 из {TOTAL_STEPS}
            </span>
            <h2 className="text-2xl font-black text-[#141414] mb-2">О себе</h2>
            <p className="text-[#767676] mb-6 text-sm">Напиши пару слов — коллеги увидят это в анкете</p>
            <textarea
              placeholder={`Например: Продакт в команде карт. Обожаю горы, хорошие книги и специалити-кофе ☕`}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              maxLength={300}
              rows={5}
              className="w-full border-2 border-[#E8E8E8] focus:border-[#FFDD2D] rounded-2xl px-5 py-4 text-sm font-medium outline-none transition-colors resize-none leading-relaxed"
              autoFocus
            />
            <p className="text-xs text-[#A0A0A0] text-right mt-2">{about.length}/300</p>
            <div className="mt-auto pt-6">
              <button className="t-btn" onClick={goNext}>
                {about.trim().length > 0 ? 'Продолжить' : 'Пропустить'}
              </button>
            </div>
          </div>
        )}

        {step === 'department' && (
          <div className="flex-1 flex flex-col pt-4">
            <span className="text-xs font-bold text-[#FFDD2D] bg-[#141414] self-start px-3 py-1 rounded-full mb-6">
              Шаг 4 из {TOTAL_STEPS}
            </span>
            <h2 className="text-2xl font-black text-[#141414] mb-2">Где работаешь?</h2>
            <p className="text-[#767676] mb-6 text-sm">Отдел и город помогут найти коллег рядом</p>
            <p className="text-sm font-semibold text-[#141414] mb-3">Отдел</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {DEPARTMENTS.map((d) => (
                <button key={d} className={`chip ${department === d ? 'active' : ''}`} onClick={() => setDepartment(d)}>{d}</button>
              ))}
            </div>
            <p className="text-sm font-semibold text-[#141414] mb-3">Город</p>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((c) => (
                <button key={c} className={`chip ${city === c ? 'active' : ''}`} onClick={() => setCity(c)}>{c}</button>
              ))}
            </div>
            <div className="mt-auto pt-8">
              <button className="t-btn" onClick={goNext} disabled={!canNext.department} style={{ opacity: canNext.department ? 1 : 0.35 }}>
                Продолжить
              </button>
            </div>
          </div>
        )}

        {step === 'interests' && (
          <div className="flex-1 flex flex-col pt-4">
            <span className="text-xs font-bold text-[#FFDD2D] bg-[#141414] self-start px-3 py-1 rounded-full mb-6">
              Шаг 5 из {TOTAL_STEPS}
            </span>
            <h2 className="text-2xl font-black text-[#141414] mb-2">Твои интересы</h2>
            <p className="text-[#767676] mb-6 text-sm">Выбери минимум 3 — по ним найдём совпадения</p>
            <div className="flex flex-wrap gap-2 flex-1 content-start overflow-y-auto">
              {INTERESTS_LIST.map(({ emoji, label }) => (
                <button
                  key={label}
                  className={`chip ${interests.includes(label) ? 'active' : ''}`}
                  onClick={() => toggleInterest(label)}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <div className="pt-6">
              {interests.length > 0 && (
                <p className="text-sm text-[#767676] text-center mb-3">
                  Выбрано: <span className="font-bold text-[#141414]">{interests.length}</span>
                </p>
              )}
              <button className="t-btn" onClick={goNext} disabled={!canNext.interests} style={{ opacity: canNext.interests ? 1 : 0.35 }}>
                Продолжить
              </button>
            </div>
          </div>
        )}

        {(step === 'q0' || step === 'q1' || step === 'q2') && (() => {
          const qIndex = parseInt(step[1]);
          const q = QUESTIONS[qIndex];
          const stepNum = 6 + qIndex;
          return (
            <div className="flex-1 flex flex-col pt-4">
              <span className="text-xs font-bold text-[#FFDD2D] bg-[#141414] self-start px-3 py-1 rounded-full mb-6">
                Шаг {stepNum} из {TOTAL_STEPS}
              </span>
              <h2 className="text-2xl font-black text-[#141414] mb-2">{q.question}</h2>
              <p className="text-[#767676] mb-8 text-sm">Выбери один вариант</p>
              <div className="space-y-3 flex-1">
                {q.options.map(({ emoji, label }) => {
                  const isSelected = answers[q.id] === label;
                  return (
                    <button
                      key={label}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: label }))}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-150 text-left"
                      style={{
                        borderColor: isSelected ? '#FFDD2D' : '#E8E8E8',
                        background: isSelected ? '#FFFCE0' : 'white',
                      }}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <span className="font-medium text-[#141414] text-sm flex-1">{label}</span>
                      {isSelected && (
                        <span className="w-5 h-5 bg-[#FFDD2D] rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon name="Check" size={12} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="pt-6">
                <button
                  className="t-btn"
                  onClick={goNext}
                  disabled={!canNext[step]}
                  style={{ opacity: canNext[step] ? 1 : 0.35 }}
                >
                  {step === 'q2' ? 'Найти коллег 🚀' : 'Продолжить'}
                </button>
              </div>
            </div>
          );
        })()}

        {step === 'searching' && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="w-28 h-28 rounded-[32px] overflow-hidden mb-8 flex items-center justify-center"
              style={{
                background: photo ? 'transparent' : '#141414',
                boxShadow: '0 12px 40px rgba(20,20,20,0.15)',
              }}
            >
              {photo ? (
                <img src={photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl">🧑‍💻</span>
              )}
            </div>
            <h2 className="text-2xl font-black text-[#141414] mb-2 text-center">Ищем совпадения…</h2>
            <p className="text-[#767676] text-center text-sm mb-10">
              Анализируем интересы и вайб<br />твоих коллег из Т‑банка
            </p>
            <div className="w-full mb-3 progress-bar">
              <div className="progress-fill" style={{ width: `${searchProgress}%` }} />
            </div>
            <p className="text-sm font-semibold text-[#141414] mb-10">{Math.round(searchProgress)}%</p>
            <div className="space-y-4 w-full">
              {[
                { done: searchProgress > 25, text: 'Анализируем интересы' },
                { done: searchProgress > 55, text: 'Сравниваем вайб и стиль общения' },
                { done: searchProgress > 80, text: 'Подбираем лучших кандидатов' },
              ].map(({ done, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300"
                    style={{ background: done ? '#FFDD2D' : '#E8E8E8' }}
                  >
                    {done && <Icon name="Check" size={11} />}
                  </div>
                  <span className={`text-sm transition-colors ${done ? 'text-[#141414] font-medium' : 'text-[#A0A0A0]'}`}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}