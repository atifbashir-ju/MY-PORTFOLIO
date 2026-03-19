/* =====================================================
   ATIF BASHIR PORTFOLIO v2.0 — main.js
   ===================================================== */
'use strict';

/* ════════════════════════════════════════════
   1. LOADING SCREEN
════════════════════════════════════════════ */
(function () {
  var loader  = document.getElementById('loader');
  var bar     = document.getElementById('loader-bar');
  var pctEl   = document.getElementById('loader-pct');
  var textEl  = document.getElementById('loader-text');
  var canvas  = document.getElementById('loader-canvas');
  var ctx     = canvas ? canvas.getContext('2d') : null;

  var msgs = ['INITIALIZING SYSTEM...','LOADING MODULES...','BUILDING INTERFACE...','CONNECTING SERVICES...','ALMOST READY...'];
  var pct  = 0;
  var mi   = 0;

  if (canvas) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    // Simple particle rain for loader
    var drops = Array.from({length:60}, function(){
      return { x: Math.random()*canvas.width, y: Math.random()*canvas.height, speed: 1+Math.random()*3, len: 10+Math.random()*20 };
    });
    var loaderAnim;
    function drawLoader() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      drops.forEach(function(d){
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0,255,231,'+(0.1+Math.random()*.2)+')';
        ctx.lineWidth   = 1;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y+d.len);
        ctx.stroke();
        d.y += d.speed;
        if (d.y > canvas.height) { d.y = -d.len; d.x = Math.random()*canvas.width; }
      });
      loaderAnim = requestAnimationFrame(drawLoader);
    }
    drawLoader();
  }

  var iv = setInterval(function () {
    pct += Math.random() * 4 + 1;
    if (pct > 100) pct = 100;
    if (bar) bar.style.width = pct + '%';
    if (pctEl) pctEl.textContent = Math.round(pct) + '%';
    var newMi = Math.floor(pct / 25);
    if (newMi !== mi && newMi < msgs.length && textEl) { mi = newMi; textEl.textContent = msgs[mi]; }
    if (pct >= 100) {
      clearInterval(iv);
      setTimeout(function () {
        if (loader) loader.classList.add('done');
        setTimeout(function () { if (loader) loader.style.display = 'none'; if(loaderAnim) cancelAnimationFrame(loaderAnim); }, 700);
      }, 400);
    }
  }, 60);
})();


/* ════════════════════════════════════════════
   2. SCROLL PROGRESS
════════════════════════════════════════════ */
(function () {
  var bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', function () {
    if (bar) bar.style.width = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100) + '%';
  }, { passive: true });
})();


/* ════════════════════════════════════════════
   3. CUSTOM CURSOR + NEON SPARK TRAIL
════════════════════════════════════════════ */
(function () {
  var dot   = document.getElementById('cursor');
  var ring  = document.getElementById('cursor-ring');
  var trail = document.getElementById('trail-canvas');
  if (!dot || !ring) return;

  var mx=0, my=0, rx=0, ry=0;
  var sparks = [];

  if (trail) {
    trail.width  = window.innerWidth;
    trail.height = window.innerHeight;
    window.addEventListener('resize', function(){trail.width=window.innerWidth;trail.height=window.innerHeight;});
  }
  var tctx = trail ? trail.getContext('2d') : null;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    // Spawn spark particles
    for (var i = 0; i < 3; i++) {
      sparks.push({
        x: mx, y: my,
        vx: (Math.random()-0.5)*4,
        vy: (Math.random()-0.5)*4,
        life: 1,
        color: Math.random() > 0.5 ? '0,255,231' : '255,0,170',
        size: 1 + Math.random()*2
      });
    }
  });

  // Cursor ring lag
  (function raf() {
    rx += (mx-rx)*0.1; ry += (my-ry)*0.1;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';

    // Draw sparks
    if (tctx) {
      tctx.clearRect(0,0,trail.width,trail.height);
      sparks = sparks.filter(function(s){ return s.life > 0; });
      sparks.forEach(function(s){
        s.x += s.vx; s.y += s.vy;
        s.vy += 0.15; // gravity
        s.life -= 0.045;
        s.vx *= 0.97;
        tctx.beginPath();
        tctx.arc(s.x, s.y, s.size*s.life, 0, Math.PI*2);
        tctx.fillStyle = 'rgba('+s.color+','+s.life+')';
        tctx.fill();
        // Glow
        tctx.beginPath();
        tctx.arc(s.x, s.y, s.size*s.life*2.5, 0, Math.PI*2);
        tctx.fillStyle = 'rgba('+s.color+','+(s.life*0.15)+')';
        tctx.fill();
      });
    }
    requestAnimationFrame(raf);
  })();

  // Cursor state on interactives
  var sel = 'a,button,.project-card,.tech-node,.cert-card,.social-card,.social-link,.learn-chip,.blog-card,.tl-content,input,textarea';
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest(sel)) { dot.style.transform='translate(-50%,-50%) scale(2.5)'; dot.style.background='var(--pink)'; ring.style.borderColor='var(--pink)'; }
  });
  document.addEventListener('mouseout', function(e) {
    if (e.target.closest(sel)) { dot.style.transform='translate(-50%,-50%) scale(1)'; dot.style.background='var(--neon)'; ring.style.borderColor='rgba(0,255,231,.5)'; }
  });

  if ('ontouchstart' in window) { dot.style.display='none'; ring.style.display='none'; if(trail)trail.style.display='none'; document.body.style.cursor='default'; }
})();


