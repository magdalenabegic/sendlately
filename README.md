# About SendLately

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

# lately.

**Catch up before you catch up.**

Lately is a web and mobile app that lets you create a personal collage — books you've read, places you've visited, moments that happened — and send it to a friend before you meet up. No more awkward "so what's new?" silences. They arrive already knowing what's been going on with you.

---

## How it works

1. **Create** — build your Lately by adding cards: books, places, moments, music, things you're obsessing over
2. **Send** — share a link with a friend
3. **They open it** — they flip through your cards and react, no account needed
4. **You meet up** — conversation flows from the moment you sit down

---

## Tech stack

- **Frontend / Mobile** — [Expo](https://expo.dev) (React Native) — one codebase for web, iOS, and Android
- **Backend / Database** — [Supabase](https://supabase.com) — auth, database, and file storage
- **Hosting** — [Netlify](https://netlify.com) — web deployment with auto-deploy from GitHub
- **Domain** — [sendlately.com](https://sendlately.com)

---

## Getting started locally

### Prerequisites

- Node.js (v18 or higher) — [nodejs.org](https://nodejs.org)
- A Supabase account — [supabase.com](https://supabase.com)
- A Netlify account — [netlify.com](https://netlify.com)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/sendlately.git
cd sendlately
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

Create a new project at supabase.com, then run the following in the SQL editor:

```sql
create table profiles (
  id uuid references auth.users primary key,
  name text,
  created_at timestamp default now()
);

create table collages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  recipient_name text,
  is_sent boolean default false,
  share_token text unique default gen_random_uuid()::text,
  created_at timestamp default now()
);

create table cards (
  id uuid default gen_random_uuid() primary key,
  collage_id uuid references collages(id) on delete cascade,
  type text,
  title text,
  subtitle text,
  note text,
  position integer,
  created_at timestamp default now()
);

create table reactions (
  id uuid default gen_random_uuid() primary key,
  card_id uuid references cards(id) on delete cascade,
  emoji text,
  created_at timestamp default now()
);
```

### 4. Add environment variables

Create a `.env` file in the root:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You'll find both values in your Supabase project under **Settings → API**.

### 5. Run the app

```bash
npx expo start
```

Press `w` to open in browser, `i` for iOS simulator, `a` for Android emulator.

---

## Deployment

### Web (Netlify)

```bash
npx expo export --platform web
netlify deploy --dir dist --prod
```
