import { UserProfile } from '../App';
import Icon from '@/components/ui/icon';

interface Props {
  profile: UserProfile;
}

const STATS = [
  { label: 'Просмотрено', value: '24' },
  { label: 'Совпадений', value: '8' },
  { label: 'Чатов', value: '2' },
];

export default function ProfileScreen({ profile }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F6F6F6]">
      <div
        className="px-5 pt-12 pb-8 flex flex-col items-center text-center"
        style={{ background: 'linear-gradient(180deg, #141414 0%, #1e1e1e 100%)' }}
      >
        <div
          className="w-24 h-24 bg-[#FFDD2D] rounded-[28px] flex items-center justify-center text-5xl mb-4"
          style={{ boxShadow: '0 8px 24px rgba(255,221,45,0.3)' }}
        >
          {profile.avatar}
        </div>
        <h2 className="text-xl font-black text-white mb-1">{profile.name}</h2>
        <p className="text-[#FFDD2D] text-sm font-medium mb-1">{profile.department}</p>
        <p className="text-[#767676] text-xs">{profile.city}</p>
      </div>

      <div className="px-5 -mt-4">
        <div className="bg-white rounded-2xl p-4 flex justify-around mb-4" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          {STATS.map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-black text-[#141414]">{value}</p>
              <p className="text-xs text-[#767676] mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-[#141414] text-sm">Мои интересы</p>
            <button className="text-[#767676]"><Icon name="Pencil" size={15} /></button>
          </div>
          {profile.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span key={interest} className="chip active text-sm pointer-events-none">{interest}</span>
              ))}
            </div>
          ) : (
            <p className="text-[#A0A0A0] text-sm">Интересы не выбраны</p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <p className="font-bold text-[#141414] text-sm mb-4">Настройки</p>
          <div className="space-y-4">
            {[
              { icon: 'Bell', label: 'Уведомления' },
              { icon: 'Lock', label: 'Приватность' },
              { icon: 'RefreshCw', label: 'Пройти анкету заново' },
            ].map(({ icon, label }) => (
              <button key={label} className="w-full flex items-center justify-between text-sm text-[#141414]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F6F6F6] rounded-xl flex items-center justify-center">
                    <Icon name={icon} size={15} />
                  </div>
                  <span>{label}</span>
                </div>
                <Icon name="ChevronRight" size={16} className="text-[#C0C0C0]" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#141414] rounded-2xl p-4 flex items-center gap-3 mb-8">
          <span className="text-2xl">💛</span>
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">Tinterest</p>
            <p className="text-[#767676] text-xs">Версия 1.0 · Т‑банк</p>
          </div>
        </div>
      </div>
    </div>
  );
}
