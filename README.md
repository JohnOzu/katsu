# 🍱 Katsu

> A collaborative task management app for students. Organize class tasks by subject, track deadlines with live countdowns, and coordinate with classmates in real time.

Built with **Next.js**, **Supabase**, and **TypeScript**.

---

## Features

- **Class management** — Create or join classes using invite codes. Organize everything by class.
- **Task tracking** — Create tasks with markdown descriptions, deadlines, and subject tags. Mark them done and see who else has completed them.
- **Subjects** — Group tasks under subjects for better organization.
- **Calendar view** — See all your tasks laid out on a monthly calendar. Click a date to see what's due.
- **Live countdown deadlines** — Deadlines tick down in real time so you always know how much time is left.
- **Role-based permissions** — Four roles: `owner`, `editor`, `contributor`, and `member`, each with different levels of access.
- **Invite system** — Generate invite links or codes with passwords. Share with classmates and they join as members.
- **Markdown descriptions** — Write rich task descriptions with headers, bold text, lists, code blocks, and more.
- **Completion visibility** — Toggle whether your classmates can see that you've completed a task.
- **Google OAuth** — Sign in with Google. No passwords to manage.
- **Dark mode** — Full dark/light mode support with system preference detection.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database & Auth | [Supabase](https://supabase.com/) (PostgreSQL + Google OAuth) |
| State management | [Zustand](https://zustand-demo.pmnd.rs/) |
| Dark mode | [next-themes](https://github.com/pacocoursey/next-themes) |
| Markdown editor | [@uiw/react-md-editor](https://github.com/uiwjs/react-md-editor) |
| Markdown renderer | [react-markdown](https://github.com/remarkjs/react-markdown) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project with Google OAuth configured

### Installation

```bash
git clone https://github.com/yourusername/katsu.git
cd katsu
npm install
```

### Environment Variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Setup

Run the following in your Supabase SQL editor to set up the schema.

### Tables

```sql
-- Classes
create table classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Class members
create table class_members (
  user_id uuid references auth.users(id),
  class_id uuid references classes(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz default now(),
  primary key (user_id, class_id)
);

-- Subjects
create table class_subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  class_id uuid references classes(id) on delete cascade,
  created_at timestamptz default now()
);

-- Tasks
create table tasks (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade,
  name text not null,
  description text,
  deadline timestamptz,
  created_by uuid references auth.users(id),
  subject_id uuid references class_subjects(id) on delete set null
);

-- Task completions
create table task_completions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade,
  user_id uuid references auth.users(id),
  is_completed boolean default true,
  is_public boolean default true,
  unique(task_id, user_id)
);

-- Profiles
create table profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  avatar_url text,
  email text
);

-- Invites
create table class_invites (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade,
  code varchar(12) unique not null,
  password text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
```

### Auto-create profile on signup

```sql
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

### RLS — Owner role check (fixes self-referencing policy issue)

```sql
create or replace function is_class_owner(p_class_id uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from class_members
    where class_id = p_class_id
    and user_id = auth.uid()
    and role = 'owner'
  );
$$;

create policy "Owners can update member roles"
  on class_members for update
  using (is_class_owner(class_id));
```

---

## Role Permissions

| Action | owner | editor | contributor | member |
|--------|:-----:|:------:|:-----------:|:------:|
| Create tasks/subjects | ✅ | ✅ | ✅ | ❌ |
| Edit tasks/subjects | ✅ | ✅ | ❌ | ❌ |
| Delete tasks/subjects | ✅ | ❌ | ❌ | ❌ |
| Manage members | ✅ | ❌ | ❌ | ❌ |
| Mark tasks done | ✅ | ✅ | ✅ | ✅ |
| View everything | ✅ | ✅ | ✅ | ✅ |

---

## Project Structure

```
src/
├── app/
│   ├── dashboard/page.tsx     # Main dashboard
│   ├── join/page.tsx          # Join via invite link
│   ├── auth/callback/route.ts # OAuth callback
│   └── (marketing)/           # Homepage, about, FAQ, etc.
├── components/ui/
│   ├── Avatar.tsx
│   ├── Modal.tsx
│   ├── CustomizedInput.tsx
│   ├── CustomizedTextArea.tsx
│   ├── DeadlinePill.tsx       # Live countdown pill
│   └── ThemeToggle.tsx        # Dark/light toggle
├── hooks/
│   └── useDashboard.ts        # All dashboard data + mutation logic
└── lib/
    ├── mappers.ts             # DB types → camelCase app types
    ├── dashboardUtils.ts      # Deadline label helpers
    ├── utils.ts               # generateCode, generatePassword
    ├── stores/user-store.ts   # Zustand user store
    ├── supabase.ts            # Browser client
    ├── supabase-server.ts     # Server client
    └── auth-actions.ts        # signInWithGoogle, signOut, getUser
```

---

## License

MIT
