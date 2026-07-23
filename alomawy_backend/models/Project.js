import { createClient } from '@supabase/supabase-js';

let _supabase = null;

function getClient() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }
  return _supabase;
}

const TABLE = 'projects';

function mapProject(row) {
  if (!row) return null;
  const { id, created_at, ...rest } = row;
  return { _id: id, createdAt: created_at, ...rest };
}

function mapProjects(rows) {
  return rows.map(mapProject);
}

export { getClient, TABLE, mapProject, mapProjects };