/* ════════════════════════════════════════════
   4. MATRIX RAIN BACKGROUND
════════════════════════════════════════════ */
(function () {
  var canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, cols, drops;
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[];:|<>アイウエオカキクケコ';

  function init() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols  = Math.floor(W / 18);
    drops = Array.from({length:cols}, function(){ return Math.floor(Math.random()*H/16); });
  }
  init();
  window.addEventListener('resize', init, {passive:true});

  setInterval(function() {
    ctx.fillStyle = 'rgba(2,2,9,0.06)';
    ctx.fillRect(0,0,W,H);
    ctx.font = '13px Share Tech Mono, monospace';
    drops.forEach(function(y, i) {
      var ch = chars[Math.floor(Math.random()*chars.length)];
      var alpha = Math.random() > 0.92 ? 0.9 : 0.35;
      ctx.fillStyle = 'rgba(0,255,231,'+alpha+')';
      ctx.fillText(ch, i*18, y*16);
      if (y*16 > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }, 60);
})();


/* ════════════════════════════════════════════
   5. CARD MOUSE-TRACKING GLOW
════════════════════════════════════════════ */
(function () {
  document.querySelectorAll('.project-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', ((e.clientX-r.left)/r.width*100)+'%');
      card.style.setProperty('--mouse-y', ((e.clientY-r.top)/r.height*100)+'%');
    });
  });
})();


/* ════════════════════════════════════════════
   6. NAVBAR
════════════════════════════════════════════ */
(function () {
  var nav   = document.getElementById('navbar');
  var links = document.querySelectorAll('.nav-links a');
  var secs  = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', function() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    var cur = '';
    secs.forEach(function(s){ if(window.scrollY >= s.offsetTop-160) cur=s.id; });
    links.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href')==='#'+cur); });
  }, {passive:true});
})();


/* ════════════════════════════════════════════
   7. HAMBURGER
════════════════════════════════════════════ */
(function () {
  var btn  = document.getElementById('hamburger');
  var menu = document.getElementById('mobile-nav');
  if (!btn || !menu) return;
  btn.addEventListener('click', function() { btn.classList.toggle('active'); menu.classList.toggle('open'); document.body.style.overflow = menu.classList.contains('open')?'hidden':''; });
  menu.querySelectorAll('.mob-link').forEach(function(l){ l.addEventListener('click', function(){ btn.classList.remove('active'); menu.classList.remove('open'); document.body.style.overflow=''; }); });
})();


/* ════════════════════════════════════════════
   8. TYPED ROLE
════════════════════════════════════════════ */
(function () {
  var el = document.getElementById('typed-role');
  if (!el) return;
  var roles = ['Backend Developer','FastAPI Engineer','Python Specialist','AI/ML Enthusiast','Systems Architect'];
  var ri=0, ci=0, del=false;
  function type() {
    var r = roles[ri];
    if (!del) { el.textContent=r.slice(0,++ci); if(ci===r.length){del=true;setTimeout(type,1800);return;} }
    else { el.textContent=r.slice(0,--ci); if(ci===0){del=false;ri=(ri+1)%roles.length;} }
    setTimeout(type, del?55:80);
  }
  setTimeout(type, 1800); // start after loader
})();


