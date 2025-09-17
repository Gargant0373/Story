from flask import Flask, request, jsonify, g
from flask_cors import CORS
import sqlite3
import os

BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, 'data.sqlite')
SCHEMA_PATH = os.path.join(BASE_DIR, 'schema.sql')

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DB_PATH)
        db.row_factory = sqlite3.Row
    return db

def init_db():
    if not os.path.exists(DB_PATH):
        with open(SCHEMA_PATH, 'r') as f:
            sql = f.read()
        conn = sqlite3.connect(DB_PATH)
        conn.executescript(sql)
        conn.commit()
        conn.close()

app = Flask(__name__)
CORS(app)

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/stories', methods=['GET'])
def get_stories():
    db = get_db()
    cur = db.execute('SELECT id, name, story, created_at FROM stories ORDER BY created_at DESC')
    rows = [dict(r) for r in cur.fetchall()]
    return jsonify(rows)

@app.route('/stories', methods=['POST'])
def post_story():
    data = request.get_json(force=True)
    name = (data.get('name') or '').strip()
    story = (data.get('story') or '').strip()
    if not name or not story:
        return jsonify({'error': 'name and story are required'}), 400
    db = get_db()
    cur = db.execute('INSERT INTO stories (name, story) VALUES (?, ?)', (name, story))
    db.commit()
    rowid = cur.lastrowid
    cur = db.execute('SELECT id, name, story, created_at FROM stories WHERE id = ?', (rowid,))
    row = cur.fetchone()
    return jsonify(dict(row)), 201

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 4000))
    app.run(host='0.0.0.0', port=port)
