import { useState } from 'react';
import OnboardingScreen from './pages/Onboarding';
import RecommendationsScreen from './pages/Recommendations';
import NotificationsScreen from './pages/Notifications';
import ChatsScreen from './pages/Chats';
import ProfileScreen from './pages/Profile';
import Icon from '@/components/ui/icon';

export type Screen = 'onboarding' | 'recommendations' | 'notifications' | 'chats' | 'profile';

export interface UserProfile {
  name: string;
  department: string;
  city: string;
  avatar: string;
  photo: string | null;
  about: string;
  interests: string[];
}

const NAV_ITEMS = [
  { id: 'recommendations', label: 'Люди', icon: 'Users' },
  { id: 'chats', label: 'Чаты', icon: 'MessageCircle' },
  { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
] as const;

export default function App() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notifCount] = useState(3);

  const handleOnboardingComplete = (p: UserProfile) => {
    setProfile(p);
    setScreen('recommendations');
  };

  if (screen === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex flex-col max-w-md mx-auto relative">
      <div className="flex-1 pb-24 overflow-y-auto">
        {screen === 'recommendations' && <RecommendationsScreen profile={profile!} onNavigate={setScreen} />}
        {screen === 'notifications' && <NotificationsScreen />}
        {screen === 'chats' && <ChatsScreen />}
        {screen === 'profile' && <ProfileScreen profile={profile!} />}
      </div>

      <nav className="nav-bar">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${screen === item.id ? 'active' : ''}`}
            onClick={() => setScreen(item.id as Screen)}
          >
            <div className="relative">
              <Icon name={item.icon} size={22} />
              {item.id === 'notifications' && notifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFDD2D] text-[#141414] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {notifCount}
                </span>
              )}
            </div>
            <span>{item.label}</span>
            {screen === item.id && <div className="nav-dot" />}
          </button>
        ))}
      </nav>
    </div>
  );
}