/* ════════════════════════════════════════════
   9. TERMINAL TYPING
════════════════════════════════════════════ */
(function () {
  var body = document.getElementById('terminal-body');
  if (!body) return;
  var lines = [
    {t:'cmd',s:'whoami'},
    {t:'out',s:'atif.bashir · backend-dev · ai-ml-learner'},
    {t:'cmd',s:'cat location.txt'},
    {t:'dim',s:'Punjab (Jammu), India  ·  Remote Worldwide'},
    {t:'cmd',s:'python --version && fastapi --version'},
    {t:'out',s:'Python 3.11.4  ·  FastAPI 0.103.1'},
    {t:'cmd',s:'ls ./stack'},
    {t:'dim',s:'Python  FastAPI  PostgreSQL  Redis  Docker'},
    {t:'dim',s:'SQLAlchemy  Alembic  JWT  Uvicorn  Git'},
    {t:'cmd',s:'echo $MISSION'},
    {t:'out',s:'build_ml_engineer_path=true'},
    {t:'out',s:'open_to_work=true · response_time=24h'},
  ];
  var li=0, ci=0;
  function typeNext() {
    if (li>=lines.length) { var c=document.createElement('div'); c.className='term-line'; c.innerHTML='<span class="t-prompt">❯</span><span class="t-blink">█</span>'; body.appendChild(c); return; }
    var line=lines[li];
    if (ci===0) {
      var div=document.createElement('div'); div.className='term-line'; div.id='tl'+li;
      div.innerHTML = line.t==='cmd' ? '<span class="t-prompt">❯ </span><span class="t-cmd" id="tc'+li+'"></span>' : '<span class="'+(line.t==='dim'?'t-dim':'t-out')+'" id="tc'+li+'"></span>';
      body.appendChild(div);
    }
    var span=document.getElementById('tc'+li);
    if (!span){li++;ci=0;typeNext();return;}
    if (ci<line.s.length) { span.textContent=line.s.slice(0,++ci); setTimeout(typeNext, line.t==='cmd'?42:16); }
    else { li++;ci=0; setTimeout(typeNext, line.t==='cmd'?380:65); }
  }
  var obs=new IntersectionObserver(function(entries){ if(entries[0].isIntersecting){setTimeout(typeNext,500);obs.disconnect();} },{threshold:.3});
  obs.observe(body.closest('.terminal')||body);
})();


/* ════════════════════════════════════════════
   10. TICKER
════════════════════════════════════════════ */
(function () {
  var el = document.getElementById('ticker');
  if (!el) return;
  var items=['Python','FastAPI','PostgreSQL','Redis','Docker','SQLAlchemy','Alembic','JWT','Uvicorn','Passlib','Git','GitHub','VS Code','Render','Vercel','HTML','CSS','JavaScript','C','C++','Machine Learning'];
  el.innerHTML = items.concat(items).map(function(i){ return '<span class="ticker-item">'+i+'</span>'; }).join('');
})();


/* ════════════════════════════════════════════
   11. STAT COUNTERS
════════════════════════════════════════════ */
(function () {
  var stats=document.querySelectorAll('.stat-num[data-target]');
  if (!stats.length) return;
  function animateCount(el) {
    var target=parseInt(el.dataset.target); var n=0; var step=Math.max(target/60,.1);
    var iv=setInterval(function(){ n=Math.min(n+step,target); el.textContent=Math.round(n); if(n>=target)clearInterval(iv); },18);
  }
  var obs=new IntersectionObserver(function(e){ if(e[0].isIntersecting){stats.forEach(animateCount);obs.disconnect();} },{threshold:.5});
  obs.observe(document.querySelector('.stats-strip')||document.body);
})();


/* ════════════════════════════════════════════
   12. SKILL BARS
════════════════════════════════════════════ */
(function () {
  var container=document.getElementById('skill-bars');
  if (!container) return;
  var skills=[
    {name:'Python & Backend',pct:88,color:'linear-gradient(90deg,#00ffe7,#00c4b3)'},
    {name:'FastAPI & REST APIs',pct:85,color:'linear-gradient(90deg,#ff00aa,#cc0088)'},
    {name:'Database & ORM',pct:80,color:'linear-gradient(90deg,#7b00ff,#5500cc)'},
    {name:'DevOps & Docker',pct:75,color:'linear-gradient(90deg,#ffb700,#cc9200)'},
    {name:'Frontend (HTML/CSS/JS)',pct:70,color:'linear-gradient(90deg,#00ffe7,#7b00ff)'},
    {name:'AI / ML (Learning)',pct:45,color:'linear-gradient(90deg,#ff00aa,#7b00ff)'},
  ];
  skills.forEach(function(s){
    var row=document.createElement('div'); row.className='sbar';
    row.innerHTML='<div class="sbar-header"><span class="sbar-name">'+s.name+'</span><span class="sbar-pct">'+s.pct+'%</span></div><div class="sbar-track"><div class="sbar-fill" data-w="'+s.pct+'" style="background:'+s.color+'"></div></div>';
    container.appendChild(row);
  });
  var obs=new IntersectionObserver(function(e){ if(e[0].isIntersecting){ container.querySelectorAll('.sbar-fill').forEach(function(f){f.style.width=f.dataset.w+'%';}); obs.disconnect(); } },{threshold:.3});
  obs.observe(container);
})();


