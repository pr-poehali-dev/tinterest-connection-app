const USERS_URL = 'https://functions.poehali.dev/38c1df6d-b3ec-426d-abc4-8dd3059d284e';
const RECS_URL = 'https://functions.poehali.dev/836545fb-679c-40a4-b7e7-272c3b057a63';
const CHATS_URL = 'https://functions.poehali.dev/7527b62b-2ac5-43dc-8ee0-f201ef00c73a';

export interface ApiUser {
  id: string;
  name: string;
  department: string;
  city: string;
  avatar: string;
  photo: string | null;
  about: string;
  interests: string[];
  format_answer: string;
  vibe_answer: string;
  goal_answer: string;
}

export interface ApiRecommendation {
  id: string;
  name: string;
  department: string;
  city: string;
  avatar: string;
  photo: string | null;
  about: string;
  interests: string[];
  vibe: string;
  goal: string;
  match: number;
}

export interface ApiChat {
  match_id: string;
  partner_id: string;
  partner_name: string;
  partner_avatar: string;
  partner_photo: string | null;
  partner_department: string;
  last_message: string | null;
  last_message_time: string | null;
}

export interface ApiMessage {
  id: string;
  sender_id: string;
  text: string;
  created_at: string;
}

export async function createUser(data: {
  name: string;
  department: string;
  city: string;
  avatar: string;
  photo: string | null;
  about: string;
  interests: string[];
  format_answer: string;
  vibe_answer: string;
  goal_answer: string;
}): Promise<ApiUser> {
  const res = await fetch(USERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getRecommendations(userId: string): Promise<ApiRecommendation[]> {
  const res = await fetch(`${RECS_URL}?user_id=${userId}`);
  return res.json();
}

export async function acceptMatch(userId: string, targetUserId: string): Promise<{ id: string }> {
  const res = await fetch(CHATS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, target_user_id: targetUserId }),
  });
  return res.json();
}

export async function getChats(userId: string): Promise<ApiChat[]> {
  const res = await fetch(`${CHATS_URL}?user_id=${userId}`);
  return res.json();
}

export async function getMessages(matchId: string): Promise<ApiMessage[]> {
  const res = await fetch(`${CHATS_URL}?match_id=${matchId}`);
  return res.json();
}

export async function sendMessage(matchId: string, senderId: string, text: string): Promise<ApiMessage> {
  const res = await fetch(`${CHATS_URL}?match_id=${matchId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender_id: senderId, text }),
  });
  return res.json();
}
