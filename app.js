const chat = document.getElementById('chat');
const input = document.getElementById('input');

function addMsg(text, who) {
  const d = document.createElement('div');
  d.className = 'msg ' + who;
  d.textContent = text;
  chat.appendChild(d);
}

function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'bn-BD';
  speechSynthesis.speak(u);
}

function reply(text) {
  addMsg(text, 'bot');
  speak(text);
}

function getNotes() {
  return JSON.parse(localStorage.getItem('notes') || '[]');
}

function handle(text) {
  if (text.startsWith('নোট দেখাও')) {
    const n = getNotes();
    return reply(n.length ? n.map((x, i) => (i + 1) + '. ' + x).join('\n') : 'কোনো নোট নেই');
  }
  if (text.startsWith('নোট')) {
    const body = text.replace('নোট', '').replace(/^[:\s]+/, '');
    const n = getNotes();
    n.push(body);
    localStorage.setItem('notes', JSON.stringify(n));
    return reply('নোট সেভ হয়েছে: ' + body);
  }
  if (text.startsWith('সার্চ')) {
    const q = text.replace('সার্চ', '').trim();
    window.open('https://www.google.com/search?q=' + encodeURIComponent(q));
    return reply('সার্চ করছি: ' + q);
  }
  reply('বুঝতে পারিনি। বলো: "নোট: ...", "নোট দেখাও" বা "সার্চ ..."');
}

function send() {
  const text = input.value.trim();
  if (!text) return;
  addMsg(text, 'me');
  input.value = '';
  handle(text);
}

document.getElementById('send').onclick = send;
input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

// ভয়েস ইনপুট
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
document.getElementById('mic').onclick = () => {
  if (!SR) return alert('এই ব্রাউজারে ভয়েস চলে না, Chrome ব্যবহার করো');
  const rec = new SR();
  rec.lang = 'bn-IN';
  rec.onresult = e => { input.value = e.results[0][0].transcript; };
  rec.start();
};