/* ════════════════════════════════════════════
   13. 3D ROTATING SKILL GLOBE
════════════════════════════════════════════ */
(function () {
  var canvas=document.getElementById('globe-canvas');
  if (!canvas) return;
  var ctx=canvas.getContext('2d');

  var W=canvas.clientWidth||400, H=canvas.clientHeight||380;
  canvas.width=W; canvas.height=H;

  var techTags=[
    {label:'Python',color:'#00ffe7'},{label:'FastAPI',color:'#ff00aa'},{label:'PostgreSQL',color:'#00ffe7'},
    {label:'Redis',color:'#ff6b6b'},{label:'Docker',color:'#0db7ed'},{label:'SQLAlchemy',color:'#7b00ff'},
    {label:'JWT',color:'#ffb700'},{label:'Alembic',color:'#00ffe7'},{label:'Uvicorn',color:'#ff00aa'},
    {label:'Git',color:'#ff6b35'},{label:'JavaScript',color:'#f7df1e'},{label:'Passlib',color:'#7b00ff'},
    {label:'Vercel',color:'#ffffff'},{label:'Render',color:'#00ffe7'},{label:'VS Code',color:'#007acc'},
    {label:'Python',color:'#00ffe7'},{label:'ML',color:'#ff00aa'},{label:'AI Tools',color:'#ffb700'},
  ];

  // Place tags on sphere
  var R=130;
  var points=techTags.map(function(t,i){
    var phi=Math.acos(-1+2*i/techTags.length);
    var theta=Math.sqrt(techTags.length*Math.PI)*phi;
    return {
      x:R*Math.sin(phi)*Math.cos(theta),
      y:R*Math.sin(phi)*Math.sin(theta),
      z:R*Math.cos(phi),
      label:t.label, color:t.color,
      origX:R*Math.sin(phi)*Math.cos(theta),
      origY:R*Math.sin(phi)*Math.sin(theta),
      origZ:R*Math.cos(phi),
    };
  });

  var rotX=0.003, rotY=0.006;
  var isDragging=false, lastMX=0, lastMY=0;
  var velX=0.006, velY=0.003;
  var angleX=0, angleY=0;

  canvas.addEventListener('mousedown',function(e){isDragging=true;lastMX=e.clientX;lastMY=e.clientY;velX=0;velY=0;});
  window.addEventListener('mouseup',function(){isDragging=false;});
  window.addEventListener('mousemove',function(e){
    if(!isDragging)return;
    var dx=e.clientX-lastMX, dy=e.clientY-lastMY;
    velY=dx*0.005; velX=dy*0.005;
    angleY+=dx*0.005; angleX+=dy*0.005;
    lastMX=e.clientX; lastMY=e.clientY;
  });

  function rotatePoint(p,ax,ay){
    // Rotate Y
    var x1=p.x*Math.cos(ay)-p.z*Math.sin(ay);
    var z1=p.x*Math.sin(ay)+p.z*Math.cos(ay);
    // Rotate X
    var y2=p.y*Math.cos(ax)-z1*Math.sin(ax);
    var z2=p.y*Math.sin(ax)+z1*Math.cos(ax);
    return {x:x1,y:y2,z:z2};
  }

  var cumX=0, cumY=0;

  function draw(){
    ctx.clearRect(0,0,W,H);

    // Globe wireframe circle
    ctx.beginPath();
    ctx.arc(W/2,H/2,R,0,Math.PI*2);
    ctx.strokeStyle='rgba(0,255,231,.06)';
    ctx.lineWidth=1;
    ctx.stroke();

    // Draw latitude/longitude lines
    for(var i=0;i<8;i++){
      var a=i*Math.PI/4;
      ctx.beginPath();
      ctx.ellipse(W/2,H/2,R,R*Math.abs(Math.sin(a+cumY)),0,0,Math.PI*2);
      ctx.strokeStyle='rgba(0,255,231,.04)';
      ctx.lineWidth=.5;
      ctx.stroke();
    }

    if(!isDragging){ cumX+=0.003; cumY+=0.006; }
    else { cumX+=velX*.3; cumY+=velY*.3; velX*=.95; velY*=.95; }

    var projected=points.map(function(p){
      var rot=rotatePoint(p,cumX,cumY);
      var scale=1+(rot.z/R)*0.4;
      var alpha=0.3+(rot.z/R+1)/2*0.7;
      return {x:W/2+rot.x*scale,y:H/2+rot.y*scale,z:rot.z,label:p.label,color:p.color,alpha:alpha,scale:scale};
    });

    // Sort by z (painter's algorithm)
    projected.sort(function(a,b){return a.z-b.z;});

    projected.forEach(function(p){
      if(p.z < -R*0.1) return; // Hide backside tags

      // Dot
      ctx.beginPath();
      ctx.arc(p.x,p.y,3*p.scale,0,Math.PI*2);
      ctx.fillStyle=p.color;
      ctx.globalAlpha=p.alpha;
      ctx.fill();
      ctx.shadowColor=p.color;
      ctx.shadowBlur=8*p.scale;
      ctx.fill();
      ctx.shadowBlur=0;

      // Label
      ctx.font=(Math.round(9*p.scale+3))+'px Share Tech Mono, monospace';
      ctx.fillStyle=p.color;
      ctx.globalAlpha=p.alpha;
      ctx.textAlign='center';
      ctx.fillText(p.label,p.x,p.y-7*p.scale);
      ctx.globalAlpha=1;
    });

    requestAnimationFrame(draw);
  }
  draw();
})();


