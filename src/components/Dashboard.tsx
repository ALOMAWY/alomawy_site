import {
  faAt,
  faChessPawn,
  faCode,
  faEye,
  faImage,
  faLanguage,
  faPen,
  faPenToSquare,
  faSignature,
  faStar,
  faTrash,
  faPlus,
  faSave,
  faTimes,
  faRightFromBracket,
  faChartLine,
  faFolderOpen,
  faGear,
  faChartBar,
  faSearch,
  faFilter,
  faArrowDownShortWide,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { signOut } from "../redux/adminSign";
import { useMyContext } from "./Context";
import { getProjectTypeStyle } from "../utils";
import AdminOverview from "./AdminOverview";
import AdminStatistics from "./AdminStatistics";
import AdminSettings from "./AdminSettings";

const API_URL = import.meta.env.VITE_API_URL;

const PanelWrapper = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;

  @media (max-width: 768px) {
    padding: 0 0.75rem;
    margin: 1rem auto;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }

  .header-title {
    font-size: 1.2rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #fff;
  }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgba(231, 76, 60, 0.15);
    border: 1px solid rgba(231, 76, 60, 0.3);
    border-radius: 12px;
    color: #e74c3c;
    font-weight: 800;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all var(--q-transition-speed) var(--q-transition-ease);
    white-space: nowrap;

    &:hover {
      background: rgba(231, 76, 60, 0.25);
      border-color: #e74c3c;
    }
  }
