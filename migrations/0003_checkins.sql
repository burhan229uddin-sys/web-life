create table if not exists hp_checkins (
  id text primary key,
  user_id text not null,
  energy int not null,
  mood int not null,
  sleep_score int not null,
  stress int not null,
  note text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists hp_checkins_user_idx on hp_checkins (user_id, created_at desc);
