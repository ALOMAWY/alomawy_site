import { createClient } from '@supabase/supabase-js';

let _supabase = null;

function getClient() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }
  return _supabase;
}

const TABLE = 'projects';

function parseJSONArray(value, fallback = []) {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return value ? [value] : fallback;
    }
  }
  return fallback;
}

function mapProject(row) {
  if (!row) return null;
  const { id, created_at, type, image, ...rest } = row;

  const types = parseJSONArray(type, type ? [type] : []);
  const images = parseJSONArray(image, image ? [image] : []);

  return {
    _id: id,
    createdAt: created_at,
    type: types[0] || '',
    types,
    image: images[0] || '',
    images,
    ...rest,
  };
}

function mapProjects(rows) {
  return rows.map(mapProject);
}

export { getClient, TABLE, mapProject, mapProjects };