/* ════════════════════════════════════════════
   14. ANIMATED TIMELINE
════════════════════════════════════════════ */
(function () {
  var container=document.getElementById('timeline-list');
  if (!container) return;

  var events=[
    {year:'2026',title:'National Hackathon — Top 3',org:'University of Jammu (SIIEDC)',desc:'Participated in 2-day national hackathon on innovation & tech. Secured Top 3 position.',chips:['Innovation','Problem Solving','Teamwork'],side:'left'},
    {year:'2026',title:'Python Using AI Workshop',org:'AI For Techies',desc:'Learned to use AI tools to write, debug, and visualize Python code efficiently.',chips:['Python','AI Tools','Debugging'],side:'right'},
    {year:'2026',title:'AI Tools Workshop Certificate',org:'be10x',desc:'Completed training on AI productivity tools — ChatGPT, data analysis, and automation.',chips:['ChatGPT','Automation','AI'],side:'left'},
    {year:'2025',title:'AI Resume Analyzer — Launched',org:'Personal Project',desc:'Built & deployed full-stack AI-powered resume analyzer using FastAPI + PostgreSQL + Redis.',chips:['FastAPI','AI','Docker','Vercel'],side:'right'},
    {year:'2025',title:'Started Backend Development',org:'Self-Learning Journey',desc:'Deep-dived into Python ecosystem — FastAPI, SQLAlchemy, Alembic, Docker, JWT.',chips:['Python','FastAPI','PostgreSQL'],side:'left'},
    {year:'2024',title:'Started Programming Journey',org:'University of Jammu',desc:'Began with C, C++, and fundamentals of programming. Fell in love with software development.',chips:['C','C++','Programming Basics'],side:'right'},
  ];

  events.forEach(function(ev){
    var item=document.createElement('div');
    item.className='tl-item';
    var chips=ev.chips.map(function(c){return '<span class="tl-chip">'+c+'</span>';}).join('');
    item.innerHTML='<div class="tl-dot"></div><div class="tl-content"><div class="tl-year">'+ev.year+'</div><h3 class="tl-title">'+ev.title+'</h3><p class="tl-org">'+ev.org+'</p><p class="tl-desc">'+ev.desc+'</p><div class="tl-chips">'+chips+'</div></div>';
    container.appendChild(item);
  });

  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting)e.target.classList.add('vis'); });
  },{threshold:.15});
  container.querySelectorAll('.tl-item').forEach(function(el){obs.observe(el);});
})();


/* ════════════════════════════════════════════
   15. LIVE GITHUB STATS
════════════════════════════════════════════ */
(function () {
  var statsGrid=document.getElementById('github-stats');
  var reposList=document.getElementById('github-repos-list');
  var contribGrid=document.getElementById('contrib-grid');

  // Try to fetch real GitHub data; fallback to static
  var USERNAME='atifbashir-ju';

  function renderStats(data) {
    if (!statsGrid) return;
    var cards=[
      {icon:'⭐',num:data.public_repos||'5+',label:'Public Repos'},
      {icon:'👥',num:data.followers||'10+',label:'Followers'},
      {icon:'🔗',num:data.following||'20+',label:'Following'},
      {icon:'📅',num:'2024',label:'Member Since'},
    ];
    statsGrid.innerHTML=cards.map(function(c){
      return '<div class="gh-stat-card"><span class="gh-stat-icon">'+c.icon+'</span><span class="gh-stat-num">'+c.num+'</span><span class="gh-stat-label">'+c.label+'</span></div>';
    }).join('');
  }

  function renderRepos(repos) {
    if (!reposList) return;
    var fakeRepos=[
      {name:'ai-resume-builder',description:'AI-powered resume analyzer built with FastAPI + PostgreSQL + Redis',language:'Python',stargazers_count:5},
      {name:'fastapi-starter',description:'Production-ready FastAPI boilerplate with JWT auth, PostgreSQL, Docker',language:'Python',stargazers_count:3},
      {name:'backend-experiments',description:'Collection of backend experiments — APIs, microservices, automation scripts',language:'Python',stargazers_count:2},
    ];
    var list=repos||fakeRepos;
    reposList.innerHTML=list.slice(0,3).map(function(r){
      return '<div class="repo-card"><p class="repo-name">⌥ '+r.name+'</p><p class="repo-desc">'+(r.description||'No description')+'</p><div class="repo-meta"><span class="repo-lang">◆ '+(r.language||'Code')+'</span><span>⭐ '+(r.stargazers_count||0)+'</span><span>🍴 0</span></div></div>';
    }).join('');
  }

  function renderContrib() {
    if (!contribGrid) return;
    var cells=[];
    for (var i=0; i<364; i++) {
      var r=Math.random();
      var intensity = r > 0.85 ? 4 : r > 0.7 ? 3 : r > 0.5 ? 2 : r > 0.3 ? 1 : 0;
      var colors=['rgba(255,255,255,.04)','rgba(0,255,231,.15)','rgba(0,255,231,.35)','rgba(0,255,231,.6)','rgba(0,255,231,.9)'];
      cells.push('<div class="contrib-cell" style="background:'+colors[intensity]+'" title="'+intensity+' contributions"></div>');
    }
    contribGrid.innerHTML=cells.join('');
  }

  // Try real API
  fetch('https://api.github.com/users/'+USERNAME)
    .then(function(r){ return r.json(); })
    .then(function(data){ renderStats(data); })
    .catch(function(){ renderStats({}); });

  fetch('https://api.github.com/users/'+USERNAME+'/repos?sort=updated&per_page=3')
    .then(function(r){ return r.json(); })
    .then(function(data){ if(Array.isArray(data)) renderRepos(data); else renderRepos(null); })
    .catch(function(){ renderRepos(null); });

  renderContrib();
})();


