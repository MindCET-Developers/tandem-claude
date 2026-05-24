-- Run this in your Supabase SQL editor

CREATE TABLE projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  current_stage text default 'idea_capture',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE artifacts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  type text not null,
  title text not null,
  content_json jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view artifacts of their projects" ON artifacts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = artifacts.project_id AND projects.user_id = auth.uid())
  );

CREATE POLICY "Users can insert artifacts to their projects" ON artifacts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = artifacts.project_id AND projects.user_id = auth.uid())
  );
CREATE TABLE tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  description text,
  status text default 'todo', -- todo, in_progress, done, blocked
  priority text default 'medium', -- low, medium, high
  assigned_tool text, -- cursor, v0, claude, etc.
  order_index int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tasks of their projects" ON tasks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = tasks.project_id AND projects.user_id = auth.uid())
  );

CREATE POLICY "Users can manage tasks of their projects" ON tasks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = tasks.project_id AND projects.user_id = auth.uid())
  );

CREATE TABLE decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  context text,
  decision text not null,
  rationale text,
  status text default 'active', -- active, superseded, rejected
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view decisions of their projects" ON decisions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = decisions.project_id AND projects.user_id = auth.uid())
  );

CREATE POLICY "Users can manage decisions of their projects" ON decisions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = decisions.project_id AND projects.user_id = auth.uid())
  );

CREATE TABLE user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  openai_api_key text,
  anthropic_api_key text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);
