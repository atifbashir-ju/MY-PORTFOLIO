

document.addEventListener('DOMContentLoaded', function () {

  /* ══ LOADER ══ */
  (function(){
    var loader=document.getElementById('loader');
    var bar=document.getElementById('lbar');
    var pct=document.getElementById('lpct');
    var msg=document.getElementById('lmsg');
    var msgs=['INITIALIZING...','LOADING ASSETS...','BUILDING UI...','ALMOST READY...','LAUNCHING...'];
    var p=0, mi=0;
    var iv=setInterval(function(){
      p+=Math.random()*4+1; if(p>100)p=100;
      if(bar)bar.style.width=p+'%';
      if(pct)pct.textContent=Math.round(p)+'%';
      var nm=Math.floor(p/25); if(nm!==mi&&nm<msgs.length){mi=nm;if(msg)msg.textContent=msgs[mi];}
      if(p>=100){
        clearInterval(iv);
        setTimeout(function(){
          if(loader)loader.classList.add('done');
          setTimeout(function(){if(loader)loader.style.display='none';},700);
        },300);
      }
    },45);
  })();

  /* ══ SCROLL PROGRESS ══ */
  (function(){
    var bar=document.getElementById('scroll-progress');
    if(!bar)return;
    window.addEventListener('scroll',function(){
      var pct=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;
      bar.style.width=pct+'%';
    },{passive:true});
  })();


  /* ══ CURSOR ══ */
  var cur = document.getElementById('cursor');
  var trail = document.getElementById('cursor-trail');
  var tx = 0, ty = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', function (e) {
    tx = e.clientX; ty = e.clientY;
    if (cur) { cur.style.left = tx + 'px'; cur.style.top = ty + 'px'; }
  });

  if (trail) {
    (function raf() {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      trail.style.left = cx + 'px'; trail.style.top = cy + 'px';
      requestAnimationFrame(raf);
    })();
  }

  if ('ontouchstart' in window) {
    if (cur) cur.style.display = 'none';
    if (trail) trail.style.display = 'none';
    document.body.style.cursor = 'default';
  }

  /* ══ NAV SCROLL ══ */
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-links a');
  var sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', function () {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
    var cur2 = '';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 160) cur2 = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + cur2);
    });
  }, { passive: true });

  /* ══ HAMBURGER ══ */
  var hbg = document.getElementById('hamburger');
  var mobMenu = document.getElementById('mob-menu');
  if (hbg && mobMenu) {
    hbg.addEventListener('click', function () {
      mobMenu.classList.toggle('open');
      document.body.style.overflow = mobMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ══ SMOOTH SCROLL ══ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
  });

  /* ══ TYPED ROLE ══ */
  var typedEl = document.getElementById('typed');
  if (typedEl) {
    var roles = ['Backend Developer', 'FastAPI Engineer', 'Python Specialist', 'AI/ML Enthusiast', 'Tech Student'];
    var ri = 0, ci = 0, deleting = false;
    function type() {
      var r = roles[ri];
      if (!deleting) {
        typedEl.textContent = r.slice(0, ++ci);
        if (ci === r.length) { deleting = true; setTimeout(type, 1600); return; }
      } else {
        typedEl.textContent = r.slice(0, --ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      }
      setTimeout(type, deleting ? 50 : 80);
    }
    setTimeout(type, 800);
  }

  /* ══ TERMINAL ══ */
  var termBody = document.getElementById('terminal-body');
  if (termBody) {
    var lines = [
      { t: 'cmd', s: 'whoami' },
      { t: 'out', s: 'atif.bashir · tech-student · backend-dev' },
      { t: 'cmd', s: 'cat location.txt' },
      { t: 'dim', s: 'Jammu & Kashmir, India · Remote Worldwide' },
      { t: 'cmd', s: 'python --version && fastapi --version' },
      { t: 'out', s: 'Python 3.11.4 · FastAPI 0.103.1' },
      { t: 'cmd', s: 'ls ./projects' },
      { t: 'dim', s: 'ai-resume-analyzer/ ai-code-review-bot/' },
      { t: 'cmd', s: 'echo $GOAL' },
      { t: 'out', s: 'become_ml_engineer=true · open_to_work=true' },
    ];
    var li = 0, chi = 0;
    function typeTerminal() {
      if (li >= lines.length) {
        var fin = document.createElement('div');
        fin.className = 't-line';
        fin.innerHTML = '<span class="t-prompt">❯</span> <span class="t-blink">_</span>';
        termBody.appendChild(fin);
        return;
      }
      var line = lines[li];
      if (chi === 0) {
        var div = document.createElement('div');
        div.className = 't-line';
        div.id = 'tl' + li;
        if (line.t === 'cmd') {
          div.innerHTML = '<span class="t-prompt">❯ </span><span class="t-cmd" id="ts' + li + '"></span>';
        } else {
          div.innerHTML = '<span class="' + (line.t === 'dim' ? 't-dim' : 't-out') + '" id="ts' + li + '"></span>';
        }
        termBody.appendChild(div);
      }
      var span = document.getElementById('ts' + li);
      if (!span) { li++; chi = 0; typeTerminal(); return; }
      if (chi < line.s.length) {
        span.textContent = line.s.slice(0, ++chi);
        setTimeout(typeTerminal, line.t === 'cmd' ? 40 : 15);
      } else {
        li++; chi = 0;
        setTimeout(typeTerminal, line.t === 'cmd' ? 350 : 60);
      }
    }
    var termObs = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { setTimeout(typeTerminal, 400); termObs.disconnect(); }
    }, { threshold: 0.3 });
    termObs.observe(termBody);
  }

  /* ══ TICKER ══ */
  var tickerEl = document.getElementById('ticker');
  if (tickerEl) {
    var items = ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'SQLAlchemy', 'Alembic', 'JWT', 'Uvicorn', 'Passlib', 'Git', 'GitHub', 'VS Code', 'Render', 'Vercel', 'HTML', 'CSS', 'JavaScript', 'C', 'C++', 'AI/ML', 'OpenAI'];
    tickerEl.innerHTML = items.concat(items).map(function (i) {
      return '<span class="ticker-item">' + i + '</span>';
    }).join('');
  }

  /* ══ STAT COUNTERS ══ */
  var statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length) {
    var statObs = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) {
        statNums.forEach(function (el) {
          var target = parseInt(el.dataset.target);
          var n = 0;
          var step = Math.max(target / 60, 0.1);
          var iv = setInterval(function () {
            n = Math.min(n + step, target);
            el.textContent = Math.round(n);
            if (n >= target) clearInterval(iv);
          }, 18);
        });
        statObs.disconnect();
      }
    }, { threshold: 0.5 });
    statObs.observe(document.querySelector('.stats-bar'));
  }

  /* ══ SKILL BARS ══ */
  var skillBarsEl = document.getElementById('skill-bars');
  if (skillBarsEl) {
    var skills = [
      { name: 'Python & Backend', pct: 88, color: 'linear-gradient(90deg,#6366f1,#8b5cf6)' },
      { name: 'FastAPI & REST APIs', pct: 85, color: 'linear-gradient(90deg,#ec4899,#8b5cf6)' },
      { name: 'Database & ORM', pct: 80, color: 'linear-gradient(90deg,#06b6d4,#6366f1)' },
      { name: 'DevOps & Docker', pct: 75, color: 'linear-gradient(90deg,#f59e0b,#ef4444)' },
      { name: 'Frontend (HTML/CSS/JS)', pct: 70, color: 'linear-gradient(90deg,#10b981,#06b6d4)' },
      { name: 'AI / ML (Learning)', pct: 45, color: 'linear-gradient(90deg,#8b5cf6,#ec4899)' },
    ];
    skills.forEach(function (s) {
      var row = document.createElement('div');
      row.className = 'skill-bar';
      row.innerHTML = '<div class="skill-bar-top"><span class="skill-bar-name">' + s.name + '</span><span class="skill-bar-pct">' + s.pct + '%</span></div><div class="skill-track"><div class="skill-fill" data-w="' + s.pct + '" style="background:' + s.color + '"></div></div>';
      skillBarsEl.appendChild(row);
    });
    var skillObs = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) {
        skillBarsEl.querySelectorAll('.skill-fill').forEach(function (f) {
          f.style.width = f.dataset.w + '%';
        });
        skillObs.disconnect();
      }
    }, { threshold: 0.3 });
    skillObs.observe(skillBarsEl);
  }

  /* ══ TECH GRID ══ */
  var techGridEl = document.getElementById('tech-grid');
  if (techGridEl) {
    var techs = [
      { icon: '🐍', name: 'Python', level: 'EXPERT' },
      { icon: '⚡', name: 'FastAPI', level: 'EXPERT' },
      { icon: '🐘', name: 'PostgreSQL', level: 'ADVANCED' },
      { icon: '🔴', name: 'Redis', level: 'ADVANCED' },
      { icon: '🐳', name: 'Docker', level: 'ADVANCED' },
      { icon: '🔑', name: 'JWT', level: 'EXPERT' },
      { icon: '📦', name: 'SQLAlchemy', level: 'ADVANCED' },
      { icon: '🔄', name: 'Alembic', level: 'ADVANCED' },
      { icon: '🦄', name: 'Uvicorn', level: 'EXPERT' },
      { icon: '🌿', name: 'Git', level: 'ADVANCED' },
      { icon: '🌐', name: 'JS/HTML/CSS', level: 'INTERMEDIATE' },
      { icon: '🔒', name: 'Passlib', level: 'ADVANCED' },
    ];
    techs.forEach(function (t) {
      var node = document.createElement('div');
      node.className = 'tech-node';
      node.innerHTML = '<span class="tech-icon">' + t.icon + '</span><span class="tech-name">' + t.name + '</span><p class="tech-level">' + t.level + '</p>';
      techGridEl.appendChild(node);
    });
  }

  /* ══ TIMELINE ══ */
  var timelineEl = document.getElementById('timeline');
  if (timelineEl) {
    var events = [
      { year: '2026', title: 'National Hackathon — Top 3', org: 'University of Jammu (SIIEDC)', desc: '2-day national hackathon. Secured Top 3 among teams from across India.', chips: ['Innovation', 'Problem Solving', 'Teamwork'] },
      { year: '2026', title: 'Python Using AI Workshop', org: 'AI For Techies', desc: 'Learned to use AI tools to write, debug, and visualize Python code — 3x faster development.', chips: ['Python', 'AI Tools', 'Automation'] },
      { year: '2026', title: 'AI Tools Workshop', org: 'be10x', desc: 'Completed training on AI productivity tools — ChatGPT, data analysis, coding automation.', chips: ['ChatGPT', 'AI', 'Productivity'] },
      { year: '2025', title: 'AI Code Review Bot', org: 'Personal Project', desc: 'Built GitHub webhook bot with FastAPI + GPT-4 that auto-reviews PRs.', chips: ['FastAPI', 'OpenAI', 'GitHub API', 'Docker'] },
      { year: '2025', title: 'AI Resume Analyzer — Live', org: 'Personal Project', desc: 'Built & deployed full-stack AI resume analyzer using FastAPI + PostgreSQL + Redis.', chips: ['FastAPI', 'AI', 'PostgreSQL', 'Vercel'] },
      { year: '2024', title: 'Started Programming', org: 'University of Jammu', desc: 'Began with C, C++ and fundamentals. Discovered my passion for backend development.', chips: ['C', 'C++', 'Python', 'Basics'] },
    ];
    events.forEach(function (ev, idx) {
      var item = document.createElement('div');
      item.className = 'tl-item';
      var chips = ev.chips.map(function (c) { return '<span class="tl-chip">' + c + '</span>'; }).join('');
      item.innerHTML = '<div class="tl-dot"></div><div class="tl-content"><div class="tl-year">' + ev.year + '</div><h3 class="tl-title">' + ev.title + '</h3><p class="tl-org">' + ev.org + '</p><p class="tl-desc">' + ev.desc + '</p><div class="tl-chips">' + chips + '</div></div>';
      timelineEl.appendChild(item);
    });
    var tlObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('vis'); });
    }, { threshold: 0.2 });
    timelineEl.querySelectorAll('.tl-content').forEach(function (el) { tlObs.observe(el); });
  }

  /* ══ GITHUB LIVE STATS ══ */
  var ghStatsEl = document.getElementById('gh-stats');
  var ghReposEl = document.getElementById('gh-repos');
  var ghContribEl = document.getElementById('contrib-grid');
  var USERNAME = 'atifbashir-ju';

  function renderGhStats(data) {
    if (!ghStatsEl) return;
    var cards = [
      { icon: '📁', num: data.public_repos || '5+', label: 'Public Repos' },
      { icon: '👥', num: data.followers || '10+', label: 'Followers' },
      { icon: '🔗', num: data.following || '20+', label: 'Following' },
      { icon: '⭐', num: '50+', label: 'Total Stars' },
    ];
    ghStatsEl.innerHTML = cards.map(function (c) {
      return '<div class="gh-stat"><span class="gh-stat-icon">' + c.icon + '</span><span class="gh-stat-num">' + c.num + '</span><span class="gh-stat-label">' + c.label + '</span></div>';
    }).join('');
  }

  function renderGhRepos(repos) {
    if (!ghReposEl) return;
    ghReposEl.innerHTML = repos.map(function (r) {
      return '<div class="repo-card"><div class="repo-name"><a href="' + (r.html_url || 'https://github.com/atifbashir-ju') + '" target="_blank">⌥ ' + r.name + '</a></div><p class="repo-desc">' + (r.description || 'No description') + '</p><div class="repo-meta"><span class="repo-lang">◆ ' + (r.language || 'Code') + '</span><span class="repo-stars">⭐ ' + (r.stargazers_count || 0) + '</span><span>🍴 ' + (r.forks_count || 0) + '</span></div></div>';
    }).join('');
  }

  var fallbackRepos = [
    { name: 'ai-resume-builder', html_url: 'https://github.com/atifbashir-ju', description: 'AI resume analyzer — FastAPI + PostgreSQL + Redis + Docker', language: 'Python', stargazers_count: 5, forks_count: 1 },
    { name: 'ai-code-review-bot', html_url: 'https://github.com/atifbashir-ju', description: 'GitHub webhook bot — FastAPI + GPT-4 auto-reviews PRs', language: 'Python', stargazers_count: 3, forks_count: 0 },
    { name: 'portfolio', html_url: 'https://github.com/atifbashir-ju', description: 'Personal portfolio — HTML + CSS + JavaScript', language: 'JavaScript', stargazers_count: 2, forks_count: 0 },
  ];

  fetch('https://api.github.com/users/' + USERNAME)
    .then(function (r) { return r.json(); })
    .then(renderGhStats)
    .catch(function () { renderGhStats({}); });

  fetch('https://api.github.com/users/' + USERNAME + '/repos?sort=updated&per_page=4')
    .then(function (r) { return r.json(); })
    .then(function (d) { renderGhRepos(Array.isArray(d) && d.length ? d.slice(0, 4) : fallbackRepos); })
    .catch(function () { renderGhRepos(fallbackRepos); });

  if (ghContribEl) {
    var cells = [];
    for (var i = 0; i < 364; i++) {
      var rand = Math.random();
      var lv = rand > 0.85 ? 4 : rand > 0.70 ? 3 : rand > 0.55 ? 2 : rand > 0.40 ? 1 : 0;
      if (i > 320) lv = Math.min(4, lv + 1);
      if (i > 350) lv = Math.min(4, lv + 1);
      cells.push('<div class="cc cc-' + lv + '" title="' + lv + ' contributions"></div>');
    }
    ghContribEl.innerHTML = cells.join('');
  }

  /* ══ SCROLL REVEAL ══ */
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  function observeAll() {
    document.querySelectorAll('.reveal:not(.vis)').forEach(function (el) { revObs.observe(el); });
  }
  observeAll();
  setTimeout(observeAll, 500);
  setTimeout(observeAll, 1500);

  /* ══ RESUME MODAL ══ */
  var resumeModal = document.getElementById('resume-modal');
  var resumeClose = document.getElementById('resume-close');
  var resumeClose2 = document.getElementById('resume-close2');
  var resumePrint = document.getElementById('resume-print');

  function openResumeModal() {
    if (resumeModal) { resumeModal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  }
  function closeResumeModal() {
    if (resumeModal) { resumeModal.classList.remove('open'); document.body.style.overflow = ''; }
  }

  if (resumeClose) resumeClose.addEventListener('click', closeResumeModal);
  if (resumeClose2) resumeClose2.addEventListener('click', closeResumeModal);
  if (resumeModal) resumeModal.addEventListener('click', function (e) { if (e.target === resumeModal) closeResumeModal(); });
  if (resumePrint) {
    resumePrint.addEventListener('click', function () {
      var c = document.getElementById('resume-content');
      if (!c) return;
      var w = window.open('', '_blank');
      w.document.write('<html><head><title>Atif Bashir Resume</title><style>body{font-family:monospace;background:#050510;color:#f1f5f9;padding:2rem;max-width:800px;margin:0 auto}h1{color:#6366f1;font-size:1.8rem}h2{color:#6366f1;font-size:.8rem;letter-spacing:.15em;border-bottom:1px solid rgba(99,102,241,.2);padding-bottom:.3rem;margin:1.3rem 0 .7rem}p{color:#64748b;font-size:.8rem;line-height:1.8}.resume-chips{display:flex;flex-wrap:wrap;gap:.4rem}.resume-chips span{border:1px solid rgba(99,102,241,.2);padding:.18rem .5rem;font-size:.7rem;color:#64748b}.resume-item{border:1px solid rgba(99,102,241,.08);padding:.8rem;margin-bottom:.7rem}.resume-item-header{display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:.3rem}.resume-item-header strong{color:#f1f5f9}</style></head><body>');
      w.document.write(c.innerHTML);
      w.document.write('</body></html>');
      w.document.close();
      setTimeout(function () { w.print(); }, 500);
    });
  }

  // Make openResumeModal accessible from HTML buttons
  document.querySelectorAll('[onclick="openResumeModal()"]').forEach(function (el) {
    el.removeAttribute('onclick');
    el.addEventListener('click', openResumeModal);
  });

  /* ══ HIRE MODAL ══ */
  var hireModal = document.getElementById('hire-modal');
  var hireClose = document.getElementById('hire-close');

  function openHireModal() {
    if (hireModal) { hireModal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  }
  function closeHireModal() {
    if (hireModal) { hireModal.classList.remove('open'); document.body.style.overflow = ''; }
  }

  if (hireClose) hireClose.addEventListener('click', closeHireModal);
  if (hireModal) hireModal.addEventListener('click', function (e) { if (e.target === hireModal) closeHireModal(); });

  document.querySelectorAll('[onclick="openHireModal()"]').forEach(function (el) {
    el.removeAttribute('onclick');
    el.addEventListener('click', openHireModal);
  });

  // Nav hire button
  var navHire = document.querySelector('.nav-hire');
  if (navHire) navHire.addEventListener('click', openHireModal);

  /* ══ CHATBOT ══ */
  var chatFab = document.getElementById('chat-fab');
  var chatWindow = document.getElementById('chat-window');
  var chatCloseBtn = document.getElementById('chat-close-btn');
  var chatMessages = document.getElementById('chat-messages');
  var chatInput = document.getElementById('chat-input');
  var chatSendBtn = document.getElementById('chat-send-btn');
  var chatSuggestions = document.getElementById('chat-suggestions');
  var chatIsOpen = false;

  function toggleChat() {
    chatIsOpen = !chatIsOpen;
    if (chatWindow) chatWindow.classList.toggle('open', chatIsOpen);
  }

  function getBotReply(q) {
    var ql = q.toLowerCase();
    if (ql.match(/who is|who is he|about atif|tell me about|introduce|atif bashir/))
      return "👨‍💻 <b>Atif Bashir</b> is a passionate tech student & Backend Developer from <b>Jammu & Kashmir, India</b>. He specializes in <b>Python & FastAPI</b>, building scalable APIs and AI-powered systems. He's an <b>AI/ML enthusiast</b> actively working towards becoming a Machine Learning Engineer — curious, hardworking, and always learning! 🚀";
    if (ql.match(/where|from|location|jammu|kashmir|india|city|country/))
      return "📍 Atif is from <b>Jammu & Kashmir, India</b> — a beautiful region in northern India! He is available for <b>remote work worldwide</b> and can also work on-site or hybrid.";
    if (ql.match(/student|education|university|college|study|degree/))
      return "🎓 Atif is a <b>tech student</b> at University of Jammu, J&K, India. He studies computer science while building real-world projects alongside his studies — he firmly believes in learning by doing! 💪";
    if (ql.match(/stack|tech|language|framework|tool|technology/))
      return "🛠️ Atif's full tech stack:<br><br>🐍 <b>Languages:</b> Python, C, C++, JS, HTML, CSS<br>⚡ <b>Framework:</b> FastAPI + Uvicorn<br>🐘 <b>Database:</b> PostgreSQL + Redis<br>📦 <b>ORM:</b> SQLAlchemy + Alembic<br>🔑 <b>Auth:</b> JWT + Passlib<br>🐳 <b>DevOps:</b> Docker, Git, GitHub<br>🚀 <b>Deploy:</b> Render + Vercel";
    if (ql.match(/project|work|build|app|system|made|create/))
      return "🚀 Atif's projects:<br><br>🤖 <b>AI Resume Analyzer</b> — LIVE! AI platform for resume analysis & ATS optimization. Stack: FastAPI + PostgreSQL + Redis + Docker + Vercel<br><br>🔍 <b>AI Code Review Bot</b> — Building! GPT-4 GitHub PR auto-reviewer. Stack: FastAPI + OpenAI + Docker<br><br>Check GitHub: github.com/atifbashir-ju";
    if (ql.match(/ai|ml|machine learning|artificial intelligence|deep learning/))
      return "🤖 Atif is a huge <b>AI/ML enthusiast</b>! He's actively learning Machine Learning — algorithms, neural networks, model deployment. His dream is to become an <b>ML Engineer</b> and combine his backend skills with AI. He also uses AI tools daily to code 3x faster! 🚀";
    if (ql.match(/cert|hackathon|award|win|achieve/))
      return "🏆 Atif's achievements:<br><br>🥇 <b>National Hackathon TOP 3</b> — University of Jammu (Feb 2026)<br>🤖 <b>AI Tools Workshop</b> — be10x (Feb 2026)<br>🐍 <b>Python Using AI Workshop</b> — AI For Techies (Mar 2026)<br><br>He competed with teams from across India and won Top 3! 💪";
    if (ql.match(/hire|available|job|employ|freelance|intern|opportunit/))
      return "✅ <b>Atif is available for hire!</b><br><br>💼 Open to: Full-time · Freelance · Internship<br>📅 Available: Immediately<br>🌍 Work: Remote / On-site / Hybrid<br>⚡ Response: Under 24 hours<br><br>📧 Atifparay16@gmail.com<br>📞 +91 9103250056";
    if (ql.match(/contact|email|phone|reach|number|connect/))
      return "📬 Contact Atif:<br><br>📧 <b>Email:</b> Atifparay16@gmail.com<br>📞 <b>Phone:</b> +91 9103250056<br>🔗 <b>GitHub:</b> github.com/atifbashir-ju<br>💼 <b>LinkedIn:</b> linkedin.com/in/atif-bashir-350488397<br>📸 <b>Instagram:</b> @iamatif_bashir";
    if (ql.match(/passion|hobby|interest|personality|like|enjoy|character/))
      return "😊 Atif is <b>hardworking, curious & passionate</b>! He loves:<br>🔧 Building backend systems<br>🤖 Exploring AI/ML<br>📚 Learning new tech daily<br>💡 Solving complex problems<br>🚀 Deploying real apps<br><br>He never stops improving! 💪";
    if (ql.match(/goal|dream|future|plan|ambition|vision/))
      return "🎯 Atif's goal: become a <b>Machine Learning Engineer</b>! He wants to combine his strong Python/backend skills with AI to build intelligent, scalable systems that make real-world impact. He works hard every single day! 🚀";
    if (ql.match(/python|fastapi|backend|api|server/))
      return "🐍 Python & FastAPI are Atif's <b>core expertise</b>! He builds high-performance REST APIs, secure auth systems with JWT, database integration with SQLAlchemy + Alembic, Docker containers, and deploys on Render + Vercel. <b>Expert level!</b> 💪";
    if (ql.match(/hello|hi|hey|sup|hola|namaste|salam/))
      return "Hey! 👋 I'm Atif's AI assistant — I know everything about him!<br><br>You can ask me:<br>• Who is Atif?<br>• His tech stack<br>• His projects<br>• Where is he from?<br>• Available for hire?<br><br>What would you like to know? 🚀";
    return "🤔 Great question! Atif Bashir is a passionate Backend Developer & AI/ML enthusiast from Jammu & Kashmir, India — building with Python + FastAPI!<br><br>Try asking:<br>• <i>Who is Atif?</i><br>• <i>Tech stack?</i><br>• <i>Available for hire?</i><br><br>Or email him: Atifparay16@gmail.com 📧";
  }

  function addMessage(text, isUser) {
    if (!chatMessages) return;
    var msg = document.createElement('div');
    msg.className = 'chat-msg ' + (isUser ? 'user-msg' : 'bot-msg');
    msg.innerHTML = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    if (!chatMessages) return null;
    var typ = document.createElement('div');
    typ.className = 'typing-indicator';
    typ.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typ);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typ;
  }

  function sendMessage() {
    if (!chatInput) return;
    var q = chatInput.value.trim();
    if (!q) return;
    addMessage(q, true);
    chatInput.value = '';
    if (chatSuggestions) chatSuggestions.style.display = 'none';
    var typ = showTyping();
    setTimeout(function () {
      if (typ && typ.parentNode) chatMessages.removeChild(typ);
      addMessage(getBotReply(q), false);
    }, 800 + Math.random() * 600);
  }

  if (chatFab) chatFab.addEventListener('click', toggleChat);
  if (chatCloseBtn) chatCloseBtn.addEventListener('click', toggleChat);
  if (chatSendBtn) chatSendBtn.addEventListener('click', sendMessage);
  if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendMessage();
    });
  }

  // Suggestion buttons
  if (chatSuggestions) {
    chatSuggestions.querySelectorAll('.chat-sug-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var q = btn.dataset.q;
        if (q && chatInput) {
          chatInput.value = q;
          sendMessage();
        }
      });
    });
  }

  /* ══ EMAILJS CONTACT FORM ══ */
  (function(){
    // ╔══════════════════════════════════════════╗
    // ║  REPLACE THESE WITH YOUR EMAILJS VALUES  ║
    // ╚══════════════════════════════════════════╝
    var EMAILJS_PUBLIC_KEY  = 'irTC1ZgBYdT65g48C';
    var EMAILJS_SERVICE_ID  = 'service_uvcq1bb';
    var EMAILJS_TEMPLATE_ID = 'template_0q5pqc9';
    // ═══════════════════════════════════════════

    // Initialize EmailJS
    if(typeof emailjs !== 'undefined'){
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    var form    = document.getElementById('contact-form');
    var btnTxt  = document.getElementById('form-btn-txt');
    var btn     = document.getElementById('form-submit-btn');
    var status  = document.getElementById('form-status');

    function showStatus(type, msg){
      if(!status) return;
      status.className = 'form-status ' + type;
      status.style.display = 'flex';
      if(type === 'loading'){
        status.innerHTML = '<div class="spinner"></div><span>' + msg + '</span>';
      } else if(type === 'success'){
        status.innerHTML = '✅ ' + msg;
      } else {
        status.innerHTML = '❌ ' + msg;
      }
    }

    function hideStatus(){
      if(status){ status.style.display = 'none'; status.className = 'form-status'; }
    }

    function setLoading(loading){
      if(!btn || !btnTxt) return;
      if(loading){
        btn.disabled = true;
        btn.classList.add('form-submit-loading');
        btnTxt.innerHTML = '<div class="spinner" style="border-color:rgba(255,255,255,.3);border-top-color:#fff;display:inline-block;margin-right:.4rem"></div> Sending...';
      } else {
        btn.disabled = false;
        btn.classList.remove('form-submit-loading');
        btnTxt.textContent = 'Send Message →';
      }
    }

    if(form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        hideStatus();

        // Validate
        var name    = document.getElementById('from_name');
        var email   = document.getElementById('from_email');
        var message = document.getElementById('message');

        if(!name || !name.value.trim()){ showStatus('error','Please enter your name.'); return; }
        if(!email || !email.value.trim()){ showStatus('error','Please enter your email.'); return; }
        if(!message || !message.value.trim()){ showStatus('error','Please write a message.'); return; }

        // Check if EmailJS keys are configured
        if(!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY.length < 5){
          // Fallback — open mailto
          var sub = document.getElementById('subject');
          var mailBody = 'Name: ' + name.value + '%0D%0AEmail: ' + email.value + '%0D%0A%0D%0A' + message.value;
          var mailSubject = sub && sub.value ? sub.value : 'Message from Portfolio';
          window.location.href = 'mailto:Atifparay16@gmail.com?subject=' + encodeURIComponent(mailSubject) + '&body=' + mailBody;
          showStatus('success', 'Opening your email client...');
          return;
        }

        setLoading(true);
        showStatus('loading', 'Sending your message...');

        // Send via EmailJS
        var templateParams = {
          from_name:  name.value.trim(),
          from_email: email.value.trim(),
          subject:    (document.getElementById('subject') || {}).value || 'No subject',
          message:    message.value.trim(),
          to_email:   'Atifparay16@gmail.com',
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
          .then(function(response){
            console.log('EmailJS SUCCESS:', response.status, response.text);
            setLoading(false);
            showStatus('success', 'Message sent! Atif will reply within 24 hours. 🚀');
            form.reset();
            // Auto-hide success after 5s
            setTimeout(hideStatus, 5000);
          })
          .catch(function(error){
            console.error('EmailJS ERROR:', error);
            setLoading(false);
            showStatus('error', 'Failed to send. Please email directly: Atifparay16@gmail.com');
          });
      });
    }
  })();


  /* ══════════════════════════════════════
     MAGNETIC CURSOR
  ══════════════════════════════════════ */
  (function(){
    var cur = document.getElementById('cursor');
    var trail = document.getElementById('cursor-trail');
    if(!cur || !trail) return;
    
    // Magnetic effect on buttons/links
    var magnetTargets = document.querySelectorAll('a, button, .tech-node, .project-card, .cert-card, .social-card, .chat-fab');
    
    magnetTargets.forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width/2;
        var cy = rect.top + rect.height/2;
        var dx = (e.clientX - cx) * 0.25;
        var dy = (e.clientY - cy) * 0.25;
        el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
        if(cur){
          cur.style.background = 'var(--pink)';
          cur.style.width = '20px';
          cur.style.height = '20px';
          cur.style.boxShadow = '0 0 20px var(--pink), 0 0 40px rgba(236,72,153,.3)';
        }
        if(trail){
          trail.style.borderColor = 'rgba(236,72,153,.6)';
          trail.style.transform = 'translate(-50%,-50%) scale(1.5)';
        }
      });
      el.addEventListener('mouseleave', function(){
        el.style.transform = '';
        if(cur){
          cur.style.background = 'var(--neon)';
          cur.style.width = '12px';
          cur.style.height = '12px';
          cur.style.boxShadow = '0 0 20px var(--neon), 0 0 40px rgba(99,102,241,.3)';
        }
        if(trail){
          trail.style.borderColor = 'rgba(99,102,241,.4)';
          trail.style.transform = 'translate(-50%,-50%) scale(1)';
        }
      });
    });
    
    // Re-observe on scroll (for dynamically added elements)
    setTimeout(function(){
      document.querySelectorAll('.project-card, .cert-card').forEach(function(el){
        el.addEventListener('mousemove', function(e){
          var rect = el.getBoundingClientRect();
          var cx = rect.left + rect.width/2;
          var cy = rect.top + rect.height/2;
          el.style.transform = 'translate(' + (e.clientX-cx)*.08 + 'px,' + (e.clientY-cy)*.08 + 'px) translateY(-8px)';
        });
        el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
      });
    }, 1000);
  })();

  /* ══════════════════════════════════════
     LIVE CODING EFFECT
  ══════════════════════════════════════ */
  (function(){
    var linesEl = document.getElementById('lc-lines');
    var outEl   = document.getElementById('lc-out-text');
    var tabs    = document.querySelectorAll('.lc-tab');
    if(!linesEl) return;

    var files = {
      'main.py': {
        lines: [
          {c:'<span class="cm"># AI Resume Analyzer — FastAPI Backend</span>', d:0},
          {c:'<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI, UploadFile, File', d:80},
          {c:'<span class="kw">from</span> app.services <span class="kw">import</span> ai_service, resume_parser', d:140},
          {c:'<span class="kw">from</span> app.models <span class="kw">import</span> ResumeAnalysis', d:200},
          {c:'', d:260},
          {c:'app = <span class="fn">FastAPI</span>(<span class="dt">title</span>=<span class="st">"AI Resume Analyzer"</span>)', d:300},
          {c:'', d:380},
          {c:'<span class="kw">@app.post</span>(<span class="st">"/analyze"</span>, response_model=ResumeAnalysis)', d:420},
          {c:'<span class="kw">async def</span> <span class="fn">analyze_resume</span>(file: <span class="fn">UploadFile</span> = <span class="fn">File</span>(...)):', d:520},
          {c:'    content = <span class="kw">await</span> file.<span class="fn">read</span>()', d:620},
          {c:'    parsed = <span class="kw">await</span> resume_parser.<span class="fn">extract</span>(content)', d:720},
          {c:'    result = <span class="kw">await</span> ai_service.<span class="fn">analyze</span>(parsed)', d:820},
          {c:'    <span class="kw">return</span> <span class="fn">ResumeAnalysis</span>(**result)', d:920},
        ],
        output: [
          {t:'INFO     uvicorn running on http://0.0.0.0:8000', c:'lc-out-info', d:1200},
          {t:'INFO     Started reloader process [28720]', c:'lc-out-info', d:1500},
          {t:'✓  Resume parser loaded', c:'lc-out-success', d:1800},
          {t:'✓  OpenAI client initialized', c:'lc-out-success', d:2100},
          {t:'✓  PostgreSQL connected: pool_size=10', c:'lc-out-success', d:2400},
          {t:'✓  Redis cache ready', c:'lc-out-success', d:2700},
          {t:'POST /analyze  200 OK  [342ms]', c:'lc-out-url', d:3200},
        ]
      },
      'models.py': {
        lines: [
          {c:'<span class="kw">from</span> sqlalchemy <span class="kw">import</span> Column, Integer, String, Float, JSON', d:0},
          {c:'<span class="kw">from</span> app.core.database <span class="kw">import</span> Base', d:80},
          {c:'', d:140},
          {c:'<span class="kw">class</span> <span class="fn">ResumeAnalysis</span>(Base):', d:180},
          {c:'    __tablename__ = <span class="st">"analyses"</span>', d:280},
          {c:'', d:340},
          {c:'    id       = <span class="fn">Column</span>(<span class="fn">Integer</span>, primary_key=<span class="dt">True</span>)', d:380},
          {c:'    score    = <span class="fn">Column</span>(<span class="fn">Float</span>, nullable=<span class="dt">False</span>)', d:480},
          {c:'    keywords = <span class="fn">Column</span>(<span class="fn">JSON</span>)', d:580},
          {c:'    feedback = <span class="fn">Column</span>(<span class="fn">String</span>(<span class="nm">2000</span>))', d:680},
          {c:'    ats_pass = <span class="fn">Column</span>(<span class="fn">Boolean</span>, default=<span class="dt">False</span>)', d:780},
        ],
        output: [
          {t:'✓  Models validated', c:'lc-out-success', d:1100},
          {t:'INFO     Running Alembic migrations...', c:'lc-out-info', d:1400},
          {t:'✓  Table "analyses" created', c:'lc-out-success', d:1700},
          {t:'✓  Table "users" created', c:'lc-out-success', d:2000},
          {t:'INFO     Schema up to date', c:'lc-out-info', d:2300},
        ]
      },
      'ai_service.py': {
        lines: [
          {c:'<span class="kw">from</span> openai <span class="kw">import</span> AsyncOpenAI', d:0},
          {c:'<span class="kw">from</span> app.core.config <span class="kw">import</span> settings', d:80},
          {c:'', d:140},
          {c:'client = <span class="fn">AsyncOpenAI</span>(api_key=settings.OPENAI_KEY)', d:180},
          {c:'', d:260},
          {c:'<span class="kw">async def</span> <span class="fn">analyze</span>(resume_data: dict) -> dict:', d:300},
          {c:'    <span class="cm"># Score resume with GPT-4</span>', d:400},
          {c:'    response = <span class="kw">await</span> client.chat.completions.<span class="fn">create</span>(', d:460},
          {c:'        model=<span class="st">"gpt-4o"</span>,', d:560},
          {c:'        messages=[{<span class="st">"role"</span>: <span class="st">"system"</span>, <span class="st">"content"</span>: PROMPT}],', d:650},
          {c:'        response_format={<span class="st">"type"</span>: <span class="st">"json_object"</span>}', d:740},
          {c:'    )', d:830},
          {c:'    <span class="kw">return</span> json.<span class="fn">loads</span>(response.choices[<span class="nm">0</span>].message.content)', d:900},
        ],
        output: [
          {t:'✓  OpenAI GPT-4o client ready', c:'lc-out-success', d:1100},
          {t:'INFO     Analyzing resume...', c:'lc-out-info', d:1400},
          {t:'INFO     Score: 87/100', c:'lc-out-info', d:2000},
          {t:'✓  ATS keywords: 12 matched', c:'lc-out-success', d:2400},
          {t:'✓  Feedback generated (342 tokens)', c:'lc-out-success', d:2800},
        ]
      }
    };

    var currentFile = 'main.py';
    var animTimeout = [];

    function clearTimeouts(){ animTimeout.forEach(clearTimeout); animTimeout = []; }

    function renderFile(filename){
      var data = files[filename];
      if(!data) return;
      linesEl.innerHTML = '';
      if(outEl) outEl.innerHTML = '';

      data.lines.forEach(function(line, i){
        var t = setTimeout(function(){
          var div = document.createElement('div');
          div.className = 'lc-line';
          div.innerHTML = '<span class="lc-num">'+(i+1)+'</span><span class="lc-code">'+line.c+'</span>';
          div.style.animationDelay = '0s';
          linesEl.appendChild(div);
          // Add cursor to last line
          if(i === data.lines.length - 1){
            div.innerHTML += '<span class="lc-cursor-line"></span>';
          }
        }, line.d);
        animTimeout.push(t);
      });

      if(outEl){
        data.output.forEach(function(out){
          var t = setTimeout(function(){
            var p = document.createElement('div');
            p.className = 'lc-out-line ' + out.c;
            p.textContent = out.t;
            outEl.appendChild(p);
          }, out.d);
          animTimeout.push(t);
        });
      }
    }

    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        tabs.forEach(function(t){ t.classList.remove('active'); });
        tab.classList.add('active');
        clearTimeouts();
        renderFile(tab.dataset.file);
      });
    });

    // Auto-start when visible
    var lcObs = new IntersectionObserver(function(e){
      if(e[0].isIntersecting){ renderFile(currentFile); lcObs.disconnect(); }
    }, {threshold: 0.3});
    lcObs.observe(linesEl);
  })();

  /* ══════════════════════════════════════
     RADAR CHART
  ══════════════════════════════════════ */
  (function(){
    var canvas = document.getElementById('radar-canvas');
    if(!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    var cx = W/2, cy = H/2;

    var skills = [
      {name:'Python',      pct:88, color:'#6366f1'},
      {name:'FastAPI',     pct:85, color:'#ec4899'},
      {name:'PostgreSQL',  pct:80, color:'#06b6d4'},
      {name:'Docker',      pct:75, color:'#f59e0b'},
      {name:'JavaScript',  pct:70, color:'#10b981'},
      {name:'AI / ML',     pct:45, color:'#8b5cf6'},
      {name:'Redis',       pct:80, color:'#ef4444'},
      {name:'System Design',pct:65, color:'#f97316'},
    ];

    var n = skills.length;
    var R = 170;
    var levels = 5;
    var hovered = -1;
    var animPct = 0;

    // Render legend
    var legendEl = document.getElementById('radar-legend-list');
    if(legendEl){
      skills.forEach(function(s, i){
        var item = document.createElement('div');
        item.className = 'radar-legend-item';
        item.innerHTML = '<div class="radar-legend-left"><div class="radar-legend-dot" style="background:'+s.color+'"></div><div><div class="radar-legend-name">'+s.name+'</div><div class="radar-legend-bar"><div class="radar-legend-fill" style="background:'+s.color+';width:0%" data-w="'+s.pct+'"></div></div></div></div><span class="radar-legend-pct">'+s.pct+'%</span>';
        legendEl.appendChild(item);

        item.addEventListener('mouseenter', function(){ hovered = i; });
        item.addEventListener('mouseleave', function(){ hovered = -1; });
      });

      // Animate bars
      var lObs = new IntersectionObserver(function(e){
        if(e[0].isIntersecting){
          legendEl.querySelectorAll('.radar-legend-fill').forEach(function(f){
            setTimeout(function(){ f.style.width = f.dataset.w + '%'; }, 300);
          });
          lObs.disconnect();
        }
      }, {threshold:0.3});
      lObs.observe(legendEl);
    }

    function getPoint(i, pct){
      var angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      var r = R * (pct / 100);
      return {x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle)};
    }

    function getLabelPoint(i){
      var angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      var r = R + 28;
      return {x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle)};
    }

    function draw(){
      ctx.clearRect(0, 0, W, H);

      // Grid levels
      for(var l = 1; l <= levels; l++){
        ctx.beginPath();
        for(var i = 0; i <= n; i++){
          var angle = (i / n) * Math.PI * 2 - Math.PI / 2;
          var r = R * (l / levels);
          var x = cx + r * Math.cos(angle);
          var y = cy + r * Math.sin(angle);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = l === levels ? 'rgba(99,102,241,.25)' : 'rgba(255,255,255,.05)';
        ctx.lineWidth = l === levels ? 1.5 : 1;
        ctx.stroke();
      }

      // Spokes
      for(var i = 0; i < n; i++){
        var angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
        ctx.strokeStyle = 'rgba(255,255,255,.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Skill polygon (animated)
      ctx.beginPath();
      skills.forEach(function(s, i){
        var p = getPoint(i, s.pct * animPct);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      grad.addColorStop(0, 'rgba(99,102,241,.35)');
      grad.addColorStop(1, 'rgba(139,92,246,.08)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(99,102,241,.8)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dots
      skills.forEach(function(s, i){
        var p = getPoint(i, s.pct * animPct);
        var isHov = hovered === i;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isHov ? 8 : 5, 0, Math.PI*2);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = isHov ? 16 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        if(isHov){
          ctx.fillStyle = 'rgba(5,5,16,.85)';
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 1.5;
          var lp = getLabelPoint(i);
          var bw = 90, bh = 30;
          var bx = lp.x - bw/2, by = lp.y - 40;
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, bh, 6);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = s.color;
          ctx.font = 'bold 11px Inter';
          ctx.textAlign = 'center';
          ctx.fillText(s.name + ': ' + s.pct + '%', lp.x, by + 19);
        }
      });

      // Labels
      ctx.shadowBlur = 0;
      skills.forEach(function(s, i){
        var lp = getLabelPoint(i);
        ctx.font = hovered === i ? 'bold 12px Inter' : '11px Inter';
        ctx.fillStyle = hovered === i ? s.color : 'rgba(241,245,249,.7)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.name, lp.x, lp.y);
      });
    }

    // Canvas hover detection
    canvas.addEventListener('mousemove', function(e){
      var rect = canvas.getBoundingClientRect();
      var mx = (e.clientX - rect.left) * (W / rect.width);
      var my = (e.clientY - rect.top) * (H / rect.height);
      hovered = -1;
      skills.forEach(function(s, i){
        var p = getPoint(i, s.pct);
        var dx = mx - p.x, dy = my - p.y;
        if(Math.sqrt(dx*dx + dy*dy) < 12) hovered = i;
      });
    });
    canvas.addEventListener('mouseleave', function(){ hovered = -1; });

    // Animation entrance
    var radarObs = new IntersectionObserver(function(e){
      if(e[0].isIntersecting){
        var start = null;
        function anim(ts){
          if(!start) start = ts;
          animPct = Math.min((ts - start) / 1200, 1);
          draw();
          if(animPct < 1) requestAnimationFrame(anim);
          else{ animPct = 1; loop(); }
        }
        requestAnimationFrame(anim);
        radarObs.disconnect();
      }
    }, {threshold: 0.3});
    radarObs.observe(canvas);

    function loop(){ draw(); requestAnimationFrame(loop); }
  })();

  /* ══════════════════════════════════════
     CLI INTERACTIVE TERMINAL
  ══════════════════════════════════════ */
  (function(){
    var body  = document.getElementById('cli-body');
    var input = document.getElementById('cli-input');
    if(!body || !input) return;

    var history = [];
    var histIdx = -1;

    var commands = {
      help: function(){
        return [
          {t:'Available commands:', c:'hl'},
          {t:'  about          — Who is Atif?', c:''},
          {t:'  skills         — Tech stack & proficiency', c:''},
          {t:'  projects       — Live & building projects', c:''},
          {t:'  experience     — Journey & achievements', c:''},
          {t:'  contact        — Get in touch', c:''},
          {t:'  hire           — Availability & info', c:''},
          {t:'  github         — GitHub stats', c:''},
          {t:'  education      — University & learning', c:''},
          {t:'  goals          — Future plans', c:''},
          {t:'  clear          — Clear terminal', c:''},
          {t:'  whoami         — Quick intro', c:''},
          {t:'  ls             — List sections', c:''},
          {t:'  open projects  — Go to projects section', c:''},
        ];
      },
      whoami: function(){
        return [
          {t:'Atif Bashir — Backend Developer & AI/ML Enthusiast', c:'hl'},
          {t:'Location: Jammu & Kashmir, India', c:''},
          {t:'Stack:    Python · FastAPI · PostgreSQL · Redis · Docker', c:''},
          {t:'Status:   Open to work — Full-time / Freelance / Internship', c:'gn'},
        ];
      },
      about: function(){
        return [
          {t:'== ABOUT ATIF BASHIR ==', c:'hl'},
          {t:'Passionate tech student & Backend Developer from Jammu & Kashmir, India.', c:''},
          {t:'Specializes in Python & FastAPI — building scalable, secure REST APIs.', c:''},
          {t:'AI/ML enthusiast on the path of becoming a Machine Learning Engineer.', c:''},
          {t:'Believes in learning by doing — every project is a step forward.', c:''},
        ];
      },
      skills: function(){
        return [
          {t:'== TECH STACK ==', c:'hl'},
          {t:'Python           ████████████████████  88%', c:''},
          {t:'FastAPI          ███████████████████░  85%', c:''},
          {t:'PostgreSQL       ████████████████░░░░  80%', c:''},
          {t:'Redis            ████████████████░░░░  80%', c:''},
          {t:'Docker           ███████████████░░░░░  75%', c:''},
          {t:'JavaScript       ██████████████░░░░░░  70%', c:''},
          {t:'AI / ML          █████████░░░░░░░░░░░  45% (learning)', c:'pk'},
        ];
      },
      projects: function(){
        return [
          {t:'== PROJECTS ==', c:'hl'},
          {t:'[LIVE] AI Resume Analyzer', c:'gn'},
          {t:'       Stack: FastAPI + PostgreSQL + Redis + Docker + Vercel', c:''},
          {t:'       URL: ai-resume-builder-atibashir-jus-projects.vercel.app', c:''},
          {t:'', c:''},
          {t:'[BUILDING] AI Code Review Bot', c:'yw'},
          {t:'           Stack: FastAPI + OpenAI GPT-4 + GitHub API + Docker', c:''},
          {t:'           GitHub: github.com/atifbashir-ju', c:''},
        ];
      },
      contact: function(){
        return [
          {t:'== CONTACT ==', c:'hl'},
          {t:'Email:     Atifparay16@gmail.com', c:''},
          {t:'Phone:     +91 9103250056', c:''},
          {t:'GitHub:    github.com/atifbashir-ju', c:''},
          {t:'LinkedIn:  linkedin.com/in/atif-bashir-350488397', c:''},
          {t:'Instagram: @iamatif_bashir', c:''},
        ];
      },
      hire: function(){
        return [
          {t:'== HIRE ATIF ==', c:'hl'},
          {t:'Status:     AVAILABLE NOW', c:'gn'},
          {t:'Open to:    Full-time · Freelance · Internship', c:''},
          {t:'Available:  Immediately', c:''},
          {t:'Work type:  Remote / On-site / Hybrid', c:''},
          {t:'Response:   < 24 hours', c:'gn'},
          {t:'', c:''},
          {t:'Email: Atifparay16@gmail.com', c:'pk'},
        ];
      },
      github: function(){
        return [
          {t:'== GITHUB: @atifbashir-ju ==', c:'hl'},
          {t:'Profile:  github.com/atifbashir-ju', c:''},
          {t:'Repos:    5+ public repositories', c:''},
          {t:'Top Lang: Python', c:''},
          {t:'', c:''},
          {t:'Run: curl https://api.github.com/users/atifbashir-ju', c:''},
        ];
      },
      education: function(){
        return [
          {t:'== EDUCATION ==', c:'hl'},
          {t:'University: University of Jammu, J&K, India', c:''},
          {t:'Degree:     Computer Science (B.Tech)', c:''},
          {t:'', c:''},
          {t:'Certifications:', c:'hl'},
          {t:'[2026] National Hackathon — TOP 3 (Univ. of Jammu)', c:'gn'},
          {t:'[2026] AI Tools Workshop (be10x)', c:''},
          {t:'[2026] Python Using AI Workshop (AI For Techies)', c:''},
        ];
      },
      goals: function(){
        return [
          {t:'== GOALS & FUTURE PLANS ==', c:'hl'},
          {t:'Short-term: Master Machine Learning & model deployment', c:''},
          {t:'Mid-term:   Land ML Engineer / Backend Engineer role', c:''},
          {t:'Long-term:  Build AI-powered products that make real impact', c:''},
          {t:'', c:''},
          {t:'Currently learning: scikit-learn · neural networks · AWS · GCP', c:'pk'},
        ];
      },
      experience: function(){
        return [
          {t:'== JOURNEY ==', c:'hl'},
          {t:'[2024] Started programming — C, C++, Python basics', c:''},
          {t:'[2025] Built AI Resume Analyzer (LIVE on Vercel)', c:'gn'},
          {t:'[2025] Building AI Code Review Bot (FastAPI + GPT-4)', c:'yw'},
          {t:'[2026] Won National Hackathon — Top 3 Position', c:'gn'},
          {t:'[2026] Completed 3 AI/ML certifications', c:''},
          {t:'[NOW]  Actively learning ML & seeking opportunities', c:'pk'},
        ];
      },
      ls: function(){
        return [
          {t:'./portfolio/', c:'hl'},
          {t:'├── about/', c:''},
          {t:'├── projects/', c:''},
          {t:'│   ├── ai-resume-analyzer  [LIVE]', c:'gn'},
          {t:'│   └── ai-code-review-bot  [BUILDING]', c:'yw'},
          {t:'├── skills/', c:''},
          {t:'├── journey/', c:''},
          {t:'├── github/', c:''},
          {t:'└── contact/', c:''},
        ];
      },
    };

    function addLine(type, content){
      var div = document.createElement('div');
      div.className = 'cli-line';
      if(type === 'cmd'){
        div.innerHTML = '<span class="cli-cmd-line"><span class="cli-p">atif@portfolio:~$</span> <span class="cli-c">'+escHtml(content)+'</span></span>';
      } else if(type === 'sep'){
        div.innerHTML = '<hr class="cli-sep"/>';
      } else {
        var cls = content.c === 'hl' ? 'hl' : content.c === 'gn' ? 'gn' : content.c === 'pk' ? 'pk' : content.c === 'yw' ? 'yw' : '';
        div.innerHTML = '<div class="cli-out"><span class="'+ cls +'">'+escHtml(content.t)+'</span></div>';
      }
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function escHtml(s){
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function runCommand(cmd){
      cmd = cmd.trim().toLowerCase();
      if(!cmd) return;
      addLine('cmd', cmd);
      history.unshift(cmd);
      histIdx = -1;

      if(cmd === 'clear'){
        body.innerHTML = ''; return;
      }
      if(cmd.startsWith('open ')){
        var target = cmd.split(' ')[1];
        var el = document.getElementById(target);
        if(el){ el.scrollIntoView({behavior:'smooth'}); addLine('out', {t:'→ Navigating to #'+target, c:'gn'}); }
        else { addLine('out', {t:'Section "'+target+'" not found. Try: open projects', c:'pk'}); }
        return;
      }

      var fn = commands[cmd.split(' ')[0]];
      if(fn){
        addLine('sep', '');
        fn().forEach(function(line){ addLine('out', line); });
        addLine('sep', '');
      } else {
        addLine('out', {t:'Command not found: "'+cmd+'". Type help for commands.', c:'pk'});
      }
    }

    input.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){
        runCommand(input.value);
        input.value = '';
      } else if(e.key === 'ArrowUp'){
        e.preventDefault();
        if(histIdx < history.length-1){ histIdx++; input.value = history[histIdx]; }
      } else if(e.key === 'ArrowDown'){
        e.preventDefault();
        if(histIdx > 0){ histIdx--; input.value = history[histIdx]; }
        else { histIdx = -1; input.value = ''; }
      } else if(e.key === 'Tab'){
        e.preventDefault();
        var partial = input.value.toLowerCase();
        var match = Object.keys(commands).find(function(k){ return k.startsWith(partial); });
        if(match) input.value = match;
      }
    });

    // Focus on click anywhere in terminal
    document.querySelector('.cli-wrap') && document.querySelector('.cli-wrap').addEventListener('click', function(){
      input.focus();
    });

    // Auto-run welcome
    setTimeout(function(){
      addLine('cmd', 'help');
      commands.help().forEach(function(l){ addLine('out', l); });
    }, 500);
  })();


  /* ══ ESC KEY ══ */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeResumeModal();
      closeHireModal();
      if (chatIsOpen) toggleChat();
      if (mobMenu && mobMenu.classList.contains('open')) {
        mobMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

}); // END DOMContentLoaded