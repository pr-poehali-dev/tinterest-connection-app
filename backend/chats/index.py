import json
import os
import psycopg2
import psycopg2.extras


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    """Управление матчами и сообщениями чатов"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
        'Content-Type': 'application/json',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    path = event.get('path', '/')

    # POST /chats — создать матч (принять рекомендацию)
    if method == 'POST' and 'match_id' not in params:
        body = json.loads(event.get('body') or '{}')
        user_id = body.get('user_id')
        target_user_id = body.get('target_user_id')

        conn = get_conn()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            """INSERT INTO matches (user_id, target_user_id, status)
               VALUES (%s, %s, 'accepted') RETURNING *""",
            (user_id, target_user_id)
        )
        match = dict(cur.fetchone())
        match['id'] = str(match['id'])
        match['user_id'] = str(match['user_id'])
        match['target_user_id'] = str(match['target_user_id'])
        match['created_at'] = str(match['created_at'])
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(match)}

    # POST /chats?match_id=... — отправить сообщение
    if method == 'POST' and 'match_id' in params:
        body = json.loads(event.get('body') or '{}')
        match_id = params.get('match_id')
        sender_id = body.get('sender_id')
        text = body.get('text', '')

        conn = get_conn()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            """INSERT INTO messages (match_id, sender_id, text) VALUES (%s, %s, %s) RETURNING *""",
            (match_id, sender_id, text)
        )
        msg = dict(cur.fetchone())
        msg['id'] = str(msg['id'])
        msg['match_id'] = str(msg['match_id'])
        msg['sender_id'] = str(msg['sender_id'])
        msg['created_at'] = str(msg['created_at'])
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(msg)}

    # GET /chats?user_id=... — список чатов
    if method == 'GET' and 'match_id' not in params:
        user_id = params.get('user_id')
        if not user_id:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'user_id required'})}

        conn = get_conn()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT m.id as match_id, m.status, m.created_at,
                   u.id as partner_id, u.name as partner_name, u.avatar as partner_avatar,
                   u.photo as partner_photo, u.department as partner_department,
                   (SELECT text FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_message,
                   (SELECT created_at FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_message_time
            FROM matches m
            JOIN users u ON u.id = CASE WHEN m.user_id = %s THEN m.target_user_id ELSE m.user_id END
            WHERE (m.user_id = %s OR m.target_user_id = %s) AND m.status = 'accepted'
            ORDER BY last_message_time DESC NULLS LAST
        """, (user_id, user_id, user_id))
        rows = cur.fetchall()
        cur.close()
        conn.close()

        chats = []
        for row in rows:
            r = dict(row)
            chats.append({
                'match_id': str(r['match_id']),
                'partner_id': str(r['partner_id']),
                'partner_name': r['partner_name'],
                'partner_avatar': r['partner_avatar'],
                'partner_photo': r['partner_photo'],
                'partner_department': r['partner_department'],
                'last_message': r['last_message'],
                'last_message_time': str(r['last_message_time']) if r['last_message_time'] else None,
            })
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(chats)}

    # GET /chats?match_id=... — сообщения чата
    if method == 'GET' and 'match_id' in params:
        match_id = params.get('match_id')
        conn = get_conn()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT msg.id, msg.sender_id, msg.text, msg.created_at
            FROM messages msg
            WHERE msg.match_id = %s
            ORDER BY msg.created_at ASC
        """, (match_id,))
        rows = cur.fetchall()
        cur.close()
        conn.close()

        messages = []
        for row in rows:
            r = dict(row)
            messages.append({
                'id': str(r['id']),
                'sender_id': str(r['sender_id']),
                'text': r['text'],
                'created_at': str(r['created_at']),
            })
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(messages)}

    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'method not allowed'})}