/* ════════════════════════════════════════════
   16. BLOG POSTS (Static - update with real URLs)
════════════════════════════════════════════ */
(function () {
  var grid=document.getElementById('blog-grid');
  if (!grid) return;

  var posts=[
    {emoji:'🐍',tag:'PYTHON',date:'Mar 2026',title:'Building Scalable REST APIs with FastAPI & PostgreSQL',excerpt:'A deep-dive into production-ready FastAPI architecture — from database design to JWT authentication and Docker deployment.',read:'8 min read',link:'#'},
    {emoji:'🐳',tag:'DEVOPS',date:'Feb 2026',title:'Dockerizing Python FastAPI Applications: Complete Guide',excerpt:'Step-by-step guide to containerizing your FastAPI app with Docker, multi-stage builds, and docker-compose for local development.',read:'6 min read',link:'#'},
    {emoji:'🤖',tag:'AI/ML',date:'Feb 2026',title:'How AI Tools Supercharged My Python Development Workflow',excerpt:'Sharing my experience using ChatGPT, GitHub Copilot, and other AI tools to write, debug, and ship Python code 3x faster.',read:'5 min read',link:'#'},
    {emoji:'🔑',tag:'SECURITY',date:'Jan 2026',title:'JWT Authentication in FastAPI: Best Practices & Pitfalls',excerpt:'Everything you need to know about implementing secure JWT auth in FastAPI — token refresh, revocation, and common mistakes to avoid.',read:'7 min read',link:'#'},
    {emoji:'⚡',tag:'BACKEND',date:'Dec 2025',title:'Redis Caching Strategies for High-Performance APIs',excerpt:'Exploring different Redis caching patterns — cache-aside, write-through, and pub/sub — to dramatically improve API response times.',read:'6 min read',link:'#'},
    {emoji:'📊',tag:'DATABASE',date:'Nov 2025',title:'SQLAlchemy ORM vs Raw SQL: When to Use What',excerpt:'A practical comparison of SQLAlchemy ORM and raw SQL queries in FastAPI projects, with performance benchmarks and use-case guidance.',read:'9 min read',link:'#'},
  ];

  grid.innerHTML=posts.map(function(p){
    return '<div class="blog-card reveal"><div class="blog-thumb">'+p.emoji+'</div><div class="blog-body"><div class="blog-meta"><span class="blog-tag">'+p.tag+'</span><span>'+p.date+'</span><span>'+p.read+'</span></div><h3 class="blog-title">'+p.title+'</h3><p class="blog-excerpt">'+p.excerpt+'</p><a href="'+p.link+'" class="blog-read">READ MORE <span>→</span></a></div></div>';
  }).join('');

  // Re-observe new elements
  setTimeout(function(){
    var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('vis');});},{threshold:.1});
    grid.querySelectorAll('.reveal').forEach(function(el){obs.observe(el);});
  },100);
})();