`;

const TabBar = styled.div`
  display: flex;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: var(--q-blur-dashboard);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 6px;
  margin-bottom: 2rem;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar { display: none; }

  @media (max-width: 768px) {
    backdrop-filter: var(--q-blur-dashboard-sm);
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.25rem;
  border-radius: 14px;
  border: 1px solid transparent;
  background: ${props => props.$active ? 'rgba(var(--main-color-rgb), 0.15)' : 'transparent'};
  border-color: ${props => props.$active ? 'rgba(var(--main-color-rgb), 0.3)' : 'transparent'};
  color: ${props => props.$active ? 'var(--main-color)' : 'rgba(255,255,255,0.4)'};
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all var(--q-transition-speed) var(--q-transition-ease);
  white-space: nowrap;

  svg {
    font-size: 0.85rem;
  }

  &:hover:not([disabled]) {
    background: ${props => props.$active ? 'rgba(var(--main-color-rgb), 0.2)' : 'rgba(255,255,255,0.05)'};
    color: ${props => props.$active ? 'var(--main-color)' : 'rgba(255,255,255,0.6)'};
  }

  @media (max-width: 768px) {
    min-width: 70px;
    padding: 0.7rem 0.75rem;
    font-size: 0.6rem;
    gap: 0.35rem;
  }
`;

const TabContent = styled.div`
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: var(--q-blur-dashboard);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 32px;
  padding: 2rem;
  color: #fff;

  @media (max-width: 768px) {
    backdrop-filter: var(--q-blur-dashboard-sm);
    padding: 1rem;
    border-radius: 24px;
  }
`;

const Styled_Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .header {
    text-align: center;
    margin-bottom: 1rem;

    h2 {
      font-size: 1.5rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      opacity: 0.9;
    }

    .line {
      width: 60px;
      height: 4px;
      background: var(--main-color);
      margin: 1rem auto;
      border-radius: 2px;
      opacity: 0.5;
    }
  }

  .grid-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    label {
      font-size: 0.7rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.4;
      margin-left: 1rem;
    }

    .field {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      transition: all var(--q-transition-speed) var(--q-transition-ease);

      &:focus-within {
        background: rgba(255, 255, 255, 0.06);
        border-color: var(--main-color);
        box-shadow: 0 0 15px rgba(var(--main-color-rgb), 0.2);
      }

      svg { color: var(--main-color); opacity: 0.6; }

      input, textarea, select {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: #fff;
        font-size: 0.9rem;
        &::placeholder { opacity: 0.2; }
      }
    }
  }

  .selection-box {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    padding: 1.5rem;
    height: 100%;

    .title {
      font-size: 0.7rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.4;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      svg { color: var(--main-color); }
    }

    .options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;

      .option {
        position: relative;
        label {
          display: block;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid transparent;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 900;
          text-transform: uppercase;
          cursor: pointer;
          transition: all var(--q-transition-speed) var(--q-transition-ease);
          opacity: 0.4;
        }
        input { display: none; }
        input:checked + label {
          background: rgba(var(--main-color-rgb), 0.2);
          border-color: var(--main-color);
          opacity: 1;
          box-shadow: 0 4px 12px rgba(var(--main-color-rgb), 0.1);
        }
        &:hover label { opacity: 0.8; background: rgba(255, 255, 255, 0.08); }
      }
    }
  }

  .image-upload-container {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    align-items: center;
  }

  button[type="submit"] {
    margin-top: 1rem;
    padding: 1.5rem;
    background: var(--main-color);
    border-radius: 24px;
    font-weight: 900;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    box-shadow: 0 10px 20px rgba(var(--main-color-rgb), 0.3);
    transition: all var(--q-transition-speed) var(--q-transition-ease);

    &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(var(--main-color-rgb), 0.4); filter: brightness(1.1); }
    &:active:not(:disabled) { transform: translateY(0); }
    &:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }
  }

  @media (max-width: 768px) {
    .header h2 { font-size: 1.2rem; }
    .input-group {
      label { margin-left: 0; justify-content: center; display: flex; }
    }
    .selection-box .title { justify-content: center; }
    .selection-box .options { justify-content: center; }
    .selection-box.image-upload-container { justify-content: center; }
    .image-upload-container { justify-content: center; }
    .grid-section { grid-template-columns: 1fr; }
  }
`;

const StyledTable = styled.div`
  margin-top: 2rem;
  overflow: hidden;

  h3 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    opacity: 0.8;
    color: var(--main-color);
  }

  .toolbar {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;

    .search-box {
      flex: 1;
      min-width: 200px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      transition: all var(--q-transition-speed) var(--q-transition-ease);

      svg { color: var(--main-color); opacity: 0.5; font-size: 0.85rem; }

      input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: #fff;
        font-size: 0.8rem;
        &::placeholder { opacity: 0.25; }
      }

      &:focus-within {
        border-color: var(--main-color);
        box-shadow: 0 0 12px rgba(var(--main-color-rgb), 0.15);
      }
    }

    .filter-select, .sort-select {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all var(--q-transition-speed) var(--q-transition-ease);

      svg { color: var(--main-color); opacity: 0.5; font-size: 0.75rem; }

      select {
        background: transparent;
        border: none;
        outline: none;
        color: #fff;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        appearance: none;
        text-transform: uppercase;
        letter-spacing: 0.5px;

        option {
          background: #1a1a2e;
          color: #fff;
        }
      }

      &:focus-within {
        border-color: var(--main-color);
      }
    }

    .count-badge {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.25rem;
      background: rgba(var(--main-color-rgb), 0.08);
      border: 1px solid rgba(var(--main-color-rgb), 0.15);
      border-radius: 14px;
      font-size: 0.7rem;
      font-weight: 900;
      color: var(--main-color);
      white-space: nowrap;

      span { opacity: 0.4; margin-left: 0.35rem; }
    }

    @media (max-width: 768px) {
      flex-direction: column;
      .search-box { min-width: unset; }
    }
  }

  .table-wrapper {
    overflow-x: auto;
    width: 100%;
    scrollbar-width: thin;
    scrollbar-color: var(--main-color) rgba(255, 255, 255, 0.05);
    &::-webkit-scrollbar { height: 6px; }
    &::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
    &::-webkit-scrollbar-thumb { background: var(--main-color); border-radius: 10px; }
  }

  table {
    width: 100%;
    min-width: 800px;
    border-collapse: separate;
    border-spacing: 0 0.75rem;

    th {
      padding: 1.5rem 1rem;
      text-align: left;
      font-size: 0.65rem;
      text-transform: uppercase;
      opacity: 0.4;
      letter-spacing: 0.2em;
      font-weight: 900;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    td {
      padding: 1.25rem 1rem;
      font-size: 0.9rem;
      background: rgba(255, 255, 255, 0.02);
      transition: all var(--q-transition-speed) var(--q-transition-ease);
      vertical-align: middle;
      &:first-child { border-radius: 16px 0 0 16px; }
      &:last-child { border-radius: 0 16px 16px 0; }
    }

    tr:hover td {
      background: rgba(255, 255, 255, 0.05);
      transform: translateY(-2px);
    }

    .project-info {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      img { width: 60px; height: 60px; object-fit: cover; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; }
      .title { font-weight: 700; letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; }
    }

    .category-badge {
      display: inline-block;
      padding: 6px 12px;
      background: rgba(var(--main-color-rgb), 0.1);
      border: 1px solid rgba(var(--main-color-rgb), 0.2);
      border-radius: 8px;
      font-size: 0.7rem;
      font-weight: 900;
      text-transform: uppercase;
      color: var(--main-color);
      white-space: nowrap;
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;

      button {
        width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
        cursor: pointer; transition: all var(--q-transition-speed) var(--q-transition-ease);
        border-radius: 12px; font-size: 0.9rem;

        &.edit { color: #3498db; &:hover { background: rgba(52,152,219,0.15); border-color: #3498db; transform: translateY(-2px); } }
        &.delete { color: #e74c3c; &:hover { background: rgba(231,76,60,0.15); border-color: #e74c3c; transform: translateY(-2px); } }
      }
    }
  }

  @media (max-width: 768px) {
    table, thead, tbody, th, td, tr { display: block; width: 100%; min-width: unset; }
    thead { display: none; }
    tr {
      background: rgba(255,255,255,0.05); backdrop-filter: var(--q-blur-dashboard-mobile);
      border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem;
      border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; box-sizing: border-box;
    }
    td {
      padding: 1rem 0; background: transparent !important; display: grid !important;
      grid-template-columns: 1fr auto; align-items: center; border: none !important;
      border-bottom: 1px solid rgba(255,255,255,0.05) !important;
      &:first-child { padding-top: 0; border-radius: 0; }
      &:last-child { padding-bottom: 0; border-bottom: none !important; border-radius: 0; }
      &::before { content: attr(data-label) ": "; font-size: 0.7rem; text-transform: uppercase; opacity: 0.4; font-weight: 900; letter-spacing: 0.15em; color: #fff; }
      &:first-child { display: flex !important; justify-content: flex-start; gap: 1.5rem; &::before { display: none; } .project-info { width: 100%; .title { font-size: 1.1rem; font-weight: 800; color: #3498db; white-space: normal; } } }
      .category-badge, .actions { justify-self: end; }
      .category-badge { padding: 8px 16px; background: rgba(52,152,219,0.1); border: 1px solid rgba(52,152,219,0.3); border-radius: 12px; color: #3498db; }
      .actions { button { width: 48px; height: 48px; border-radius: 16px; &.edit { color: #3498db; } &.delete { color: #e74c3c; } } }
    }
    tr:hover td { transform: none; }
  }
`;

type TabKey = "overview" | "projects" | "statistics" | "settings";

const Dashboard = () => {
  const { t } = useTranslation();
  const { setNewProject } = useMyContext();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const languages = ["arabic", "english"];
  const technologies = [
    "html", "css", "javascript", "typescript", "react", "redux", "sass",
    "bootstrap", "tailwind", "vite", "webpack", "gulp", "eslint",
    "prettier", "nextjs", "axios", "formik", "yup", "reactRouter",
    "firebase", "zustand",
  ];

  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("20");
  const [type, setType] = useState("website");
  const [techs, setTechs] = useState<string[]>(["html", "css", "javascript"]);
  const [langs, setLangs] = useState<string[]>(["english"]);
  const [image, setImage] = useState<{ file: null | File; url: string }>({ file: null, url: "" });
  const [error, setError] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const initialProjectData = {
    title: "",
    developer: "",
    source: "",
    visit: "",
    disc: "",
    rate: "20",
    image: "",
    langs: ["english"],
    techs: ["html", "css", "javascript"],
    type: "website",
  };

  const [projectData, setProjectData] = useState(initialProjectData);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      // Failed to fetch
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects
    .filter((p) => {
      const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || p.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      if (sortBy === "rated") return (+b.rate || 0) - (+a.rate || 0);
      if (sortBy === "alpha") return (a.title || "").localeCompare(b.title || "");
      return 0;
    });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (technologies.includes(name)) {
      const checkbox = e.target as HTMLInputElement;
      if (checkbox.checked) setTechs((prev) => [...prev, name]);
      else setTechs((prev) => prev.filter((el) => el !== name));
    } else if (languages.includes(name)) {
      const checkbox = e.target as HTMLInputElement;
      if (checkbox.checked) setLangs((prev) => [...prev, name]);
      else setLangs((prev) => prev.filter((el) => el !== name));
    } else if (name == "type") {
      setType(value);
    } else if (name == "title" || name == "developer" || name == "source" || name == "visit" || name == "disc") {
      setProjectData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    setProjectData((prev) => ({ ...prev, langs, techs, type, rate: range, image: image.url }));
  }, [langs, techs, type, range, image.url]);

  const handleRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRange(e.target.value);
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(projectData).forEach(([key, value]) => {
      if (['_id', '__v', 'createdAt', 'image'].includes(key)) return;
      if (key === 'langs' || key === 'techs') formData.append(key, JSON.stringify(value));
      else formData.append(key, value as string);
    });

    if (image.file) formData.append('image', image.file);

    try {
      const url = editId ? `${API_URL}/api/projects/${editId}` : `${API_URL}/api/projects`;
      const method = editId ? 'PUT' : 'POST';
      const response = await fetch(url, { method, body: formData });
      if (!response.ok) throw new Error('Failed to save project');
      setNewProject((prev) => !prev);
      handleReset();
      fetchProjects();
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("dashboard.confirm_delete") || "Are you sure you want to delete this project?")) return;
    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete project');
      setNewProject((prev) => !prev);
      fetchProjects();
    } catch (error) {
      // Failed to delete
    }
  };

  const handleEdit = (project: any) => {
    setActiveTab("projects");
    setEditId(project._id);
    setProjectData(project);
    setTechs(project.techs);
    setLangs(project.langs);
    setType(project.type);
    setRange(project.rate);
    setImage({ file: null, url: project.image?.startsWith('/uploads') ? `${API_URL}${project.image}` : project.image });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditId(null);
    setProjectData(initialProjectData);
    setTechs(["html", "css", "javascript"]);
    setLangs(["english"]);
    setType("website");
    setRange("20");
    setImage({ file: null, url: "" });
  };

  const tabs: { key: TabKey; icon: any; labelKey: string }[] = [
    { key: "overview", icon: faFolderOpen, labelKey: "admin.tab_overview" },
    { key: "projects", icon: faChessPawn, labelKey: "admin.tab_projects" },
    { key: "statistics", icon: faChartBar, labelKey: "admin.tab_statistics" },
    { key: "settings", icon: faGear, labelKey: "admin.tab_settings" },
  ];

  return (
    <PanelWrapper>
      <PanelHeader>
        <div className="header-title">{t("admin.panel_title")}</div>
        <button className="logout-btn" onClick={() => dispatch(signOut())}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          {t("admin.logout")}
        </button>
      </PanelHeader>

      <TabBar>
        {tabs.map((tab) => (
          <Tab key={tab.key} $active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
            <FontAwesomeIcon icon={tab.icon} />
            {t(tab.labelKey)}
          </Tab>
        ))}
      </TabBar>

      <TabContent>
        {activeTab === "overview" && (
          <AdminOverview projects={projects} />
        )}

        {activeTab === "projects" && (
          <>
            <Styled_Form onSubmit={handleAdd} onReset={handleReset}>
              <div className="header">
                <h2>{editId ? t("dashboard.edit_project") || "Edit Project" : t("dashboard.add_project") || "Add New Project"}</h2>
                <div className="line" />
              </div>

              <div className="grid-section">
                <div className="input-group">
                  <label htmlFor="title">{t("dashboard.projectName")}</label>
                  <div className="field">
                    <FontAwesomeIcon icon={faSignature} />
                    <input type="text" placeholder="Project Title" id="title" name="title" value={projectData.title} onChange={handleChange} required />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="developer">{t("dashboard.developerName")}</label>
                  <div className="field">
                    <FontAwesomeIcon icon={faAt} />
                    <input type="text" placeholder="Developer" name="developer" id="developer" value={projectData.developer} onChange={handleChange} required />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="source">{t("dashboard.idea_source")}</label>
                  <div className="field">
                    <FontAwesomeIcon icon={faPen} />
                    <input type="text" placeholder="Idea Source" id="source" name="source" value={projectData.source} onChange={handleChange} required />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="visit">{t("dashboard.visit_link")}</label>
                  <div className="field">
                    <FontAwesomeIcon icon={faEye} />
                    <input type="url" placeholder="https://..." id="visit" name="visit" value={projectData.visit} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="description">{t("dashboard.disc")}</label>
                <div className="field">
                  <FontAwesomeIcon icon={faPenToSquare} />
                  <textarea placeholder="Tell us about the project..." id="description" name="disc" value={projectData.disc} onChange={handleChange} required rows={4} />
                </div>
              </div>

              <div className="grid-section">
                <div className="selection-box">
                  <div className="title"><FontAwesomeIcon icon={faChessPawn} />{t("portfolio.type") || "Project Category"}</div>
                  <div className="options">
                    {["website", "game", "simple", "dashboard", "app"].map((val) => (
                      <div key={val} className="option">
                        <input type="radio" onChange={handleChange} name="type" id={val} value={val} checked={type == val} />
                        <label htmlFor={val}>{t(`portfolio.category.${val}`)}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="selection-box">
                  <div className="title"><FontAwesomeIcon icon={faCode} />{t("portfolio.techs") || "Technologies Used"}</div>
                  <div className="options">
                    {technologies.map((tech) => (
                      <div key={tech} className="option">
                        <input type="checkbox" name={tech} id={tech} onChange={handleChange} checked={techs.includes(tech)} />
                        <label htmlFor={tech}>{tech.toUpperCase()}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid-section">
                <div className="selection-box">
                  <div className="title"><FontAwesomeIcon icon={faLanguage} />{t("portfolio.langs") || "Languages"}</div>
                  <div className="options">
                    <div className="option">
                      <input type="checkbox" name="arabic" onChange={handleChange} id="arabic" checked={langs.includes("arabic")} />
                      <label htmlFor="arabic">Arabic</label>
                    </div>
                    <div className="option">
                      <input type="checkbox" name="english" onChange={handleChange} id="english" checked={langs.includes("english")} />
                      <label htmlFor="english">English</label>
                    </div>
                  </div>
                </div>

                <div className="selection-box">
                  <div className="title"><FontAwesomeIcon icon={faStar} />{t("dashboard.rate")}</div>
                  <div style={{ position: 'relative', marginTop: '1rem' }}>
                    <input type="range" name="range" id="rate" style={{ opacity: "0", height: "40px", width: '100%', cursor: 'pointer', zIndex: 2, position: 'relative' }} onChange={handleRange} value={range} />
                    <div style={{ width: "100%", height: "8px", top: "16px", backgroundColor: "rgba(255,255,255,0.05)", position: "absolute", borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: range + "%", height: "100%", background: `linear-gradient(to right, ${+range > 80 ? '#2ecc71' : +range > 40 ? '#3498db' : '#e67e22'}, var(--main-color))`, boxShadow: `0 0 10px ${+range > 40 ? 'rgba(52,152,219,0.4)' : 'rgba(230,126,34,0.4)'}` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="selection-box">
                <div className="title"><FontAwesomeIcon icon={faImage} />{t("dashboard.projectImage") || "Project Image"}</div>
                <div className="image-upload-container">
                  <label htmlFor="image" style={{ display: "flex", flexDirection: 'column', alignItems: "center", gap: "1rem", cursor: 'pointer', padding: '2rem', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '24px', width: '240px' }}>
                    <FontAwesomeIcon icon={faImage} size="2x" />
                    <span style={{ color: "var(--main-color)", fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase' }}>
                      {uploadingImage ? t("dashboard.uploading") : t("dashboard.select_image")}
                    </span>
                  </label>

                  {(image.url || projectData.image) && (
                    <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', width: '320px', height: '180px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <img src={image.url || projectData.image || "./assets/project-placeholder.png"} alt="Preview" style={{ width: "100%", height: "100%", objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
                <input style={{ display: "none" }} type="file" name="image" id="image" onChange={handleImage} disabled={uploadingImage} />
              </div>

              {error && <div style={{ color: '#e74c3c', textAlign: 'center', fontWeight: 'bold' }}>{t("dashboard.check_fields") || "Please check all fields."}</div>}

              <button type="submit" disabled={loading || uploadingImage}>
                {uploadingImage ? t("dashboard.uploadingImage") : loading ? t("info.loading") : editId ? (
                  <><FontAwesomeIcon icon={faSave} style={{ marginRight: '10px' }} />{t("dashboard.save") || "Update Project"}</>
                ) : (
                  <><FontAwesomeIcon icon={faPlus} style={{ marginRight: '10px' }} />{t("dashboard.add")}</>
                )}
              </button>

              {editId && (
                <button type="button" onClick={handleReset} style={{ background: 'rgba(255,255,255,0.1)', marginTop: '1rem' }}>
                  <FontAwesomeIcon icon={faTimes} style={{ marginRight: '10px' }} />
                  {t("dashboard.cancel") || "Cancel Edit"}
                </button>
              )}
            </Styled_Form>

            <StyledTable>
              <h3>{t("dashboard.manage_projects")}</h3>

              <div className="toolbar">
                <div className="search-box">
                  <FontAwesomeIcon icon={faSearch} />
                  <input type="text" placeholder={t("admin.search_projects")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>

                <div className="filter-select">
                  <FontAwesomeIcon icon={faFilter} />
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">{t("portfolio.category.all")}</option>
                    {["website", "game", "simple", "dashboard", "app"].map((val) => (
                      <option key={val} value={val}>{t(`portfolio.category.${val}`)}</option>
                    ))}
                  </select>
                </div>

                <div className="sort-select">
                  <FontAwesomeIcon icon={faArrowDownShortWide} />
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">{t("admin.sort_newest")}</option>
                    <option value="oldest">{t("admin.sort_oldest")}</option>
                    <option value="rated">{t("admin.sort_rated")}</option>
                    <option value="alpha">{t("admin.sort_alpha")}</option>
                  </select>
                </div>

                <div className="count-badge">
                  {filteredProjects.length}<span>/ {projects.length}</span>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>{t("dashboard.projectName")}</th>
                      <th>{t("portfolio.type")}</th>
                      <th style={{ textAlign: "right" }}>{t("dashboard.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project._id}>
                        <td data-label={t("dashboard.projectName")}>
                          <div className="project-info">
                            <img src={project.image?.startsWith("/uploads") ? `${API_URL}${project.image}` : project.image || "./assets/project-placeholder.png"} alt="" />
                            <span className="title">{project.title}</span>
                          </div>
                        </td>
                        <td data-label={t("portfolio.type")}>
                          <span className="category-badge" style={{ backgroundColor: getProjectTypeStyle(project.type).accentBg, borderColor: getProjectTypeStyle(project.type).color + "50", color: getProjectTypeStyle(project.type).color }}>
                            {t(`portfolio.category.${project.type}`)}
                          </span>
                        </td>
                        <td data-label={t("dashboard.actions")}>
                          <div className="actions">
                            <button className="edit" title={t("dashboard.edit")} onClick={() => handleEdit(project)}>
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                            <button className="delete" title={t("dashboard.delete")} onClick={() => handleDelete(project._id)}>
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </StyledTable>
          </>
        )}

        {activeTab === "statistics" && (
          <AdminStatistics projects={projects} />
        )}

        {activeTab === "settings" && (
          <AdminSettings />
        )}
      </TabContent>
    </PanelWrapper>
  );
};

export default Dashboard;
