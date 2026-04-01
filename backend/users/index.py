import json
import os
import psycopg2
import psycopg2.extras


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    """Создание/получение профиля пользователя"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
        'Content-Type': 'application/json',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        name = body.get('name', '')
        department = body.get('department', '')
        city = body.get('city', '')
        avatar = body.get('avatar', '🧑')
        photo = body.get('photo')
        about = body.get('about', '')
        interests = body.get('interests', [])
        format_answer = body.get('format_answer', '')
        vibe_answer = body.get('vibe_answer', '')
        goal_answer = body.get('goal_answer', '')

        conn = get_conn()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            """INSERT INTO users (name, department, city, avatar, photo, about, interests, format_answer, vibe_answer, goal_answer)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *""",
            (name, department, city, avatar, photo, about, interests, format_answer, vibe_answer, goal_answer)
        )
        user = dict(cur.fetchone())
        user['id'] = str(user['id'])
        user['created_at'] = str(user['created_at'])
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(user)}

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        user_id = params.get('id')
        if not user_id:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'id required'})}

        conn = get_conn()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute('SELECT * FROM users WHERE id = %s', (user_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if not row:
            return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'not found'})}
        user = dict(row)
        user['id'] = str(user['id'])
        user['created_at'] = str(user['created_at'])
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(user)}

    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'method not allowed'})}
