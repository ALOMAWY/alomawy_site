import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { getClient, TABLE, mapProject, mapProjects } from '../models/Project.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error('CRITICAL: Cloudinary credentials missing in environment variables!');
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'alomawy_projects',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage });

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { data, error } = await getClient()
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(mapProjects(data));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get unique sources
router.get('/sources', async (req, res) => {
  try {
    const { data, error } = await getClient()
      .from(TABLE)
      .select('source')
      .not('source', 'is', null)
      .neq('source', '');

    if (error) throw error;
    const unique = [...new Set(data.map((r) => r.source))].sort();
    res.json(unique);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bulk update selected projects
router.patch('/bulk-update', async (req, res) => {
  try {
    const { projectIds, updates } = req.body || {};

    if (!Array.isArray(projectIds) || projectIds.length === 0 || projectIds.some((id) => typeof id !== 'string' || !id)) {
      return res.status(400).json({ message: 'projectIds must be a non-empty array' });
    }
    const uniqueProjectIds = [...new Set(projectIds)];

    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      return res.status(400).json({ message: 'updates object is required' });
    }

    const updateData = {};
    const arrayOperations = updates.arrayOperations || {};

    for (const field of ['title', 'developer', 'source', 'visit', 'disc']) {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        if (typeof updates[field] !== 'string') {
          return res.status(400).json({ message: `${field} must be a string` });
        }
        updateData[field] = updates[field];
      }
    }

    if (updates.showOnCompanySite !== undefined) {
      if (![true, false, 'true', 'false'].includes(updates.showOnCompanySite)) {
        return res.status(400).json({ message: 'showOnCompanySite must be a boolean' });
      }
      updateData.show_on_company_site = updates.showOnCompanySite === true || updates.showOnCompanySite === 'true';
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'rate')) {
      const rate = Number(updates.rate);
      if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
        return res.status(400).json({ message: 'rate must be between 0 and 100' });
      }
      updateData.rate = rate;
    }

    if (updates.types !== undefined) {
      const parsedTypes = Array.isArray(updates.types) ? updates.types : JSON.parse(updates.types);
      if (!Array.isArray(parsedTypes)) throw new Error('types must be an array');
      updateData.type = JSON.stringify(parsedTypes);
    }

    if (updates.langs !== undefined) {
      const parsedLangs = Array.isArray(updates.langs) ? updates.langs : JSON.parse(updates.langs);
      if (!Array.isArray(parsedLangs)) throw new Error('langs must be an array');
      updateData.langs = parsedLangs;
    }

    if (updates.techs !== undefined) {
      const parsedTechs = Array.isArray(updates.techs) ? updates.techs : JSON.parse(updates.techs);
      if (!Array.isArray(parsedTechs)) throw new Error('techs must be an array');
      updateData.techs = parsedTechs;
    }

    const arrayFields = {
      types: 'type',
      langs: 'langs',
      techs: 'techs',
    };
    const normalizedOperations = {};

    if (!arrayOperations || typeof arrayOperations !== 'object' || Array.isArray(arrayOperations)) {
      return res.status(400).json({ message: 'arrayOperations must be an object' });
    }

    for (const [field, operation] of Object.entries(arrayOperations)) {
      if (!Object.prototype.hasOwnProperty.call(arrayFields, field)) {
        return res.status(400).json({ message: `Unsupported array operation: ${field}` });
      }
      if (
        !operation ||
        !['replace', 'add', 'remove'].includes(operation.action) ||
        !Array.isArray(operation.values) ||
        operation.values.some((value) => typeof value !== 'string')
      ) {
        return res.status(400).json({ message: `Invalid array operation for ${field}` });
      }
      normalizedOperations[field] = {
        column: arrayFields[field],
        action: operation.action,
        values: operation.values,
      };
    }

    if (Object.keys(updateData).length === 0 && Object.keys(normalizedOperations).length === 0) {
      return res.status(400).json({ message: 'No supported update fields were provided' });
    }

    if (Object.keys(normalizedOperations).length > 0) {
      const { data: rows, error: findError } = await getClient()
        .from(TABLE)
        .select('id, type, langs, techs')
        .in('id', uniqueProjectIds);

      if (findError) throw findError;

      const parseArray = (value) => {
        if (Array.isArray(value)) return value;
        if (typeof value !== 'string' || value.length === 0) return [];
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [value];
        } catch {
          return [value];
        }
      };

      const results = await Promise.all((rows || []).map(async (row) => {
        const projectUpdates = { ...updateData };

        for (const operation of Object.values(normalizedOperations)) {
          const currentValues = parseArray(row[operation.column]);
          let nextValues;

          if (operation.action === 'replace') {
            nextValues = operation.values;
          } else if (operation.action === 'add') {
            nextValues = [...new Set([...currentValues, ...operation.values])];
          } else {
            const removed = new Set(operation.values);
            nextValues = currentValues.filter((value) => !removed.has(value));
          }

          projectUpdates[operation.column] = operation.column === 'type'
            ? JSON.stringify(nextValues)
            : nextValues;
        }

        const { error } = await getClient()
          .from(TABLE)
          .update(projectUpdates)
          .eq('id', row.id);

        if (error) throw error;
        return row.id;
      }));

      return res.json({ message: `Updated ${results.length} projects` });
    }

    const { error } = await getClient()
      .from(TABLE)
      .update(updateData)
      .in('id', uniqueProjectIds);

    if (error) throw error;

    res.json({ message: `Updated ${uniqueProjectIds.length} projects` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Bulk delete selected projects
router.post('/bulk-delete', async (req, res) => {
  try {
    const { projectIds } = req.body || {};

    if (!Array.isArray(projectIds) || projectIds.length === 0 || projectIds.some((id) => typeof id !== 'string' || !id)) {
      return res.status(400).json({ message: 'projectIds must be a non-empty array' });
    }
    const uniqueProjectIds = [...new Set(projectIds)];

    const { error } = await getClient()
      .from(TABLE)
      .delete()
      .in('id', uniqueProjectIds);

    if (error) throw error;

    res.json({ message: `Deleted ${uniqueProjectIds.length} projects` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new project
router.post('/', upload.array('images', 10), async (req, res) => {
  const { title, developer, source, visit, disc, rate, langs, techs, types, type, date, showOnCompanySite } = req.body;

  const parsedLangs = typeof langs === 'string' ? JSON.parse(langs) : langs;
  const parsedTechs = typeof techs === 'string' ? JSON.parse(techs) : techs;

  let parsedTypes;
  if (types) {
    parsedTypes = typeof types === 'string' ? JSON.parse(types) : types;
  } else {
    parsedTypes = type ? [type] : [];
  }

  const imageUrls = req.files ? req.files.map((f) => f.path) : [];

  const projectData = {
    title,
    developer,
    source,
    visit,
    disc,
    rate,
    langs: parsedLangs || [],
    techs: parsedTechs || [],
    type: JSON.stringify(parsedTypes),
    date,
    image: JSON.stringify(imageUrls),
    // Booleans arrive as strings in multipart form data; default to visible
    show_on_company_site: showOnCompanySite === 'true' || showOnCompanySite === true,
  };

  try {
    const { data, error } = await getClient()
      .from(TABLE)
      .insert(projectData)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(mapProject(data));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a project
router.put('/:id', upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, developer, source, visit, disc, rate, langs, techs, types, type, date, existingImages, showOnCompanySite } = req.body;

    const { data: existing, error: findError } = await getClient()
      .from(TABLE)
      .select('id')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updateData = { title, developer, source, visit, disc, rate, date };
    if (showOnCompanySite !== undefined) {
      updateData.show_on_company_site = showOnCompanySite === 'true' || showOnCompanySite === true;
    }

    let parsedTypes;
    if (types) {
      parsedTypes = typeof types === 'string' ? JSON.parse(types) : types;
    } else if (type) {
      parsedTypes = [type];
    }
    if (parsedTypes) updateData.type = JSON.stringify(parsedTypes);

    if (langs) updateData.langs = typeof langs === 'string' ? JSON.parse(langs) : langs;
    if (techs) updateData.techs = typeof techs === 'string' ? JSON.parse(techs) : techs;

    let keptImages = [];
    if (existingImages) {
      keptImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
    }
    const newImageUrls = req.files ? req.files.map((f) => f.path) : [];
    if (existingImages !== undefined || req.files) {
      updateData.image = JSON.stringify([...keptImages, ...newImageUrls]);
    }

    const { data, error } = await getClient()
      .from(TABLE)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(mapProject(data));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: existing, error: findError } = await getClient()
      .from(TABLE)
      .select('id')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { error } = await getClient()
      .from(TABLE)
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
