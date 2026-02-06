import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Project from '../models/Project.js';

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const uploadPath = path.resolve(__dirname, '../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
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
  console.log('Received POST request to add project:', req.body);
  if (req.file) console.log('File uploaded:', req.file.filename);
  
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
    image: req.file ? `/uploads/${req.file.filename}` : '',
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