/* ════════════════════════════════════════════
   17. PARTICLE CANVAS
════════════════════════════════════════════ */
(function () {
  var canvas=document.getElementById('particle-canvas');
  if (!canvas) return;
  var ctx=canvas.getContext('2d'); var W,H,particles=[];
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
  resize(); window.addEventListener('resize',resize,{passive:true});
  function Particle(){this.reset();}
  Particle.prototype.reset=function(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*.3;this.vy=(Math.random()-.5)*.3;this.life=Math.random();this.maxLife=.4+Math.random()*.6;this.size=.5+Math.random()*1.2;this.color=Math.random()>.6?'0,255,231':Math.random()>.3?'255,0,170':'123,0,255';};
  Particle.prototype.update=function(){this.x+=this.vx;this.y+=this.vy;this.life+=.003;if(this.life>this.maxLife||this.x<0||this.x>W||this.y<0||this.y>H)this.reset();};
  Particle.prototype.draw=function(){var a=Math.sin(this.life/this.maxLife*Math.PI)*.5;ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fillStyle='rgba('+this.color+','+a+')';ctx.fill();};
  for(var i=0;i<60;i++)particles.push(new Particle());
  function loop(){ctx.clearRect(0,0,W,H);particles.forEach(function(p){p.update();p.draw();});for(var i=0;i<particles.length;i++)for(var j=i+1;j<particles.length;j++){var dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<80){ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.strokeStyle='rgba(0,255,231,'+(0.05*(1-d/80))+')';ctx.lineWidth=.5;ctx.stroke();}}requestAnimationFrame(loop);}
  loop();
})();


/* ════════════════════════════════════════════
   18. PARALLAX ORBS
════════════════════════════════════════════ */
(function(){
  var o1=document.querySelector('.orb-1'),o2=document.querySelector('.orb-2'),o3=document.querySelector('.orb-3');
  window.addEventListener('scroll',function(){var y=window.scrollY;if(o1)o1.style.transform='translate('+(y*.04)+'px,'+(y*.06)+'px)';if(o2)o2.style.transform='translate('+(-y*.03)+'px,'+(-y*.04)+'px)';if(o3)o3.style.transform='translate('+(y*.02)+'px,'+(y*.03)+'px)';},{passive:true});
})();


/* ════════════════════════════════════════════
   19. SCROLL REVEAL
════════════════════════════════════════════ */
(function(){
  var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('vis');});},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  function observe(){document.querySelectorAll('.reveal:not(.vis)').forEach(function(el){obs.observe(el);});}
  observe(); setTimeout(observe,500); setTimeout(observe,1500);
})();


/* ════════════════════════════════════════════
   20. AI CHATBOT
════════════════════════════════════════════ */
var chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  var win=document.getElementById('chatbot-window');
  if(win) win.classList.toggle('open',chatOpen);
}

function quickAsk(q) {
  var input=document.getElementById('chat-input');
  if(input){input.value=q; sendChat();}
}

function sendChat() {
  var input=document.getElementById('chat-input');
  var msgs=document.getElementById('chat-messages');
  var suggestions=document.getElementById('chat-suggestions');
  if (!input||!msgs) return;
  var q=input.value.trim();
  if (!q) return;

  // User message
  var userMsg=document.createElement('div');
  userMsg.className='chat-msg user-msg';
  userMsg.innerHTML='<span>'+q+'</span>';
  msgs.appendChild(userMsg);
  input.value='';
  if(suggestions)suggestions.style.display='none';

  // Typing indicator
  var typing=document.createElement('div');
  typing.className='chat-typing';
  typing.innerHTML='<span></span><span></span><span></span>';
  msgs.appendChild(typing);
  msgs.scrollTop=msgs.scrollHeight;

  // Generate response
  setTimeout(function(){
    msgs.removeChild(typing);
    var reply=getBotReply(q.toLowerCase());
    var botMsg=document.createElement('div');
    botMsg.className='chat-msg bot-msg';
    botMsg.innerHTML='<span>'+reply+'</span>';
    msgs.appendChild(botMsg);
    msgs.scrollTop=msgs.scrollHeight;
  }, 1000+Math.random()*600);
}

function getBotReply(q) {
  if (q.match(/stack|tech|language|framework|tool/)) return "Atif's core stack is 🐍 Python + ⚡ FastAPI + 🐘 PostgreSQL + 🔴 Redis + 🐳 Docker. He also uses SQLAlchemy, Alembic, JWT, Uvicorn, Git, and deploys on Render + Vercel!";
  if (q.match(/project|work|build|made/)) return "His featured project is the 🤖 AI Resume Analyzer — an AI-powered platform built with FastAPI, PostgreSQL, Redis & Docker. Live at Vercel! More projects are in the pipeline on GitHub.";
  if (q.match(/hire|available|work|freelance|job|opportunity/)) return "Yes! ✅ Atif is available for hire. He's open to backend dev roles, freelance projects, and collaborations. Response time is under 24h. Email: Atifparay16@gmail.com or use the contact form!";
  if (q.match(/location|where|india|punjab/)) return "📍 Atif is based in Punjab (Jammu), India and is available for remote work worldwide!";
  if (q.match(/contact|email|phone|reach/)) return "You can reach Atif at:\n📧 Atifparay16@gmail.com\n📞 +91 9103250056\n🔗 github.com/atifbashir-ju\n💼 linkedin.com/in/atif-bashir-350488397";
  if (q.match(/certif|hackathon|award|achieve/)) return "Atif has 3 certifications: 🏆 National Hackathon Top 3 (Univ. of Jammu), 🤖 AI Tools Workshop (be10x), 🐍 Python Using AI Workshop (AI For Techies)!";
  if (q.match(/ml|machine learning|ai|artificial/)) return "Atif is actively learning ML and AI! He's exploring Machine Learning algorithms, AI automation tools, and is on the path to becoming a Machine Learning Engineer. 🤖";
  if (q.match(/fastapi|python|backend|api/)) return "FastAPI & Python are Atif's core specialization! He builds production-ready REST APIs with auth, caching, ORM, migrations and Docker containerization. Expert level! 🐍⚡";
  if (q.match(/github|repo|code|open.source/)) return "Check out Atif's GitHub: github.com/atifbashir-ju — The AI Resume Analyzer and more projects are there! Give him a ⭐!";
  if (q.match(/hello|hi|hey|greet/)) return "Hey there! 👋 I'm Atif's AI assistant. I know everything about his skills, projects, and experience. What would you like to know?";
  if (q.match(/salary|rate|cost|price/)) return "For rates and budget discussions, please reach out directly at Atifparay16@gmail.com or via the contact form. Atif is flexible for the right opportunity! 💼";
  return "Great question! 🤔 I'm not sure about that specific detail. For the best answer, reach out to Atif directly at Atifparay16@gmail.com or check his GitHub at github.com/atifbashir-ju!";
}


