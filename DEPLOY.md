# 🚀 Game Features Portal — Deploy Guide

## What you need
- A computer with [Node.js](https://nodejs.org) installed (v18+)
- A free [GitHub](https://github.com) account
- A free [Vercel](https://vercel.com) account (sign up with GitHub)

---

## Step 1 — Set up the project folder

Create this folder structure on your computer:

```
game-portal/
├── index.html          ← (file provided)
├── package.json        ← (file provided)
├── vite.config.js      ← (file provided)
├── .gitignore          ← (file provided)
└── src/
    ├── main.jsx        ← (file provided)
    └── App.jsx         ← rename game-portal-with-admin.jsx → App.jsx
```

**Rename** `game-portal-with-admin.jsx` to `App.jsx` and put it in the `src/` folder.
Put all other provided files in the root `game-portal/` folder.

---

## Step 2 — Install dependencies

Open a terminal in the `game-portal/` folder and run:

```bash
npm install
```

Test it works locally:

```bash
npm run dev
```

Open http://localhost:5173 — you should see the portal login screen.

---

## Step 3 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Game Features Portal"
```

Then go to https://github.com/new, create a repo called `game-portal` (private is fine), and follow the "push existing" instructions GitHub shows you. It looks like:

```bash
git remote add origin https://github.com/YOUR-USERNAME/game-portal.git
git branch -M main
git push -u origin main
```

---

## Step 4 — Deploy on Vercel (free, ~60 seconds)

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Select your `game-portal` repo
4. Leave all settings as default — Vercel auto-detects Vite
5. Click **Deploy**

✅ Done! Vercel gives you a URL like:
```
https://game-portal-yourname.vercel.app
```

Share this URL with your team. It's live immediately.

---

## Step 5 — Update the app in future

Whenever you get a new `App.jsx` (updated portal file), just:

```bash
# Replace src/App.jsx with the new file, then:
git add .
git commit -m "Update portal"
git push
```

Vercel auto-deploys within 30 seconds. Your team sees the update instantly.

---

## Sharing with your team

Just send them the Vercel URL. That's it — no install needed on their side.

**Current demo login accounts:**
| Email | Password | Role |
|---|---|---|
| admin@company.com | admin123 | Super Admin — full access |
| lead@company.com | lead123 | Editor — can edit missions |
| analyst@company.com | analyst123 | Viewer — read only |
| junior@company.com | junior123 | Viewer — missions only |

**To change passwords or add real team members:**
Log in as Super Admin → click **🛡️ Admin Panel** → Users tab.

---

## ⚠️ Security note

The current login is simulated — passwords are stored in the code.
This is fine for internal team tools, but if you need proper security:

Ask to add **Supabase Auth** — it's a free real authentication system
that takes ~30 minutes to add and stores users in a real database.

---

## Troubleshooting

**"npm: command not found"** → Install Node.js from https://nodejs.org (LTS version)

**Build error about JSX** → Make sure `vite.config.js` is present with the react plugin

**Blank page on Vercel** → Check the Build Output directory is set to `dist` in Vercel settings

**Charts not showing** → Make sure recharts installed: run `npm install recharts`
