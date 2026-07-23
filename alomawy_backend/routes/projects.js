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

// Add a new project
router.post('/', upload.single('image'), async (req, res) => {
  const { title, developer, source, visit, disc, rate, langs, techs, type, date } = req.body;

  const parsedLangs = typeof langs === 'string' ? JSON.parse(langs) : langs;
  const parsedTechs = typeof techs === 'string' ? JSON.parse(techs) : techs;

  const projectData = {
    title,
    developer,
    source,
    visit,
    disc,
    rate,
    langs: parsedLangs || [],
    techs: parsedTechs || [],
    type,
    date,
    image: req.file ? req.file.path : '',
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
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, developer, source, visit, disc, rate, langs, techs, type, date } = req.body;

    const { data: existing, error: findError } = await getClient()
      .from(TABLE)
      .select('id')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updateData = { title, developer, source, visit, disc, rate, type, date };

    if (langs) updateData.langs = typeof langs === 'string' ? JSON.parse(langs) : langs;
    if (techs) updateData.techs = typeof techs === 'string' ? JSON.parse(techs) : techs;
    if (req.file) updateData.image = req.file.path;

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