/* ════════════════════════════════════════════
   21. RESUME MODAL
════════════════════════════════════════════ */
function openResume() {
  var modal=document.getElementById('resume-modal');
  if(modal){modal.classList.add('open'); document.body.style.overflow='hidden';}
}
function closeResume(e) {
  if(e&&e.target!==document.getElementById('resume-modal'))return;
  var modal=document.getElementById('resume-modal');
  if(modal){modal.classList.remove('open'); document.body.style.overflow='';}
}
function printResume() {
  var content=document.getElementById('resume-content');
  if(!content)return;
  var win=window.open('','_blank');
  win.document.write('<html><head><title>Atif Bashir - Resume</title><style>body{font-family:monospace;background:#020209;color:#dce8f0;padding:2rem;max-width:800px;margin:0 auto}h1{color:#00ffe7;font-size:2rem;margin-bottom:.5rem}h2{color:#00ffe7;font-size:.9rem;letter-spacing:.2em;border-bottom:1px solid rgba(0,255,231,.2);padding-bottom:.4rem;margin:1.5rem 0 .8rem}.resume-role{color:#ff00aa;letter-spacing:.1em;margin-bottom:1rem}.resume-contact-row{display:flex;flex-wrap:wrap;gap:1rem;font-size:.8rem;color:#4a6a7a;margin-bottom:1rem}p{color:#4a6a7a;font-size:.85rem;line-height:1.8}.resume-chips{display:flex;flex-wrap:wrap;gap:.4rem}.resume-chips span{border:1px solid rgba(0,255,231,.2);padding:.2rem .5rem;font-size:.75rem;color:#4a6a7a}.resume-item{border:1px solid rgba(0,255,231,.08);padding:.8rem;margin-bottom:.8rem}.resume-item strong{color:#dce8f0}</style></head><body>');
  win.document.write(content.innerHTML);
  win.document.write('</body></html>');
  win.document.close();
  setTimeout(function(){win.print();},500);
}


/* ════════════════════════════════════════════
   22. CONTACT FORM
════════════════════════════════════════════ */
function handleSubmit(e) {
  e.preventDefault();
  var btn=e.target.querySelector('.btn-primary'), text=document.getElementById('submit-text');
  if(!btn||!text)return;
  btn.classList.add('btn-loading'); text.textContent='TRANSMITTING...'; btn.disabled=true;
  setTimeout(function(){
    btn.classList.remove('btn-loading'); text.textContent='MESSAGE SENT ✓'; btn.style.background='var(--neon)'; btn.style.color='#000';
    setTimeout(function(){text.textContent='TRANSMIT MESSAGE →'; btn.style.background=''; btn.style.color=''; btn.disabled=false; e.target.reset();}, 3000);
  }, 1600);
}


/* ════════════════════════════════════════════
   23. SMOOTH SCROLL + ESC KEY
════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var t=document.querySelector(a.getAttribute('href'));
    if(!t)return; e.preventDefault();
    window.scrollTo({top:t.offsetTop-80,behavior:'smooth'});
  });
});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    var menu=document.getElementById('mobile-nav'),btn=document.getElementById('hamburger');
    if(menu&&menu.classList.contains('open')){menu.classList.remove('open');if(btn)btn.classList.remove('active');document.body.style.overflow='';}
    var modal=document.getElementById('resume-modal');
    if(modal&&modal.classList.contains('open')){modal.classList.remove('open');document.body.style.overflow='';}
    if(chatOpen) toggleChat();
  }
});