# NexusApp — Nuxt 3 + Tailwind + Supabase Starter

A production-ready full-stack starter with authentication, dashboard, team management, analytics, and more.

---

## Tech Stack

| Layer      | Technology                           |
|------------|--------------------------------------|
| Framework  | [Nuxt 3](https://nuxt.com)           |
| Styling    | [Tailwind CSS v3](https://tailwindcss.com) |
| Backend    | [Supabase](https://supabase.com) (Auth + DB + Storage) |
| Icons      | [nuxt-icon](https://github.com/nuxt-modules/icon) + Heroicons |
| Language   | TypeScript                           |

---

## Features

- **Authentication** — Email/password sign-up, login, password reset
- **OAuth** — Google & GitHub one-click sign-in
- **Dashboard** — Stats cards, activity feed, quick actions
- **Profile** — Edit name, bio, location, website; avatar initials
- **Settings** — Change email, change password, notification preferences, session management
- **Team** — Invite members by email, assign roles (admin / member / viewer), manage pending invites
- **Analytics** — Activity chart, usage breakdown, top events
- **Toast notifications** — Global `useToast()` composable
- **Auth composable** — `useAuth()` wrapping all Supabase auth methods
- **Route middleware** — Protects `/dashboard/**` routes
- **Row Level Security** — All Supabase tables locked to the authenticated user
- **Responsive** — Mobile sidebar with overlay, desktop persistent sidebar

---

## Project Structure

```
nuxt-supabase-app/
├── assets/css/
│   └── tailwind.css          # Global styles, component classes
├── components/
│   └── AppToast.vue          # Global toast notification system
├── composables/
│   ├── useAuth.ts            # Auth helper (signIn, signUp, signOut, OAuth…)
│   └── useToast.ts           # Toast notifications
├── layouts/
│   ├── default.vue           # Dashboard layout (sidebar + topbar)
│   └── auth.vue              # Auth layout (split panel)
├── middleware/
│   └── auth.ts               # Redirect unauthenticated users to /login
├── pages/
│   ├── index.vue             # Redirects → /dashboard or /login
│   ├── login.vue             # Sign in page
│   ├── register.vue          # Sign up page
│   ├── confirm.vue           # OAuth callback handler
│   ├── reset-password.vue    # Password reset form
│   └── dashboard/
│       ├── index.vue         # Main dashboard
│       ├── profile.vue       # Profile editor
│       ├── settings.vue      # Security & preferences
│       ├── team.vue          # Team management
│       └── analytics.vue     # Usage analytics
├── supabase/
│   └── schema.sql            # Full database schema + RLS policies
├── .env.example              # Environment variable template
├── nuxt.config.ts
└── tailwind.config.ts
```

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url> nexusapp
cd nexusapp
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In **SQL Editor**, paste and run the contents of `supabase/schema.sql`
3. In **Authentication → Providers**, enable **Email**
4. *(Optional)* Enable **Google** and/or **GitHub** OAuth providers
5. In **Authentication → URL Configuration**, add your site URL:
   - Local: `http://localhost:3000`
   - Production: your deployed URL

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key
APP_NAME=NexusApp
```

Find your URL and anon key in **Project Settings → API**.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login`.

---

## Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → **APIs & Services → Credentials → OAuth 2.0 Client**
3. Set Authorized redirect URI to:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
4. Copy Client ID and Secret into Supabase → **Auth → Providers → Google**

## GitHub OAuth Setup

1. Go to **GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App**
2. Set Homepage URL: `http://localhost:3000`
3. Set Authorization callback URL:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
4. Copy Client ID and Secret into Supabase → **Auth → Providers → GitHub**

---

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard → Settings → Environment Variables.

### Netlify

```bash
npm run build
# Upload .output/public as static, or use Netlify Functions for SSR
```

---

## Using the Auth Composable

```vue
<script setup lang="ts">
const { user, displayName, signIn, signOut, updateProfile } = useAuth()

// Sign in
const { error } = await signIn('user@email.com', 'password')

// Update profile
const { error } = await updateProfile({ bio: 'Hello world', location: 'Phnom Penh' })

// Sign out
await signOut()
</script>
```

## Using the Toast Composable

```vue
<script setup lang="ts">
const { toast } = useToast()

toast.success('Profile saved!')
toast.error('Something went wrong')
toast.info('Email confirmation sent')
toast.warning('Session expiring soon')
</script>
```

---

## Adding New Pages

1. Create `pages/dashboard/mypage.vue`
2. Add `definePageMeta({ middleware: 'auth' })` at the top of `<script setup>`
3. Add a nav link in `layouts/default.vue`

```vue
<NuxtLink to="/dashboard/mypage" class="nav-item" active-class="nav-active">
  <Icon name="heroicons:star" class="w-4.5 h-4.5" />
  My Page
</NuxtLink>
```

---

## Database: Adding a New Table

1. Add the table to `supabase/schema.sql`
2. Always enable RLS: `alter table public.my_table enable row level security;`
3. Add policies for the operations you need

Example:
```sql
create table public.notes (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now()
);

alter table public.notes enable row level security;

create policy "Users can manage own notes"
  on public.notes for all
  using (auth.uid() = user_id);
```

---

## License

MIT — use freely for personal or commercial projects.
