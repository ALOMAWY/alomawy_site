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

// Add a new project
router.post('/', upload.array('images', 10), async (req, res) => {
  const { title, developer, source, visit, disc, rate, langs, techs, types, type, date } = req.body;

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
    const { title, developer, source, visit, disc, rate, langs, techs, types, type, date, existingImages } = req.body;

    const { data: existing, error: findError } = await getClient()
      .from(TABLE)
      .select('id')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updateData = { title, developer, source, visit, disc, rate, date };

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
