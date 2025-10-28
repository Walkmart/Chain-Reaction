Compundle — Daily (v3) with Firebase Login + Firestore Saves

What's included
---------------
• Daily puzzle (one chain per day, UTC rollover)
• Hint = -10, wrong check = -5, +10 per solved word, +20 chain bonus
• Start overlay, timer, confetti, clipboard share
• Google Sign-In and Firestore saving of results
• "My Stats" modal (last ~14 results)

Testing daily lock
------------------
Add ?dev=1 to your URL while testing locally to bypass the one-per-day lock.

Deploy notes
------------
1) Host these files (index.html, style.css, script.js, assets/mascot.svg).
2) Your Firebase config is already embedded via window.COMPUNDLE_FIREBASE_CONFIG.
3) In Firebase Console, enable Authentication (Google) and Firestore.

Suggested Firestore Security Rules (restrict per-user access):
--------------------------------------------------------------
rules_version = '2';
service cloud.firestore {{
  match /databases/{{database}}/documents {{
    match /compundle_results/{{docId}} {{
      allow read, write: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }}
  }}
}}

(You can relax reads for a future global leaderboard if desired.)

Have fun!
