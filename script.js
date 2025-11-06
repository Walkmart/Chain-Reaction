document.addEventListener('DOMContentLoaded', () => {
  try {
    (function(){
      function qs(name){ return new URLSearchParams(location.search).get(name); }
      const DEV = qs('dev') === '1';

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

      const CHAINS = [
        ["sun","flower","pot","shot","gun"],
        ["note","book","case","work","flow"],
        ["tooth","paste","board","walk","way"],
        ["under","stand","by","pass","word"],
        ["rain","bow","leg","room","mate"],
        ["green","house","cat","fish","hook"],
        ["key","board","walk","way","point"],
        ["sea","shore","line","break","down"],
        ["wall","paper","cut","back","drop"],
["shoe","lace","work","shop","ping"],
["heart","burn","rate","payer","check"],
["yard","stick","man","power","house"],
["wind","mill","stone","wall","paper"],
["pop","corn","bread","crumb","cake"],
["arm","chair","lift","gate","house"],
["sand","paper","clip","board","walk"],
["water","slide","way","point","guard"],
["sail","boat","yard","stick","man"],
["star","fish","hook","line","up"],
["hand","shake","down","time","line"],
["black","bird","bath","room","mate"],
["basket","ball","room","mate","ship"],
["play","ground","hog","wash","cloth"],
["hair","cut","back","drop","ship"],
["bed","room","mate","ship","yard"],
["sand","storm","cloud","burst","pipe"],
["week","end","game","time","out"],
["fire","house","hold","back","pack"],
["tooth","paste","board","game","pad"],
["snow","storm","front","line","man"],
["dog","house","hold","back","pack"],
["sea","shell","fish","hook","line"],
["steam","boat","yard","stick","man"],
["fish","bowl","cut","scene","play"],
["hand","shake","down","time","out"],
["wind","break","down","time","line"],
["moon","beam","line","up","date"],
["stop","watch","band","mate","ship"],
["news","paper","cut","back","drop"],
["sound","proof","read","ship","yard"],
["shoe","box","car","pool","party"],
["break","fast","ball","room","mate"],
["black","board","walk","way","point"],
["honey","comb","line","up","date"],
["star","ship","yard","stick","man"],
["cat","fish","hook","line","up"],
["green","light","house","hold","back"],
["key","board","game","pad","lock"],
["spot","light","house","plant","life"],
["bird","cage","fight","club","card"],
["milk","shake","down","time","line"],
["sand","castle","rock","wall","paper"],
["book","case","load","out","come"],
["wood","pecker","head","stone","wall"],
["butter","cup","cake","walk","way"],
["fire","truck","stop","light","post"],
["ear","ring","side","line","up"],
["basket","ball","room","mate","ship"],
["moon","rise","time","line","up"],
["ship","wreck","age","line","up"],
["cheese","cake","walk","way","point"],
["heart","beat","box","car","pool"],
["air","brush","fire","wood","land"],
["time","share","crop","dust","storm"],
["drift","wood","land","mark","down"],
["note","book","keeper","ship","yard"],
["yard","stick","man","kind","ness"],
["snow","plow","man","kind","ness"],
["sun","light","house","boat","yard"],
["table","spoon","bill","board","walk"],
["wall","paper","cut","off","set"],
["wind","pipe","line","up","date"],
["air","ship","yard","stick","man"],
["sand","bag","pipe","line","up"],
["dough","nut","shell","fish","hook"],
["shoe","lace","work","shop","ping"],
["field","work","shop","ping","pong"],
["ship","mate","rial","list","ing"],
["cross","road","side","line","up"],
["cup","cake","walk","way","point"],
["rain","bow","line","up","date"],
["paint","brush","fire","wood","land"],
["bird","house","hold","back","pack"],
["blood","line","up","date","base"],
["truck","load","out","come","back"],
["wood","shop","ping","pong","ball"],
["moon","stone","wall","paper","cut"]
        
      ];

      const DAILY = { date: todayKey() };
      DAILY.index = hashString(DAILY.date) % CHAINS.length;
      DAILY.chain = CHAINS[DAILY.index];

      let wordIdx = 0, attemptsLeft = 6, score = 100;
      let startTime = null, timerId = null, elapsed = 0;

      let firebaseReady = false, auth = null, db = null, user = null;

      const startOverlay = document.getElementById('start-overlay');
      const playedNote = document.getElementById('played-note');
      const panel = document.getElementById('panel');
      const grid = document.getElementById('word-grid');
      const rowState = document.getElementById('row-state');
      const metaScore = document.getElementById('meta-score');
      const metaTime = document.getElementById('meta-time');
      const metaDate = document.getElementById('meta-date');
      const btnStart = document.getElementById('btn-start');
      const btnHow = document.getElementById('btn-how');
      const btnHow2 = document.getElementById('btn-how-2');
      const btnCheck = document.getElementById('btn-check');
      const btnHint = document.getElementById('btn-hint');
      const btnCont = document.getElementById('btn-continue');
      const toast = document.getElementById('toast');
      const howModal = document.getElementById('how-modal');
      const howClose = document.getElementById('how-close');
      const resultsModal = document.getElementById('results-modal');
      const resultsText = document.getElementById('results-text');
      const btnShare = document.getElementById('btn-share');
      const btnShareInline = document.getElementById('btn-share-inline');
      const btnCloseResults = document.getElementById('btn-close-results');
      const userChip = document.getElementById('user-chip');
      const btnSignin = document.getElementById('btn-signin');
      const btnSignout = document.getElementById('btn-signout');
      const btnStats = document.getElementById('btn-stats');
      const statsModal = document.getElementById('stats-modal');
      const statsBody = document.getElementById('stats-body');

      const LS = {
        lastPlayed: 'compundle.lastPlayed',
        lastScore: 'compundle.lastScore',
        lastTime: 'compundle.lastTime',
      };

      function showToast(msg, ms=1600){ if(!toast) return; toast.textContent = msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'), ms); }
      function updateScore(){ if(metaScore) metaScore.textContent = score; }
      function fmtTime(s){ const m=Math.floor(s/60), r=s%60; return `${m}:${r.toString().padStart(2,'0')}`; }
      function updateTime(){ if (!startTime || !metaTime) return; elapsed = Math.floor((Date.now() - startTime)/1000); metaTime.textContent = fmtTime(elapsed); }
      function startTimer(){ stopTimer(); startTime = Date.now(); updateTime(); timerId=setInterval(updateTime, 1000); }
      function stopTimer(){ if (timerId){ clearInterval(timerId); timerId=null; } }
      function setDateMeta(){ if (metaDate) metaDate.textContent = DAILY.date; }

      function createRow(word, locked=false){
        const row = document.createElement('div'); row.className='word-row';
        row.style.gridTemplateColumns = `repeat(${word.length}, 62px)`;
        for(let i=0;i<word.length;i++){
          const tile = document.createElement('div'); tile.className='tile';
          const inp = document.createElement('input'); inp.className='letter'; inp.maxLength=1; inp.autocomplete='off'; inp.spellcheck=false;
          if (locked){ inp.value = word[i].toUpperCase(); inp.classList.add('lock'); inp.readOnly = true; inp.tabIndex=-1; }
          tile.appendChild(inp); row.appendChild(tile);
        }
        return row;
      }
      function currentRow(){ return grid ? grid.children[wordIdx] : null; }
      function currentWord(){ return DAILY.chain[wordIdx].toLowerCase(); }
      function inputsOf(row){ return Array.from(row.querySelectorAll('input.letter')); }
      function focusFirstEmpty(){
        const row = currentRow(); if (!row) return;
        const inputs = inputsOf(row);
        for(const el of inputs){ if(!el.classList.contains('lock') && !el.value){ el.focus(); return; } }
        for (let i=inputs.length-1;i>=0;i--){ if(!inputs[i].classList.contains('lock')){ inputs[i].focus(); return; } }
      }
      function moveFocus(inputs, i, dir){
        let idx = i + dir;
        while (idx >= 0 && idx < inputs.length){
          const next = inputs[idx];
          if (!next.classList.contains('lock')) { next.focus(); return; }
          idx += dir;
        }
      }
      function wireRowHandlers(){
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
            if (btnCheck) btnCheck.disabled = true; if (btnHint) btnHint.disabled = true;
            rowState && (rowState.textContent = `Out of attempts. The word was “${currentWord().toUpperCase()}”.`);
          } else {
            rowState && (rowState.textContent = `Try again — ${attemptsLeft} left`);
            focusFirstEmpty();
          }
        }
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

      function finishChain(){
        try { confetti({ particleCount: 160, spread: 70, origin: { y: 0.6 } });
              setTimeout(()=>confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } }), 300);
        } catch(e){ console.warn('confetti failed', e); }
        score += 20; updateScore();
        stopTimer();
        if (resultsText) resultsText.textContent = `Nice work! Final score: ${score} — Time: ${fmtTime(elapsed)} — ${DAILY.date}`;
        try{ resultsModal && resultsModal.showModal(); }catch(e){}

        try {
          localStorage.setItem(LS.lastPlayed, DAILY.date);
          localStorage.setItem(LS.lastScore, String(score));
          localStorage.setItem(LS.lastTime, String(elapsed));
        } catch(e){}

        if (firebaseReady && user && db){
          const docId = `${user.uid}_${DAILY.date}`;
          db.collection('compundle_results').doc(docId).set({
            uid: user.uid, date: DAILY.date, score, seconds: elapsed, chainIndex: DAILY.index, at: new Date().toISOString()
          }, { merge: true }).catch(err=>console.warn('save failed', err));
        }
      }

      function nextWord(){
        const row = currentRow(); if (!row) return;
        const inputs = inputsOf(row); const ans = currentWord();
        if (inputs.some((inp,i)=> (inp.value||'').toLowerCase() !== ans[i])){ focusFirstEmpty(); return; }
        wordIdx++;
        if (wordIdx >= DAILY.chain.length){
          if (btnCheck) btnCheck.disabled = true; if (btnHint) btnHint.disabled = true;
          finishChain();
          return;
        }
        attemptsLeft = 6; focusFirstEmpty();
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
        if (btnCheck) btnCheck.disabled=false; if (btnHint) btnHint.disabled=false;
        buildGrid(); focusFirstEmpty();
      }

      function pressKey(k){
        if (panel && panel.classList.contains('hidden')) return;
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
              if (!inputs[j].classList.contains('lock')){ inputs[j].value=''; inputs[j].focus(); break; }
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
            for (let j=ti+1;j<inputs.length;j++){ if (!inputs[j].classList.contains('lock')){ inputs[j].focus(); break; } }
          }
        }
      }
      function buildKeyboard(){
        const kb = document.getElementById('kb'); if (!kb) return;
        kb.querySelectorAll('.kb-row').forEach(row => {
          const tokens = row.textContent.trim().split(/\s+/);
          row.textContent = '';
          tokens.forEach(t => {
            let label = t, key = t;
            const btn = document.createElement('button');
            btn.className = 'key';
            if (t === '↵'){ label='Enter'; key='ENTER'; btn.classList.add('enter','wide'); }
            if (t === '⌫'){ label='⌫'; key='DEL'; btn.classList.add('del','wide'); }
            btn.textContent = label;
            btn.addEventListener('click', ()=>pressKey(key));
            row.appendChild(btn);
          });
        });
        document.addEventListener('keydown', (e)=>{
          if (panel && panel.classList.contains('hidden')) return;
          if (e.key === 'Enter'){ e.preventDefault(); pressKey('ENTER'); }
          if (e.key === 'Backspace'){ e.preventDefault(); pressKey('DEL'); }
        });
      }

      function shareResults(){
        const text = `Compundle — ${DAILY.date}\nScore: ${score}\nTime: ${fmtTime(elapsed)}\nhttps://compundle.com`;
        navigator.clipboard.writeText(text).then(()=>showToast('Results copied!')).catch(()=>showToast('Copy failed.'));
      }

      function alreadyPlayedTodayLocal(){
        if (DEV) return false;
        try { return localStorage.getItem('compundle.lastPlayed') === DAILY.date; } catch(e){ return false; }
      }
      function lockIfPlayed(){
        const played = alreadyPlayedTodayLocal();
        if (played && playedNote){ playedNote.classList.remove('hidden'); }
      }

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
              if (userChip) { userChip.textContent = user.displayName || user.email || "Signed in"; userChip.classList.remove('hidden'); }
              if (btnSignout) btnSignout.classList.remove('hidden');
              if (btnSignin) btnSignin.classList.add('hidden');
              if (btnStats) btnStats.classList.remove('hidden');
            } else {
              if (userChip) userChip.classList.add('hidden');
              if (btnSignout) btnSignout.classList.add('hidden');
              if (btnSignin) btnSignin.classList.remove('hidden');
              if (btnStats) btnStats.classList.add('hidden');
            }
          });
        }catch(e){ console.warn('Firebase init failed', e); firebaseReady=false; }
      }
      function signIn(){
        if (!firebaseReady){ showToast('Connect Firebase to enable sign-in.'); return; }
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(()=>showToast('Sign-in cancelled.'));
      }
      function signOut(){ if (firebaseReady && auth){ auth.signOut(); } }

      async function loadStats(){
        if (!firebaseReady || !user || !db){ if (statsBody) statsBody.textContent = 'Sign in to see your history.'; return; }
        if (statsBody) statsBody.textContent = 'Loading…';
        try{
          const qs = await db.collection('compundle_results')
            .where('uid','==',user.uid)
            .orderBy('date','desc')
            .limit(14)
            .get();
          if (qs.empty){ statsBody.textContent = 'No results yet.'; return; }
          const frag = document.createDocumentFragment();
          qs.forEach(doc => {
            const { date, score, seconds } = doc.data();
            const row = document.createElement('div');
            row.className = 'stats-row';
            const d = document.createElement('div'); d.className='d'; d.textContent = date;
            const t = document.createElement('div'); t.className='t'; t.textContent = fmtTime(seconds||0);
            const s = document.createElement('div'); s.className='s'; s.textContent = score;
            row.appendChild(d); row.appendChild(t); row.appendChild(s);
            frag.appendChild(row);
          });
          statsBody.innerHTML = '<div class="stats-row"><strong class="d">Date</strong><strong class="t">Time</strong><strong class="s">Score</strong></div>';
          statsBody.appendChild(frag);
        }catch(e){
          statsBody.textContent = 'Could not load stats.';
        }
      }

      function startGame(){
        if (!DEV && alreadyPlayedTodayLocal()){
          showToast('Already finished today. Come back tomorrow!');
          if (playedNote) playedNote.classList.remove('hidden'); return;
        }
        if (startOverlay) startOverlay.classList.add('hidden');
        if (panel) panel.classList.remove('hidden');
        wordIdx = 0; attemptsLeft = 6; score = 100; elapsed = 0;
        setDateMeta(); startTimer(); buildGrid(); updateScore(); focusFirstEmpty();
      }

      // Safe wiring (guard every element)
      if (btnStart) btnStart.addEventListener('click', startGame);
      if (btnHow) btnHow.addEventListener('click', ()=> howModal && howModal.showModal());
      if (btnHow2) btnHow2.addEventListener('click', ()=> howModal && howModal.showModal());
      if (howClose) howClose.addEventListener('click', ()=> howModal && howModal.close());
      if (btnCheck) btnCheck.addEventListener('click', checkRow);
      if (btnHint) btnHint.addEventListener('click', giveHint);
      if (btnCont) btnCont.addEventListener('click', continueAfterFail);
      if (btnShare) btnShare.addEventListener('click', shareResults);
      if (btnShareInline) btnShareInline.addEventListener('click', shareResults);
      if (btnCloseResults) btnCloseResults.addEventListener('click', ()=> resultsModal && resultsModal.close());
      if (btnSignin) btnSignin.addEventListener('click', signIn);
      if (btnSignout) btnSignout.addEventListener('click', signOut);
      if (btnStats) btnStats.addEventListener('click', ()=>{ loadStats(); try{ statsModal && statsModal.showModal(); }catch(e){} });

      // Init
      try{ buildKeyboard(); }catch(e){ console.warn('kb', e); }
      try{ lockIfPlayed(); }catch(e){ console.warn('lock', e); }
      try{ setDateMeta(); }catch(e){}
      try{ initFirebase(); }catch(e){}
      console.log('Compundle init OK', { DEV, date: DAILY.date });
    })();
  } catch (err) {
    console.error('Compundle fatal init error:', err);
  }
});
