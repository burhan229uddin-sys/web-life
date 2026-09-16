create table if not exists hp_profiles (
  user_id text primary key,
  data jsonb not null,
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists hp_membership (
  user_id text primary key,
  tier text not null default 'free',
  updated_at timestamptz not null default now()
);

create table if not exists hp_consults (
  id text primary key,
  user_id text not null,
  body_region text not null,
  symptoms text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists hp_consults_user_idx on hp_consults (user_id, created_at desc);

create table if not exists hp_reviews (
  id text primary key,
  user_id text not null,
  name text not null,
  role text not null default '',
  body text not null,
  rating int not null default 5,
  created_at timestamptz not null default now()
);
create index if not exists hp_reviews_user_idx on hp_reviews (user_id, created_at desc);

create table if not exists hp_activities (
  id text primary key,
  user_id text not null,
  kind text not null,
  label text not null,
  detail text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists hp_activities_user_idx on hp_activities (user_id, created_at desc);

create table if not exists hp_presence (
  user_id text primary key,
  last_seen timestamptz not null default now(),
  visit_count int not null default 0
);
