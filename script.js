(function(){
  // ---------- Utilities ----------
  const $ = sel => document.querySelector(sel);
  const isIOS = () => {
    const ua = navigator.userAgent || "";
    const iOSDevice = /iPad|iPhone|iPod/.test(ua);
    const iPadOS13Plus = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    return iOSDevice || iPadOS13Plus;
  };
  const DEV = new URLSearchParams(location.search).get('dev') === '1';
  function todayKey(){
    const d = new Date();
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth()+1).padStart(2,'0');
    const day = String(d.getUTCDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  }
  function hashString(str){
    let h=2166136261>>>0;
    for (let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h>>>0;
  }
  function fmtTime(s){ const m=Math.floor(s/60), r=s%60; return `${m}:${r.toString().padStart(2,'0')}`; }

  // ---------- Daily Data ----------
  const CHAINS = [
    ["sun","flower","pot","shot","gun"],
    ["note","book","case","work","flow"],
    ["tooth","paste","board","walk","way"],
    ["under","stand","by","pass","word"],
    ["rain","bow","leg","room","mate"],
    ["green","house","cat","fish","hook"],
    ["key","board","walk","way","point"],
    ["sea","shore","line","break","down"],
    ["foot","print","out","door","step"],
    ["door","bell","boy","friend","ship"]
  ];
  const DAILY = { date: todayKey() };
  DAILY.index = hashString(DAILY.date) % CHAINS.length;
  DAILY.chain = CHAINS[DAILY.index];

  // ---------- State ----------
  let wordIdx = 0, attemptsLeft = 6, score = 100;
  let startTime = null, timerId = null, elapsed = 0;

  // ---------- Elements ----------
  const startOverlay = $('#start-overlay');
  const playedNote = $('#played-note');
  const panel = $('#panel');
  const grid = $('#word-grid');
  const rowState = $('#row-state');
  const metaScore = $('#meta-score');
  const metaTime = $('#meta-time');
  const metaDate = $('#meta-date');
  const btnStart = $('#btn-start');
  const btnHow = $('#btn-how');
  const btnHow2 = $('#btn-how-2');
  const howModal = $('#how-modal');
  const howClose = $('#how-close');
  const btnCheck = $('#btn-check');
  const btnHint = $('#btn-hint');
  const btnCont = $('#btn-continue');
  const resultsModal = $('#results-modal');
  const resultsText = $('#results-text');
  const btnShare = $('#btn-share');
  const btnShareInline = $('#btn-share-inline');
  const btnCloseResults = $('#btn-close-results');
  const kb = $('#kb');
  const btnStats = $('#btn-stats');
  const statsModal = $('#stats-modal');
  const statsBody = $('#stats-body');
  const btnCloseStats = $('#btn-close-stats');
  const btnSignin = $('#btn-signin');
  const btnSignout = $('#btn-signout');
  const userChip = $('#user-chip');
  const toast = $('#toast');

  // ---------- Firebase (optional) ----------
  let firebaseReady=false, auth=null, db=null, user=null;
  function initFirebase(){
    try{
      const cfg = window.COMPUNDLE_FIREBASE_CONFIG;
      if (!cfg || !cfg.apiKey){ firebaseReady=false; return; }
      firebase.initializeApp(cfg);
      auth = firebase.auth();
      db = firebase.firestore();
      firebaseReady = true;

      auth.onAuthStateChanged(u => {
        user = u || null;
        if (user){
          userChip.textContent = user.displayName || user.email || "Signed in";
          userChip.classList.remove('hidden');
          btnSignout.classList.remove('hidden');
          btnSignin.classList.add('hidden');
          btnStats.classList.remove('hidden');
        } else {
          userChip.classList.add('hidden');
          btnSignout.classList.add('hidden');
          btnSignin.classList.remove('hidden');
          btnStats.classList.add('hidden');
        }
      });
    }catch(e){ firebaseReady=false; }
  }

  // ---------- Helpers ----------
  function showToast(msg, ms=1600){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'), ms);
  }
  function updateScore(){ metaScore && (metaScore.textContent = score); }
  function updateTime(){ if (!startTime || !metaTime) return; elapsed = Math.floor((Date.now() - startTime)/1000); metaTime.textContent = fmtTime(elapsed); }
  function startTimer(){ stopTimer(); startTime = Date.now(); updateTime(); timerId=setInterval(updateTime, 1000); }
  function stopTimer(){ if (timerId){ clearInterval(timerId); timerId=null; } }
  function setDateMeta(){ metaDate && (metaDate.textContent = DAILY.date); }

  function currentRow(){ return grid ? grid.children[wordIdx] : null; }
  function currentWord(){ return DAILY.chain[wordIdx].toLowerCase(); }
  function inputsOf(row){ return Array.from(row.querySelectorAll('input.letter')); }

  function focusFirstEmpty(){ if (isIOS()) return; // prevent iOS soft keyboard
    const row = currentRow(); if (!row) return;
    const inputs = inputsOf(row);
    for(const el of inputs){ if(!el.classList.contains('lock') && !el.value){ el.focus(); return; } }
    for (let i=inputs.length-1;i>=0;i--){ if(!inputs[i].classList.contains('lock')){ inputs[i].focus(); return; } }
  }
  function moveFocus(inputs, i, dir){
    let idx = i + dir;
    while (idx >= 0 && idx < inputs.length){
      const next = inputs[idx];
      if (!next.classList.contains('lock')) { if (!isIOS()) next.focus(); return; }
      idx += dir;
    }
  }

  function createRow(word, locked=false){
    const row = document.createElement('div'); row.className='word-row';
    row.style.setProperty('--cols', String(word.length));
    for(let i=0;i<word.length;i++){
      const tile = document.createElement('div'); tile.className='tile';
      const inp = document.createElement('input');
      inp.className='letter'; inp.maxLength=1; inp.autocomplete='off'; inp.spellcheck=false;

      // iOS: never show software keyboard
      if (isIOS()){
        inp.readOnly = true;
        inp.inputMode = 'none';
        inp.addEventListener('focus', e => e.currentTarget.blur(), {passive:true});
      }

      if (locked){
        inp.value = word[i].toUpperCase();
        inp.classList.add('lock');
        inp.readOnly = true; inp.tabIndex = -1;
      }
      tile.appendChild(inp); row.appendChild(tile);
    }
    return row;
  }

  function wireRowHandlers(){
    // Keep hardware keyboard support (readOnly on iOS blocks soft keyboard anyway)
    grid.querySelectorAll('.word-row').forEach(row => {
      const inputs = inputsOf(row);
      inputs.forEach((inp, i) => {
        inp.addEventListener('keydown', e => {
          const locked = inp.classList.contains('lock');
          if (e.key === ' ' || e.code === 'Space'){ e.preventDefault(); moveFocus(inputs, i, +1); return; }
          if (locked){
            if (e.key.length===1 || e.key==='Backspace' || e.key==='Delete'){ e.preventDefault(); moveFocus(inputs, i, +1); }
            return;
          }
          if (e.key === 'ArrowLeft'){ e.preventDefault(); moveFocus(inputs, i, -1); return; }
          if (e.key === 'ArrowRight'){ e.preventDefault(); moveFocus(inputs, i, +1); return; }
          if (e.key === 'Backspace'){ if (!inp.value){ moveFocus(inputs, i, -1); } return; }
          if (e.key === 'Enter'){ e.preventDefault(); checkRow(); return; }
          if (e.key.length===1 && !/^[a-zA-Z]$/.test(e.key)){ e.preventDefault(); }
        });
        inp.addEventListener('input', () => {
          const v = inp.value.replace(/[^a-z]/gi,'').toUpperCase();
          inp.value = v;
          if (v) { inp.classList.add('pop'); setTimeout(()=>inp.classList.remove('pop'), 180); moveFocus(inputs, i, +1); }
        });
      });
    });
  }

  function buildGrid(){
    if (!grid) return;
    grid.innerHTML = '';
    DAILY.chain.forEach((w,i)=> grid.appendChild(createRow(w, i===0)));
    wireRowHandlers();
    wordIdx = 1; attemptsLeft = 6; updateScore(); setDateMeta(); focusFirstEmpty();
  }

  function gradeRow(){
    const row = currentRow(); if (!row) return false;
    const inputs = inputsOf(row);
    const answer = currentWord();
    let allCorrect = true;
    inputs.forEach((inp, i)=>{
      const ch = (inp.value||'').toLowerCase();
      if (ch === answer[i]){
        inp.classList.add('lock'); inp.classList.remove('wrong'); inp.readOnly = true; inp.tabIndex=-1;
      } else {
        allCorrect = false; inp.classList.add('wrong'); inp.value='';
      }
    });
    return allCorrect;
  }

  function revealWord(){
    const row = currentRow(); if (!row) return;
    const inputs = inputsOf(row); const answer = currentWord();
    inputs.forEach((inp, i)=>{
      if (!inp.classList.contains('lock')){
        inp.value = answer[i].toUpperCase();
        inp.classList.remove('wrong');
        inp.classList.add('lock');
        inp.readOnly = true; inp.tabIndex=-1;
      }
    });
  }

  function nextWord(){
    const row = currentRow(); if (!row) return;
    const inputs = inputsOf(row); const ans = currentWord();
    if (inputs.some((inp,i)=> (inp.value||'').toLowerCase() !== ans[i])){ focusFirstEmpty(); return; }
    wordIdx++;
    if (wordIdx >= DAILY.chain.length){
      btnCheck && (btnCheck.disabled = true); btnHint && (btnHint.disabled = true);
      finishChain(); return;
    }
    attemptsLeft = 6; focusFirstEmpty();
  }

  function checkRow(){
    const row = currentRow(); if (!row) return;
    const inputs = inputsOf(row);
    if (inputs.some(inp => !inp.value && !inp.classList.contains('lock'))){ showToast('Fill all letters first'); return; }
    const ok = gradeRow();
    if (ok){
      rowState && (rowState.textContent = 'Correct!');
      score += 10; updateScore();
      nextWord();
    } else {
      attemptsLeft--; score = Math.max(0, score-5); updateScore();
      if (attemptsLeft <= 0){
        revealWord();
        btnCont && btnCont.classList.remove('hidden');
        btnCheck && (btnCheck.disabled = true); btnHint && (btnHint.disabled = true);
        rowState && (rowState.textContent = `Out of attempts. The word was “${currentWord().toUpperCase()}”.`);
      } else {
        rowState && (rowState.textContent = `Try again — ${attemptsLeft} left`);
        focusFirstEmpty();
      }
    }
  }

  function giveHint(){
    const row = currentRow(); if (!row) return;
    const inputs = inputsOf(row); const ans = currentWord();
    const remaining = inputs.filter(inp => !inp.classList.contains('lock') && !inp.value).length;
    if (remaining <= 1){ showToast('No more hints — finish the last letter.'); return; }
    for (let i=0;i<inputs.length;i++){
      const inp = inputs[i];
      if (!inp.classList.contains('lock') && !inp.value){
        inp.value = ans[i].toUpperCase();
        inp.classList.remove('wrong');
        inp.classList.add('lock');
        inp.readOnly = true; inp.tabIndex=-1;
        score = Math.max(0, score-10); updateScore();
        focusFirstEmpty();
        return;
      }
    }
  }

  function continueAfterFail(){
    wordIdx++;
    if (wordIdx >= DAILY.chain.length){ finishChain(); return; }
    attemptsLeft = 6; btnCont && btnCont.classList.add('hidden');
    btnCheck && (btnCheck.disabled=false); btnHint && (btnHint.disabled=false);
    buildGrid(); focusFirstEmpty();
  }

  function shareResults(){
    const text = `Compundle — ${DAILY.date}\\nScore: ${score}\\nTime: ${fmtTime(elapsed)}\\nhttps://compundle.com`;
    navigator.clipboard.writeText(text).then(()=>showToast('Results copied!')).catch(()=>showToast('Copy failed.'));
  }

  function finishChain(){
    try { confetti({ particleCount: 160, spread: 70, origin: { y: 0.6 } });
          setTimeout(()=>confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } }), 300);
    } catch(e){}
    score += 20; updateScore();
    stopTimer();
    resultsText && (resultsText.textContent = `Nice work! Final score: ${score} — Time: ${fmtTime(elapsed)} — ${DAILY.date}`);
    try{ resultsModal && resultsModal.showModal(); }catch(e){}
    try {
      localStorage.setItem('compundle.lastPlayed', DAILY.date);
      localStorage.setItem('compundle.lastScore', String(score));
      localStorage.setItem('compundle.lastTime', String(elapsed));
    } catch(e){}
    if (firebaseReady && user && db){
      const docId = `${user.uid}_${DAILY.date}`;
      db.collection('compundle_results').doc(docId).set({
        uid: user.uid, date: DAILY.date, score, seconds: elapsed, chainIndex: DAILY.index, at: new Date().toISOString()
      }, { merge: true }).catch(()=>{});
    }
  }

  function alreadyPlayedTodayLocal(){
    if (DEV) return false;
    try { return localStorage.getItem('compundle.lastPlayed') === DAILY.date; } catch(e){ return false; }
  }

  // ---------- Keyboard ----------
  function pressKey(k){
    if (panel && panel.classList.contains('hidden')) return;
    if (isIOS()) {
      (document.activeElement instanceof HTMLElement) && document.activeElement.blur();
    }
    const row = currentRow(); if (!row) return;
    const inputs = inputsOf(row);
    const idx = inputs.findIndex(el => el === document.activeElement);
    if (k === 'ENTER'){ checkRow(); return; }
    if (k === 'DEL'){
      if (idx >= 0){
        const cur = inputs[idx];
        if (cur.classList.contains('lock')){ return; }
        if (cur.value){ cur.value = ''; return; }
        for (let j=idx-1;j>=0;j--){
          if (!inputs[j].classList.contains('lock')){ inputs[j].value=''; if (!isIOS()) inputs[j].focus(); break; }
        }
      } else {
        for (let j=inputs.length-1;j>=0;j--){
          const t = inputs[j];
          if (!t.classList.contains('lock') && t.value){ t.value=''; if (!isIOS()) t.focus(); break; }
        }
      }
      return;
    }
    if (/^[A-Z]$/.test(k)){
      let target = idx >= 0 ? inputs[idx] : inputs.find(el=>!el.classList.contains('lock') && !el.value);
      if (!target){ target = inputs.find(el=>!el.classList.contains('lock')); }
      if (target && !target.classList.contains('lock')){
        target.value = k; target.classList.add('pop'); setTimeout(()=>target.classList.remove('pop'), 180);
        const ti = inputs.indexOf(target);
        for (let j=ti+1;j<inputs.length;j++){ if (!inputs[j].classList.contains('lock')){ if (!isIOS()) inputs[j].focus(); break; } }
      }
    }
  }

  function buildKeyboard(){
    if (!kb) return;
    kb.querySelectorAll('.kb-row').forEach(row => {
      const tokens = row.textContent.trim().split(/\\s+/);
      row.textContent = '';
      tokens.forEach(t => {
        let label = t, key = t;
        const btn = document.createElement('button');
        btn.className = 'key';
        if (t === '↵'){ label='Enter'; key='ENTER'; btn.classList.add('enter','wide'); }
        if (t === '⌫'){ label='⌫'; key='DEL'; btn.classList.add('del','wide'); }
        btn.textContent = label;
        btn.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          (document.activeElement instanceof HTMLElement) && document.activeElement.blur();
          pressKey(key);
        });
        row.appendChild(btn);
      });
    });
    document.addEventListener('keydown', (e)=>{
      if (panel && panel.classList.contains('hidden')) return;
      if (e.key === 'Enter'){ e.preventDefault(); pressKey('ENTER'); }
      if (e.key === 'Backspace'){ e.preventDefault(); pressKey('DEL'); }
      if (/^[a-zA-Z]$/.test(e.key)) { pressKey(e.key.toUpperCase()); }
    });
  }

  // ---------- Stats ----------
  async function loadStats(){
    if (!firebaseReady || !user || !db){ statsBody && (statsBody.textContent = 'Sign in to see your history.'); return; }
    statsBody && (statsBody.textContent = 'Loading…');
    try{
      const qs = await db.collection('compundle_results')
        .where('uid','==',user.uid)
        .orderBy('date','desc')
        .limit(14)
        .get();
      if (qs.empty){ statsBody.textContent = 'No results yet.'; return; }
      const frag = document.createDocumentFragment();
      const header = document.createElement('div');
      header.className='stats-row';
      header.innerHTML = '<strong style="min-width:100px">Date</strong><strong style="min-width:60px;text-align:right">Time</strong><strong style="min-width:60px;text-align:right">Score</strong>';
      frag.appendChild(header);
      qs.forEach(doc => {
        const { date, score, seconds } = doc.data();
        const row = document.createElement('div');
        row.className = 'stats-row';
        row.style.cssText = 'display:flex;gap:10px;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee';
        row.innerHTML = `<div style="min-width:100px">${date}</div><div style="min-width:60px;text-align:right">${fmtTime(seconds||0)}</div><div style="min-width:60px;text-align:right">${score}</div>`;
        frag.appendChild(row);
      });
      statsBody.innerHTML = '';
      statsBody.appendChild(frag);
    }catch(e){
      statsBody.textContent = 'Could not load stats.';
    }
  }

  // ---------- Flow ----------
  const LS = { lastPlayed:'compundle.lastPlayed', lastScore:'compundle.lastScore', lastTime:'compundle.lastTime' };
  function alreadyPlayedTodayLocal(){
    if (DEV) return false;
    try { return localStorage.getItem(LS.lastPlayed) === DAILY.date; } catch(e){ return false; }
  }

  function startGame(){
    if (!DEV && alreadyPlayedTodayLocal()){
      showToast('Already finished today. Come back tomorrow!');
      playedNote && playedNote.classList.remove('hidden'); return;
    }
    startOverlay && startOverlay.classList.add('hidden');
    panel && panel.classList.remove('hidden');
    wordIdx = 0; attemptsLeft = 6; score = 100; elapsed = 0;
    setDateMeta(); startTimer(); buildGrid(); updateScore(); focusFirstEmpty();
  }

  // ---------- Wire UI ----------
  btnStart && btnStart.addEventListener('click', startGame);
  btnHow && btnHow.addEventListener('click', ()=> howModal && howModal.showModal());
  btnHow2 && btnHow2.addEventListener('click', ()=> howModal && howModal.showModal());
  howClose && howClose.addEventListener('click', ()=> howModal && howModal.close());
  btnCheck && btnCheck.addEventListener('click', checkRow);
  btnHint && btnHint.addEventListener('click', giveHint);
  btnCont && btnCont.addEventListener('click', continueAfterFail);
  btnShare && btnShare.addEventListener('click', shareResults);
  btnShareInline && btnShareInline.addEventListener('click', shareResults);
  btnCloseResults && btnCloseResults.addEventListener('click', ()=> resultsModal && resultsModal.close());
  btnCloseStats && btnCloseStats.addEventListener('click', ()=> statsModal && statsModal.close());
  btnStats && btnStats.addEventListener('click', ()=>{ loadStats(); try{ statsModal && statsModal.showModal(); }catch(e){} });

  // Auth
  btnSignin && btnSignin.addEventListener('click', ()=>{
    if (!firebaseReady){ showToast('Connect Firebase to enable sign-in.'); return; }
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(()=>showToast('Sign-in cancelled.'));
  });
  btnSignout && btnSignout.addEventListener('click', ()=> firebaseReady && auth && auth.signOut());

  // ---------- Init ----------
  try{ buildKeyboard(); }catch(e){}
  try{ setDateMeta(); }catch(e){}
  try{ initFirebase(); }catch(e){}
  try{
    if (localStorage.getItem(LS.lastPlayed) === DAILY.date){
      playedNote && playedNote.classList.remove('hidden');
    }
  }catch(e){}
  console.log('Compundle ready', { date: DAILY.date });
})();
