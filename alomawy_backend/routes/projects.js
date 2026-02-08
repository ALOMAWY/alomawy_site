import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Project from '../models/Project.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error('CRITICAL: Cloudinary credentials missing in environment variables!');
}

// Configure Multer with Cloudinary Storage
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
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new project
router.post('/', upload.single('image'), async (req, res) => {
  const { title, developer, source, visit, disc, rate, langs, techs, type, date } = req.body;
  
  // Parse arrays if they come as strings (from FormData)
  const parsedLangs = typeof langs === 'string' ? JSON.parse(langs) : langs;
  const parsedTechs = typeof techs === 'string' ? JSON.parse(techs) : techs;

  const project = new Project({
    title,
    developer,
    source,
    visit,
    disc,
    rate,
    langs: parsedLangs,
    techs: parsedTechs,
    type,
    date,
    image: req.file ? req.file.path : '',
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a project
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, developer, source, visit, disc, rate, langs, techs, type, date } = req.body;
    
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updateData = {
      title,
      developer,
      source,
      visit,
      disc,
      rate,
      type,
      date,
    };

    if (langs) updateData.langs = typeof langs === 'string' ? JSON.parse(langs) : langs;
    if (techs) updateData.techs = typeof techs === 'string' ? JSON.parse(techs) : techs;

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedProject);
  } catch (err) {
    console.error('Update error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // For now, removing the MongoDB entry. 
    // In a production app, you might also want to delete the asset from Cloudinary using cloudinary.uploader.destroy()
    
    await Project.findByIdAndDelete(id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
