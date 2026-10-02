# 🌿 Kardam

> Small steps. A little more calm.

Kardam is a mobile-first mental health support Progressive Web App (PWA) designed for Indian users. It provides a private, on-device space for mood check-ins, journaling, peer connection, calming practices, and emergency support.

## ✨ Features

- **Private & On-Device** — All data stays on the user's phone. Nothing is uploaded.
- **Mood Check-ins** — Gentle daily mood quests with visual mood bars
- **Sukoon Garden** — An illustrated garden that grows with your check-ins (nothing is ever lost)
- **Sanctuary** — Calming practices: breathing, rain, forest, ocean, silence
- **Journal** — Private entries with moods, fully local
- **Peer Connect** — Browse and connect with listeners, sharers, and guides (Indian names)
- **Chat with Kardam** — Warm, supportive companion (not a therapist)
- **Emergency SOS** — Indian helplines (iCall, Vandrevala, Kiran), trusted contact, silent alert
- **Duress PIN** — A secret PIN that opens a harmless wellness screen if someone forces you
- **Language Support** — English, Hindi, Hinglish
- **Progress Journey** — Milestones without competition or guilt

##  Deployment

### Netlify (recommended)

1. Push this repo to GitHub
2. Connect the repo on Netlify
3. Build settings:
   - Build command: `echo 'No build needed'`
   - Publish directory: `.`
4. Deploy — done!

The `netlify.toml` and `_redirects` files handle SPA routing automatically.

### Manual / Any Static Host

Just upload the contents of this folder. No build step required.

## 📱 Install as PWA

On Android Chrome: open the site → menu → "Install app"
On iOS Safari: Share → "Add to Home Screen"

##  Privacy

- All data stored in browser's localStorage
- PINs are hashed only in-memory (demo — connect real backend for production)
- Duress PIN opens a decoy wellness screen
- No analytics, no tracking, no external API calls

## 🛠 Project Structure

```
kardam/
├── index.html          # Main shell with all views
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline support)
├── netlify.toml        # Netlify deployment config
├── _redirects          # SPA routing fallback
├── README.md           # This file
── css/
│   └── style.css       # Complete design system
├── js/
│   ├── data.js         # Constants, mock data, i18n (EN/HI/Hinglish)
│   ├── storage.js      # LocalStorage persistence layer
│   ├── auth.js         # Splash, onboarding, PIN setup, login
│   ├── app.js          # Home, garden, sanctuary, progress, profile
│   ├── chat.js         # Kardam chat with mood-based responses
│   ├── journal.js      # Journal CRUD
│   ├── peer.js         # Peer Connect browse & connect
│   ├── emergency.js    # SOS, helplines, trusted contact
│   ├── duress.js       # Duress mode (wellness tips)
│   └── init.js         # Boot coordinator, toast, view switch
└── assets/
    ├── icon-192.png
    └── icon-512.png
```

## 🎨 Design Language

- Warm pastels: cream, sage, peach, lavender, pink, light blue
- Typography: Fraunces (serif headings) + Plus Jakarta Sans (body)
- Mascot: friendly blob creature
- No emojis in UI — meaningful icons and illustrations instead
- No clinical/hospital appearance
- Comfortable touch targets (44px+)

##  Emergency Helplines Included

- iCall: 9152987821
- Vandrevala Foundation: 1860-2662-345
- Kiran (Govt. of India): 1800-599-0019
- Snehi: 9582329090

## ⚠️ Disclaimer

Kardam is NOT a medical device. It does not diagnose, assess risk, or replace professional help. If you're in crisis, please reach a trusted person or call a helpline.

---

Made with care · Your data never leaves your device
