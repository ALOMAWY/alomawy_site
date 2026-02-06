import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  developer: { type: String, required: true },
  source: { type: String, required: true },
  visit: { type: String },
  disc: { type: String, required: true },
  rate: { type: String, default: "20" },
  image: { type: String }, // Path or URL
  langs: [{ type: String }],
  techs: [{ type: String }],
  type: { type: String, required: true },
  date: { type: String }, // Custom date string (e.g., "Feb 2024")
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
