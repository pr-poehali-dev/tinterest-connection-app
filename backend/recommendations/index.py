import json
import os
import psycopg2
import psycopg2.extras


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def calc_match(user: dict, candidate: dict) -> int:
    score = 0
    u_interests = set(user.get('interests') or [])
    c_interests = set(candidate.get('interests') or [])
    common = len(u_interests & c_interests)
    score += common * 15

    if user.get('vibe_answer') == candidate.get('vibe_answer'):
        score += 20
    if user.get('goal_answer') == candidate.get('goal_answer'):
        score += 20
    if user.get('format_answer') == candidate.get('format_answer'):
        score += 10
    if user.get('city') == candidate.get('city'):
        score += 5

    return min(score, 99)


def handler(event: dict, context) -> dict:
    """Получение рекомендаций коллег для пользователя"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
        'Content-Type': 'application/json',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    params = event.get('queryStringParameters') or {}
    user_id = params.get('user_id')
    if not user_id:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'user_id required'})}

    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute('SELECT * FROM users WHERE id = %s', (user_id,))
    me = cur.fetchone()
    if not me:
        cur.close()
        conn.close()
        return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'user not found'})}

    cur.execute("""
        SELECT u.* FROM users u
        WHERE u.id != %s
        AND u.id NOT IN (
            SELECT target_user_id FROM matches WHERE user_id = %s
        )
    """, (user_id, user_id))
    candidates = cur.fetchall()
    cur.close()
    conn.close()

    result = []
    for c in candidates:
        c_dict = dict(c)
        match_pct = calc_match(dict(me), c_dict)
        result.append({
            'id': str(c_dict['id']),
            'name': c_dict['name'],
            'department': c_dict['department'],
            'city': c_dict['city'],
            'avatar': c_dict['avatar'],
            'photo': c_dict['photo'],
            'about': c_dict['about'],
            'interests': c_dict['interests'] or [],
            'vibe': c_dict['vibe_answer'],
            'goal': c_dict['goal_answer'],
            'match': match_pct,
        })

    result.sort(key=lambda x: x['match'], reverse=True)
    return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result)}
