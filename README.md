# Family Learning Trail

A maths and reading tutor for kids — maths worksheets for class 2 and class 4, reading passages with comprehension questions and a vocabulary word bank, and a storybook shelf of 8 illustrated stories split by class level (Class 4 stories run longer, with a "Challenge readers" tier and harder vocabulary). Kids listen to a page read aloud, then read it back themselves, and a reading buddy highlights words green or red as it listens.

## Run it locally first (optional but recommended)

You'll need [Node.js](https://nodejs.org) installed (v18 or newer).

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173) to try it in your browser before deploying.

## Deploy to Vercel

**Option A — no coding, drag and drop:**
1. Run `npm install` then `npm run build` in this folder. This creates a `dist` folder.
2. Go to [vercel.com](https://vercel.com), sign up/log in.
3. Click "Add New" → "Project" → and look for the option to deploy a folder, or drag the `dist` folder onto the dashboard.

**Option B — via GitHub (recommended, gets you a stable link + easy updates):**
1. Create a new repository on [github.com](https://github.com) and push this folder to it.
2. Go to [vercel.com](https://vercel.com) → "Add New" → "Project" → import your GitHub repo.
3. Vercel auto-detects Vite. Leave build settings as default (`npm run build`, output folder `dist`).
4. Click Deploy. You'll get a live link like `family-learning-trail.vercel.app`.

## Deploy to Netlify

**Option A — drag and drop:**
1. Run `npm install` then `npm run build`. This creates a `dist` folder.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the `dist` folder in.
3. You'll get a live link instantly.

**Option B — via GitHub:**
1. Push this folder to a GitHub repository.
2. Go to [netlify.com](https://netlify.com) → "Add new site" → "Import an existing project" → connect your GitHub repo.
3. Build command: `npm run build`. Publish directory: `dist`. Deploy.

## Important: microphone permission

The "read aloud" practice mode (used in both the reading journal and the storybook shelf) needs microphone access and only works in **Chrome or Edge** (desktop or Android). Once deployed with a real `https://` link (Vercel and Netlify both give you HTTPS automatically), the browser will prompt to allow the microphone the first time a child uses it — this must be allowed. It won't work over plain `http://`, but Vercel/Netlify links are always secure by default, so you're covered.

The "Read this page to me" button in the storybook uses the browser's built-in text-to-speech and works everywhere, no microphone needed.

## Customizing later

- Maths problem ranges: edit `genClass2` and `genClass4` in `src/App.jsx`.
- Add more reading passages: extend the `PASSAGES` object in `src/App.jsx`.
- Add more storybooks: extend the `STORYBOOKS` array in `src/App.jsx` — each story is a title, level, color, and a list of page texts.
- Colors and fonts: edit the `COLORS` object and the Google Fonts import near the top of `src/App.jsx`.

If you want help adding features later (more passages, a profile switcher for each kid, progress tracking over time), just ask.
