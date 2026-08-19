#!/usr/bin/env bash
# Background-launch the server, wait for it to be ready (server + DB both
# healthy), then drive one full API flow end-to-end via curl. Run from
# server/. See SKILL.md for details.
set -euo pipefail

PORT="${PORT:-5000}"
BASE="http://localhost:${PORT}"
LOG=/tmp/server.log

echo "== starting server =="
npm run dev > "$LOG" 2>&1 &
SERVER_PID=$!

echo "== waiting for /api/health (server + DB) =="
for i in $(seq 1 30); do
  if curl -sf "$BASE/api/health" > /dev/null 2>&1; then
    break
  fi
  sleep 1
done
curl -sf "$BASE/api/health" && echo " -> health OK" || { echo "server never became healthy, log:"; cat "$LOG"; exit 1; }

echo
echo "== full flow: boards -> register -> post -> recommended -> comment -> cleanup =="

node --input-type=module -e "
const base = '${BASE}';

const boardsRes = await fetch(base + '/api/boards').then(r => r.json());
const boardId = boardsRes.boards[0].id;
console.log('boards:', boardsRes.boards.map(b => b.name).join('、'));

const email = 'smoke_' + Date.now() + '@example.com';
const registerRes = await fetch(base + '/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: 'password123', nickname: 'Smoke Test' }),
}).then(r => r.json());
const token = registerRes.token;
console.log('registered user id:', registerRes.user.id);

const postRes = await fetch(base + '/api/boards/' + boardId + '/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
  body: JSON.stringify({ title: 'smoke test post', content: 'from run-server smoke.sh', tag: '心得' }),
}).then(r => r.json());
const postId = postRes.post.id;
console.log('created post:', postId, postRes.post.tag);

const recRes = await fetch(base + '/api/posts/recommended').then(r => r.json());
console.log('recommended count:', recRes.posts.length);

const commentRes = await fetch(base + '/api/posts/' + postId + '/comments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
  body: JSON.stringify({ content: 'smoke test comment' }),
}).then(r => r.json());
console.log('created comment:', commentRes.comment.id);

await fetch(base + '/api/comments/' + commentRes.comment.id, {
  method: 'DELETE',
  headers: { Authorization: 'Bearer ' + token },
});
await fetch(base + '/api/posts/' + postId, {
  method: 'DELETE',
  headers: { Authorization: 'Bearer ' + token },
});
console.log('cleaned up comment + post');

import('dotenv/config').then(async () => {
  const { default: prisma } = await import('./lib/prisma.js');
  await prisma.user.deleteMany({ where: { email } });
  await prisma.\$disconnect();
  console.log('cleaned up smoke-test user');
});
"

echo
echo "== stopping server (pid $SERVER_PID) =="
# `npm run dev` -> nodemon -> node is a 3-level tree on Windows, and killing
# just the current port listener isn't enough: nodemon treats that as a
# crash and immediately respawns a *new* node process on the same port.
# Kill the whole tree via taskkill //T, then sweep whatever's still on the
# port as a fallback (there's no `lsof` in Git Bash, so use netstat).
taskkill //F //T //PID "$SERVER_PID" 2>/dev/null || true
netstat -ano | grep ":${PORT}.*LISTENING" | awk '{print $5}' | sort -u | xargs -r -I{} taskkill //F //PID {} 2>/dev/null || true
echo "done. full server log at $LOG"
