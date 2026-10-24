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
  faCropSimple,
  faCheck,
  faRightFromBracket,
  faChartBar,
  faFolderOpen,
  faGear,
  faSearch,
  faFilter,
  faArrowDownShortWide,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { signOut } from "../redux/adminSign";
import { useMyContext } from "./Context";
import { getProjectTypeStyle, ALL_PROJECT_TYPES } from "../utils";
import AdminOverview from "./AdminOverview";
import AdminStatistics from "./AdminStatistics";
import AdminSettings from "./AdminSettings";
import Cropper from "react-easy-crop";

const API_URL = import.meta.env.VITE_API_URL;

const techCategories = {
  frontend: {
    languages: ["html", "css", "javascript", "typescript"],
    frameworks: ["react", "vue", "angular", "nextjs", "redux", "zustand", "reactRouter", "formik", "yup", "axios"],
    styling: ["sass", "bootstrap", "tailwind", "styled-components"],
    buildTools: ["vite", "webpack", "gulp"],
    codeQuality: ["eslint", "prettier"],
  },
  backend: {
    runtime: ["nodejs"],
    frameworks: ["express", "nestjs"],
    databases: ["mongodb", "postgresql", "mysql", "redis"],
    baas: ["firebase", "supabase"],
    api: ["graphql", "rest"],
    devops: ["docker", "git", "github", "gitlab", "ci/cd"],
    tools: ["npm", "yarn", "postman", "figma"],
  },
};

const languages = ["arabic", "english"];

const PanelWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  overflow-x: clip;
  color: #f4f6fb;
  background: #0b1220;
`;

const DashboardLayout = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const DashboardSidebar = styled.aside`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  background: rgba(8, 14, 26, 0.94);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  @media (max-width: 900px) {
    position: static;
    height: auto;
    padding: 0.75rem;
    border-right: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
`;

const DashboardBrand = styled.div`
  padding: 0.6rem 0.75rem 1.7rem;
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  span {
    display: block;
    margin-top: 0.3rem;
    color: rgba(255, 255, 255, 0.42);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  @media (max-width: 900px) { display: none; }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 112px;
  padding: 1.5rem clamp(1rem, 3vw, 2.5rem);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: 1.25rem;
  flex-wrap: wrap;
  .header-title { font-size: 1.35rem; font-weight: 750; color: #fff; letter-spacing: -0.02em; }
  .header-description { color: rgba(226, 232, 240, 0.58); font-size: 0.82rem; margin-top: 0.45rem; }
  .header-actions { display: flex; align-items: center; gap: 0.65rem; }
  .project-total { color: rgba(226, 232, 240, 0.65); font-size: 0.78rem; white-space: nowrap; }
  .create-project-btn {
    display: inline-flex; align-items: center; gap: 0.55rem; padding: 0.75rem 1rem;
    border-radius: 10px; background: var(--main-color); color: #fff; font-weight: 700;
    &:hover { filter: brightness(1.1); transform: translateY(-1px); }
  }
  .logout-btn {
    display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; color: rgba(226,232,240,0.72); font-weight: 650; font-size: 0.78rem;
    transition: all var(--q-transition-speed) var(--q-transition-ease); white-space: nowrap;
    &:hover { background: rgba(231, 76, 60, 0.14); border-color: rgba(231,76,60,0.4); color: #ff827a; }
  }
  @media (max-width: 900px) {
    min-height: 84px;
    padding: 1rem;
  }
  @media (max-width: 560px) {
    align-items: flex-start;
    .header-actions { width: 100%; flex-wrap: wrap; }
    .project-total { width: 100%; }
    .create-project-btn { flex: 1; justify-content: center; }
    .logout-btn { padding: 0.7rem 0.85rem; }
  }
`;

const TabBar = styled.div`
  display: flex; flex-direction: column; gap: 0.35rem;
  &::-webkit-scrollbar { display: none; }
  @media (max-width: 900px) {
    flex-direction: row;
    overflow-x: auto;
    scrollbar-width: none;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex; align-items: center; gap: 0.8rem; padding: 0.8rem 0.9rem; border-radius: 10px;
  color: ${p => p.$active ? '#fff' : 'rgba(226,232,240,0.58)'};
  background: ${p => p.$active ? 'rgba(var(--main-color-rgb), 0.18)' : 'transparent'};
  border: 1px solid ${p => p.$active ? 'rgba(var(--main-color-rgb), 0.34)' : 'transparent'};
  font-size: 0.82rem; font-weight: ${p => p.$active ? 700 : 550};
  cursor: pointer; transition: all var(--q-transition-speed) var(--q-transition-ease); white-space: nowrap;
  text-align: left;
  svg { width: 1rem; font-size: 0.9rem; color: ${p => p.$active ? 'var(--main-color)' : 'rgba(226,232,240,0.45)'}; }
  &:hover:not([disabled]) {
    background: ${p => p.$active ? 'rgba(var(--main-color-rgb), 0.22)' : 'rgba(255,255,255,0.045)'};
    color: #fff;
  }
  @media (max-width: 900px) { padding: 0.7rem 0.85rem; }
`;

const TabContent = styled.div`
  min-width: 0;
  padding: 1.5rem clamp(1rem, 3vw, 2.5rem) 3rem;
  color: #fff;
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  padding: 1.25rem 0.75rem 0.25rem;
  color: rgba(226, 232, 240, 0.38);
  font-size: 0.7rem;
  @media (max-width: 900px) { display: none; }
`;

const BulkModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(3, 8, 16, 0.78);
  backdrop-filter: blur(8px);
  @media (max-width: 640px) {
    place-items: start center;
    padding: max(0.5rem, env(safe-area-inset-top)) 0.5rem max(0.5rem, env(safe-area-inset-bottom));
  }
`;

const BulkModal = styled.div`
  width: min(860px, 100%);
  max-height: min(90vh, 900px);
  overflow: auto;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 18px;
  background: #111a2b;
  box-shadow: 0 24px 80px rgba(0,0,0,0.55);
  color: #f4f6fb;
  @media (max-width: 640px) {
    width: 100%;
    max-height: calc(100dvh - 1rem);
    border-radius: 14px;
  }
`;

const BulkModalHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: #111a2b;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  h2 { font-size: 1.05rem; font-weight: 750; }
  p { color: rgba(226,232,240,0.55); font-size: 0.78rem; margin-top: 0.35rem; }
  @media (max-width: 640px) { padding: 1rem; }
`;

const BulkModalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
  padding: 1.25rem 1.5rem;
  @media (max-width: 640px) { grid-template-columns: minmax(0, 1fr); padding: 0.75rem; gap: 0.6rem; }
`;

const BulkField = styled.div`
  min-width: 0;
  padding: 0.95rem;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  background: rgba(255,255,255,0.025);
  &.wide { grid-column: 1 / -1; }
  .bulk-field-title { display: flex; align-items: center; gap: 0.55rem; margin-bottom: 0.7rem; color: #e8edf7; font-size: 0.78rem; font-weight: 650; }
  .bulk-input, .bulk-select, .bulk-textarea {
    width: 100%; padding: 0.65rem 0.75rem; border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1); background: #0c1422; color: #fff;
    &:focus { border-color: var(--main-color); }
    &:disabled { opacity: 0.38; cursor: not-allowed; }
  }
  .bulk-textarea { min-height: 88px; resize: vertical; }
  @media (max-width: 640px) { padding: 0.75rem; }
`;

const BulkChoiceGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  &.disabled { opacity: 0.38; pointer-events: none; }
`;

const BulkChoice = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.6rem;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  color: rgba(226,232,240,0.78);
  background: rgba(255,255,255,0.035);
  font-size: 0.72rem;
  cursor: pointer;
`;

const BulkModalFooter = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  padding: 1rem 1.5rem;
  background: #111a2b;
  border-top: 1px solid rgba(255,255,255,0.08);
  button { padding: 0.7rem 1rem; border-radius: 9px; font-size: 0.78rem; font-weight: 650; }
  .cancel { border: 1px solid rgba(255,255,255,0.12); color: rgba(226,232,240,0.75); }
  .save { background: var(--main-color); color: #fff; }
  @media (max-width: 640px) {
    padding: 0.75rem;
    button { flex: 1; }
  }
`;

const Styled_Form = styled.form`
  display: flex; flex-direction: column; gap: 1.4rem;
  padding: clamp(1rem, 2.5vw, 1.75rem);
  margin-bottom: 2rem;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 16px;
  background: rgba(17, 26, 43, 0.72);
  .header { text-align: left; margin-bottom: 0.2rem;
    h2 { font-size: 1.1rem; font-weight: 750; letter-spacing: -0.01em; opacity: 0.96; }
    .line { display: none; }
  }
  .grid-section { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; @media (max-width: 768px) { grid-template-columns: minmax(0, 1fr); } }
  .input-group { display: flex; flex-direction: column; gap: 0.75rem;
    label { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.4; margin-left: 1rem; }
    .field { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.5rem;
      background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px; transition: all var(--q-transition-speed) var(--q-transition-ease);
      &:focus-within { background: rgba(255, 255, 255, 0.06); border-color: var(--main-color); box-shadow: 0 0 15px rgba(var(--main-color-rgb), 0.2); }
      svg { color: var(--main-color); opacity: 0.6; }
      input, textarea, select { flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 0.9rem; &::placeholder { opacity: 0.2; } }
      select { cursor: pointer; option { background: #1a1a2e; color: #fff; } }
    }
  }
  .selection-box { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px; padding: 1.5rem; height: 100%;
    .title { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.4;
      margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; svg { color: var(--main-color); } }
    .options { display: flex; flex-wrap: wrap; gap: 0.75rem;
      .option { position: relative;
        label { display: block; padding: 8px 16px; background: rgba(255, 255, 255, 0.05);
          border: 1px solid transparent; border-radius: 12px; font-size: 0.7rem; font-weight: 900;
          text-transform: uppercase; cursor: pointer; transition: all var(--q-transition-speed) var(--q-transition-ease); opacity: 0.4; }
        input { display: none; }
        input:checked + label { background: rgba(var(--main-color-rgb), 0.2); border-color: var(--main-color); opacity: 1;
          box-shadow: 0 4px 12px rgba(var(--main-color-rgb), 0.1); }
        &:hover label { opacity: 0.8; background: rgba(255, 255, 255, 0.08); }
      }
    }
  }
  .tech-category { margin-bottom: 1.25rem;
    &:last-child { margin-bottom: 0; }
    .cat-label { font-size: 0.6rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px;
      opacity: 0.3; color: var(--main-color); margin-bottom: 0.75rem; padding-left: 0.25rem; }
  }
  .image-upload-container { display: flex; flex-wrap: wrap; gap: 2rem; align-items: flex-start; }
  .images-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
  .image-thumb { position: relative; border-radius: 16px; overflow: hidden; width: 200px; height: 112px;
    border: 1px solid rgba(255,255,255,0.1); cursor: pointer;
    img { width: 100%; height: 100%; object-fit: cover; }
    .image-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex;
      align-items: center; justify-content: center; gap: 0.5rem; opacity: 0; transition: opacity 0.2s; }
    &:hover .image-overlay { opacity: 1; }
    .image-overlay button { width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15);
      background: rgba(255,255,255,0.1); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; font-size: 0.75rem;
      &:hover { background: rgba(255,255,255,0.2); }
      &.delete-btn:hover { background: rgba(231, 76, 60, 0.3); border-color: #e74c3c; color: #e74c3c; }
    }
  }
  .crop-editor { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--main-color);
    border-radius: 24px; padding: 1.5rem; box-shadow: 0 10px 30px rgba(var(--main-color-rgb), 0.15);
    .crop-editor-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;
      h3 { font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; color: var(--main-color);
        display: flex; align-items: center; gap: 0.5rem; margin: 0; } }
    .crop-container { position: relative; width: 100%; max-width: 640px; margin: 0 auto; height: 360px;
      border-radius: 16px; overflow: hidden; background: #000; }
    .crop-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.25rem; flex-wrap: wrap; }
    .crop-actions button { padding: 0.75rem 2rem; border-radius: 12px; font-weight: 800; font-size: 0.8rem;
      text-transform: uppercase; letter-spacing: 1px; cursor: pointer; border: 1px solid transparent; transition: all 0.2s; }
    .crop-actions .confirm { background: var(--main-color); color: #fff; border-color: var(--main-color);
      &:hover { filter: brightness(1.1); } }
    .crop-actions .cancel { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.2);
      &:hover { background: rgba(255,255,255,0.15); } }
    @media (max-width: 768px) {
      .crop-container { height: 240px; }
      .crop-actions button { padding: 0.7rem 1.4rem; font-size: 0.7rem; }
    }
  }
  .visibility-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    .visibility-text { .visibility-label { font-size: 0.75rem; font-weight: 800; text-transform: uppercase;
        letter-spacing: 0.05em; opacity: 0.8; display: flex; align-items: center; gap: 0.5rem;
        svg { color: var(--main-color); } }
      .visibility-hint { font-size: 0.65rem; opacity: 0.4; margin-top: 0.35rem; max-width: 340px; } } }
  .switch { position: relative; display: inline-block; width: 52px; height: 28px; flex-shrink: 0;
    input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; margin: 0; cursor: pointer; }
    .track { position: absolute; inset: 0; background: rgba(255,255,255,0.12); border-radius: 999px; pointer-events: none;
      transition: background 0.2s;
      &::before { content: ""; position: absolute; height: 22px; width: 22px; left: 3px; top: 3px; background: #fff;
        border-radius: 50%; transition: transform 0.2s; } }
    input:checked + .track { background: var(--main-color);
      &::before { transform: translateX(24px); } }
    input:focus-visible + .track { outline: 2px solid #fff; outline-offset: 2px; } }
  .rate-display { text-align: center; font-size: 1.5rem; font-weight: 900; color: var(--main-color);
    margin-bottom: 0.5rem; }
  button[type="submit"] { margin-top: 1rem; padding: 1.5rem; background: var(--main-color); border-radius: 24px;
    font-weight: 900; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.3em;
    box-shadow: 0 10px 20px rgba(var(--main-color-rgb), 0.3);
    transition: all var(--q-transition-speed) var(--q-transition-ease);
    &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(var(--main-color-rgb), 0.4); filter: brightness(1.1); }
    &:active:not(:disabled) { transform: translateY(0); }
    &:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); } }
  @media (max-width: 768px) {
    .header h2 { font-size: 1.2rem; }
    .input-group label { margin-left: 0.15rem; justify-content: flex-start; display: flex; }
    .input-group .field { gap: 0.65rem; padding: 0.8rem 0.9rem; border-radius: 12px; }
    .selection-box { padding: 1rem; border-radius: 16px; }
    .selection-box .title { justify-content: flex-start; margin-bottom: 1rem; }
    .selection-box .options { justify-content: flex-start; gap: 0.55rem; }
    .grid-section { grid-template-columns: 1fr; }
    .image-upload-container { justify-content: flex-start; gap: 1rem; }
    .image-thumb { width: min(150px, 42vw); height: auto; aspect-ratio: 16 / 9; }
    button[type="submit"] { padding: 1rem; border-radius: 14px; font-size: 0.85rem; letter-spacing: 0.08em; }
  }
`;

const StyledTable = styled.div`
  margin-top: 2rem; overflow: hidden;
  h3 { text-align: left; margin-bottom: 1.1rem; font-size: 1rem; font-weight: 750;
    letter-spacing: -0.01em; color: #f4f6fb; }
  .bulk-selection-toolbar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 0 1rem;
    padding: 0.85rem 1rem;
    border-radius: 12px;
    background: rgba(var(--main-color-rgb),0.08);
    border: 1px solid rgba(var(--main-color-rgb),0.2);
  }
  .bulk-selection-actions { display: flex; align-items: center; gap: 0.6rem; margin-left: auto; }
  .bulk-menu {
    position: absolute; right: 0; top: calc(100% + 0.4rem); z-index: 5; min-width: 220px; padding: 0.35rem;
    border-radius: 10px; background: #111a2b; border: 1px solid rgba(255,255,255,0.12);
    box-shadow: 0 14px 34px rgba(0,0,0,0.4);
    button { width: 100%; padding: 0.7rem; border-radius: 7px; text-align: left; font-size: 0.78rem; }
    .edit-selected { color: #f4f6fb; }
    .delete-selected { color: #ff8179; }
  }
  .toolbar { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;
    .search-box { flex: 1; min-width: 200px; display: flex; align-items: center; gap: 0.75rem;
      padding: 0.75rem 1.25rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px; transition: all var(--q-transition-speed) var(--q-transition-ease);
      svg { color: var(--main-color); opacity: 0.5; font-size: 0.85rem; }
      input { flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 0.8rem; &::placeholder { opacity: 0.25; } }
      &:focus-within { border-color: var(--main-color); box-shadow: 0 0 12px rgba(var(--main-color-rgb), 0.15); }
    }
    .filter-select, .sort-select { display: flex; align-items: center; gap: 0.5rem;
      padding: 0.75rem 1.25rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px; color: rgba(255,255,255,0.6); font-size: 0.7rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.5px; transition: all var(--q-transition-speed) var(--q-transition-ease);
      svg { color: var(--main-color); opacity: 0.5; font-size: 0.75rem; }
      select { background: transparent; border: none; outline: none; color: #fff; font-size: 0.75rem; font-weight: 700;
        cursor: pointer; appearance: none; text-transform: uppercase; letter-spacing: 0.5px;
        option { background: #1a1a2e; color: #fff; } }
      &:focus-within { border-color: var(--main-color); }
    }
    .count-badge { display: flex; align-items: center; padding: 0.75rem 1.25rem;
      background: rgba(var(--main-color-rgb), 0.08); border: 1px solid rgba(var(--main-color-rgb), 0.15);
      border-radius: 14px; font-size: 0.7rem; font-weight: 900; color: var(--main-color); white-space: nowrap;
      span { opacity: 0.4; margin-left: 0.35rem; } }
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.65rem;
      .search-box, .filter-select, .sort-select, .count-badge { width: 100%; min-width: 0; }
      .filter-select, .sort-select { justify-content: space-between; }
      .count-badge { justify-content: center; }
    }
  }
  .table-wrapper { overflow-x: auto; width: 100%; scrollbar-width: thin;
    scrollbar-color: var(--main-color) rgba(255,255,255,0.05);
    &::-webkit-scrollbar { height: 6px; }
    &::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
    &::-webkit-scrollbar-thumb { background: var(--main-color); border-radius: 10px; } }
  table { width: 100%; min-width: 800px; border-collapse: separate; border-spacing: 0 0.75rem;
    th { padding: 0.75rem 1rem; text-align: left; font-size: 0.68rem; text-transform: none; opacity: 0.56;
      letter-spacing: 0.01em; font-weight: 650; border-bottom: 1px solid rgba(255,255,255,0.08); }
    td { padding: 1.25rem 1rem; font-size: 0.9rem; background: rgba(255,255,255,0.02);
      transition: all var(--q-transition-speed) var(--q-transition-ease); vertical-align: middle;
      &:first-child { border-radius: 16px 0 0 16px; }
      &:last-child { border-radius: 0 16px 16px 0; } }
    tr:hover td { background: rgba(255,255,255,0.05); transform: translateY(-2px); }
    .project-info { display: flex; align-items: center; gap: 1.5rem;
      img { width: 60px; height: 60px; object-fit: cover; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; }
      .title { font-weight: 700; letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; }
      .company-badge { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px;
        border-radius: 50%; font-size: 0.7rem; flex-shrink: 0; border: 1px solid transparent;
        &.on { color: #2ecc71; background: rgba(46,204,113,0.15); border-color: rgba(46,204,113,0.4); }
        &.off { color: #95a5a6; background: rgba(149,165,166,0.12); border-color: rgba(149,165,166,0.3); } } }
    .type-badges { display: flex; flex-wrap: wrap; gap: 0.35rem;
      .category-badge { display: inline-block; padding: 4px 10px; border-radius: 8px; font-size: 0.65rem;
        font-weight: 900; text-transform: uppercase; white-space: nowrap; } }
    .actions { display: flex; gap: 0.75rem; justify-content: flex-end;
      button { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); cursor: pointer;
        transition: all var(--q-transition-speed) var(--q-transition-ease); border-radius: 12px; font-size: 0.9rem;
        &.edit { color: #3498db; &:hover { background: rgba(52,152,219,0.15); border-color: #3498db; transform: translateY(-2px); } }
        &.delete { color: #e74c3c; &:hover { background: rgba(231,76,60,0.15); border-color: #e74c3c; transform: translateY(-2px); } } } } }
  @media (max-width: 768px) {
    table, thead, tbody, th, td, tr { display: block; width: 100%; min-width: 0; }
    thead { display: none; }
    tbody { display: grid; gap: 0.75rem; }
    tr {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      box-sizing: border-box;
      margin: 0;
      padding: 0.9rem;
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 14px;
      background: rgba(17, 26, 43, 0.72);
    }
    td {
      display: flex !important;
      min-width: 0;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.7rem 0;
      border: 0 !important;
      border-bottom: 1px solid rgba(255,255,255,0.06) !important;
      border-radius: 0 !important;
      background: transparent !important;
      &::before {
        content: attr(data-label);
        flex: 0 0 auto;
        color: rgba(226,232,240,0.45);
        font-size: 0.65rem;
        font-weight: 650;
        letter-spacing: 0.02em;
        text-transform: none;
      }
      &:first-child {
        order: -1;
        justify-content: flex-start;
        padding-top: 0;
        &::before { content: none; }
      }
      &:nth-child(2) {
        order: 0;
        padding-top: 0;
        &::before { content: none; }
      }
      &:last-child { border-bottom: 0 !important; padding-bottom: 0; }
    }
    .project-info {
      min-width: 0;
      width: 100%;
      gap: 0.75rem;
      img { width: 48px; height: 48px; border-radius: 10px; }
      .title {
        min-width: 0;
        max-width: none;
        flex: 1;
        white-space: normal;
        overflow-wrap: anywhere;
        font-size: 0.82rem;
        letter-spacing: 0;
      }
    }
    .type-badges { justify-content: flex-end; min-width: 0; }
    .actions {
      button { width: 40px; height: 40px; border-radius: 10px; }
    }
    tr:hover td { transform: none; }
  }
  @media (max-width: 420px) {
    .bulk-selection-toolbar { flex-wrap: wrap; }
    .bulk-selection-actions { width: 100%; justify-content: stretch; }
    .bulk-selection-actions > button:first-child { flex: 1; }
    .bulk-menu { left: 0; right: auto !important; width: min(240px, calc(100vw - 2rem)); }
  }
`;

type TabKey = "overview" | "projects" | "statistics" | "settings";

function getCroppedImg(imageSrc: string, crop: { x: number; y: number }, zoom: number): Promise<File> {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const naturalWidth = image.naturalWidth;
      const naturalHeight = image.naturalHeight;
      const aspect = 16 / 9;

      let outputWidth = naturalWidth;
      let outputHeight = naturalWidth / aspect;
      if (outputHeight > naturalHeight) {
        outputHeight = naturalHeight;
        outputWidth = naturalHeight * aspect;
      }

      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext("2d")!;

      const cropAreaWidth = naturalWidth / zoom;
      const cropAreaHeight = cropAreaWidth / aspect;
      const cropX = (naturalWidth - cropAreaWidth) / 2 + (crop.x / 100) * (cropAreaWidth / 2);
      const cropY = (naturalHeight - cropAreaHeight) / 2 + (crop.y / 100) * (cropAreaHeight / 2);

      ctx.drawImage(image, cropX, cropY, cropAreaWidth, cropAreaHeight, 0, 0, outputWidth, outputHeight);

      canvas.toBlob((blob) => {
        resolve(new File([blob!], "cropped.jpg", { type: "image/jpeg" }));
      }, "image/jpeg", 0.9);
    };
  });
}

const Dashboard = () => {
  const { t } = useTranslation();
  const { setNewProject } = useMyContext();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
  const [bulkEditorOpen, setBulkEditorOpen] = useState(false);
  const [bulkValues, setBulkValues] = useState({
    title: "",
    developer: "",
    source: "",
    visit: "",
    disc: "",
    rate: "20",
    langs: [] as string[],
    techs: [] as string[],
    types: [] as string[],
    showOnCompanySite: "",
  });
  const [bulkApplyFields, setBulkApplyFields] = useState<Record<string, boolean>>({});
  const [bulkArrayActions, setBulkArrayActions] = useState<Record<"langs" | "techs" | "types", "replace" | "add" | "remove">>({
    langs: "replace",
    techs: "replace",
    types: "replace",
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("20");
  const [types, setTypes] = useState<string[]>(["website"]);
  const [techs, setTechs] = useState<string[]>(["html", "css", "javascript"]);
  const [langs, setLangs] = useState<string[]>(["english"]);
  const [imageFiles, setImageFiles] = useState<{ file: File; url: string }[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [sourceOptions, setSourceOptions] = useState<string[]>([]);

  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropEditorRef = useRef<HTMLDivElement>(null);

  const initialProjectData = {
    title: "", developer: "", source: "", visit: "", disc: "",
    rate: "20", langs: ["english"], techs: ["html", "css", "javascript"], types: ["website"],
    showOnCompanySite: true,
  };
  const [projectData, setProjectData] = useState(initialProjectData);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      setProjects(await response.json());
    } catch (error) {}
  };

  const fetchSources = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects/sources`);
      if (!response.ok) throw new Error("Failed to fetch sources");
      setSourceOptions(await response.json());
    } catch (error) {}
  };

  useEffect(() => { fetchProjects(); fetchSources(); }, []);

  // After an image is chosen, send the user to the top of the page where the inline editor appears
  useEffect(() => {
    if (cropImage) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [cropImage]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || (p.types || [p.type]).includes(filterType);
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        if (sortBy === "oldest") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        if (sortBy === "rated") return (+b.rate || 0) - (+a.rate || 0);
        if (sortBy === "alpha") return (a.title || "").localeCompare(b.title || "");
        return 0;
      });
  }, [projects, searchQuery, filterType, sortBy]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropImage(url); // opens the inline crop/edit editor at the top of the form
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const cancelCrop = () => {
    if (cropImage) URL.revokeObjectURL(cropImage);
    setCropImage(null);
  };

  const handleCropConfirm = async () => {
    if (!cropImage) return;
    setUploadingImage(true);
    try {
      const croppedFile = await getCroppedImg(cropImage, crop, zoom);
      const croppedUrl = URL.createObjectURL(croppedFile);
      setImageFiles((prev) => [...prev, { file: croppedFile, url: croppedUrl }]);
    } catch (e) {}
    setUploadingImage(false);
    setCropImage(null);
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    const allTechs = Object.values(techCategories.frontend).flat().concat(Object.values(techCategories.backend).flat());
    if (allTechs.includes(name)) {
      const checkbox = e.target as HTMLInputElement;
      if (checkbox.checked) setTechs((prev) => [...prev, name]);
      else setTechs((prev) => prev.filter((el) => el !== name));
    } else if (languages.includes(name)) {
      const checkbox = e.target as HTMLInputElement;
      if (checkbox.checked) setLangs((prev) => [...prev, name]);
      else setLangs((prev) => prev.filter((el) => el !== name));
    } else if (ALL_PROJECT_TYPES.includes(name)) {
      const checkbox = e.target as HTMLInputElement;
      if (checkbox.checked) setTypes((prev) => [...prev, name]);
      else setTypes((prev) => prev.filter((el) => el !== name));
    } else if (name === "developer" || name === "source" || name === "title" || name === "visit" || name === "disc") {
      setProjectData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    setProjectData((prev) => ({ ...prev, langs, techs, types, rate: range }));
  }, [langs, techs, types, range]);

  const handleRange = (e: React.ChangeEvent<HTMLInputElement>) => setRange(e.target.value);

  const handleCompanySiteToggle = () => {
    setProjectData((prev) => ({ ...prev, showOnCompanySite: !prev.showOnCompanySite }));
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", projectData.title);
    formData.append("developer", projectData.developer);
    formData.append("source", projectData.source);
    formData.append("visit", projectData.visit);
    formData.append("disc", projectData.disc);
    formData.append("rate", range);
    formData.append("langs", JSON.stringify(langs));
    formData.append("techs", JSON.stringify(techs));
    formData.append("types", JSON.stringify(types));
    formData.append("showOnCompanySite", String(projectData.showOnCompanySite));

    if (editId && existingImages.length > 0) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    for (const img of imageFiles) {
      formData.append("images", img.file);
    }

    try {
      const url = editId ? `${API_URL}/api/projects/${editId}` : `${API_URL}/api/projects`;
      const method = editId ? "PUT" : "POST";
      const response = await fetch(url, { method, body: formData });
      if (!response.ok) throw new Error("Failed to save project");
      setNewProject((prev) => !prev);
      handleReset();
      fetchProjects();
      fetchSources();
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("dashboard.confirm_delete") || "Are you sure?")) return;
    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      setNewProject((prev) => !prev);
      fetchProjects();
      fetchSources();
      setSelectedProjects((prev) => prev.filter((pid) => pid !== id));
    } catch (error) {}
  };

  const handleSelectProject = (id: string) => {
    setSelectedProjects((prev) => {
      const next = prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id];
      if (next.length === 0) setBulkMenuOpen(false);
      return next;
    });
  };

  const hasAllSelected = filteredProjects.length > 0 && filteredProjects.every((p) => selectedProjects.includes(p._id));

  const bulkApplyChanges = async (updates: Record<string, unknown>) => {
    if (selectedProjects.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/projects/bulk-update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectIds: selectedProjects, updates }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Bulk update failed");
      }

      setNewProject((prev) => !prev);
      setSelectedProjects([]);
      setBulkMenuOpen(false);
      setBulkEditorOpen(false);
      setBulkApplyFields({});
      await fetchProjects();
      await fetchSources();
    } catch (error: unknown) {
      setError(true);
      window.alert(error instanceof Error ? error.message : "Bulk update failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleBulkField = (field: string) => {
    setBulkApplyFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const toggleBulkValue = (field: "langs" | "techs" | "types", value: string) => {
    setBulkValues((prev) => {
      const values = prev[field];
      return {
        ...prev,
        [field]: values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value],
      };
    });
  };

  const submitBulkEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updates: Record<string, unknown> = {};
    const arrayOperations: Record<string, { action: string; values: string[] }> = {};
    const textFields = ["title", "developer", "source", "visit", "disc", "rate"] as const;

    textFields.forEach((field) => {
      if (bulkApplyFields[field]) updates[field] = bulkValues[field];
    });
    (["langs", "techs", "types"] as const).forEach((field) => {
      if (bulkApplyFields[field]) {
        arrayOperations[field] = { action: bulkArrayActions[field], values: bulkValues[field] };
      }
    });
    if (Object.keys(arrayOperations).length > 0) updates.arrayOperations = arrayOperations;
    if (bulkApplyFields.visibility) {
      if (!bulkValues.showOnCompanySite) {
        window.alert("Choose a visibility value before applying changes.");
        return;
      }
      updates.showOnCompanySite = bulkValues.showOnCompanySite === "true";
    }

    if (bulkApplyFields.rate) {
      const rating = Number(bulkValues.rate);
      if (!Number.isFinite(rating) || rating < 0 || rating > 100) {
        window.alert("Enter a rating between 0 and 100.");
        return;
      }
      updates.rate = rating;
    }

    if (Object.keys(updates).length === 0) {
      window.alert("Choose at least one detail to apply.");
      return;
    }

    bulkApplyChanges(updates);
  };

  const openBulkEditor = () => {
    setBulkApplyFields({});
    setBulkValues({
      title: "",
      developer: "",
      source: "",
      visit: "",
      disc: "",
      rate: "20",
      langs: [],
      techs: [],
      types: [],
      showOnCompanySite: "",
    });
    setBulkArrayActions({ langs: "replace", techs: "replace", types: "replace" });
    setBulkMenuOpen(false);
    setBulkEditorOpen(true);
  };

  const handleBulkDelete = async () => {
    if (selectedProjects.length === 0) return;
    const projectNames = selectedProjects.map((id) =>
      projects.find((project) => project._id === id)?.title || id
    );
    if (!window.confirm(`Delete these ${projectNames.length} selected project(s)?\n\n${projectNames.map((name) => `- ${name}`).join("\n")}`)) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/projects/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectIds: selectedProjects }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Bulk delete failed");
      }

      setNewProject((prev) => !prev);
      setSelectedProjects([]);
      setBulkMenuOpen(false);
      await fetchProjects();
      await fetchSources();
    } catch (error: unknown) {
      setError(true);
      window.alert(error instanceof Error ? error.message : "Bulk delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: any) => {
    setActiveTab("projects");
    setShowProjectForm(true);
    setEditId(project._id);
    setProjectData({
      title: project.title || "",
      developer: project.developer || "",
      source: project.source || "",
      visit: project.visit || "",
      disc: project.disc || "",
      rate: project.rate || "20",
      langs: project.langs || ["english"],
      techs: project.techs || [],
      types: project.types || [project.type] || ["website"],
      showOnCompanySite: project.showOnCompanySite ?? true,
    });
    setTechs(project.techs || []);
    setLangs(project.langs || ["english"]);
    setTypes(project.types || [project.type] || ["website"]);
    setRange(project.rate || "20");
    setImageFiles([]);
    setExistingImages(
      project.images
        ? project.images.filter((img: string) => img)
        : project.image
        ? [project.image]
        : []
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setShowProjectForm(false);
    setEditId(null);
    setProjectData(initialProjectData);
    setTechs(["html", "css", "javascript"]);
    setLangs(["english"]);
    setTypes(["website"]);
    setRange("20");
    setImageFiles([]);
    setExistingImages([]);
    setSelectedProjects([]);
    setBulkMenuOpen(false);
  };

  const tabs: { key: TabKey; icon: any; labelKey: string }[] = [
    { key: "overview", icon: faFolderOpen, labelKey: "admin.tab_overview" },
    { key: "projects", icon: faChessPawn, labelKey: "admin.tab_projects" },
    { key: "statistics", icon: faChartBar, labelKey: "admin.tab_statistics" },
    { key: "settings", icon: faGear, labelKey: "admin.tab_settings" },
  ];

  return (
    <PanelWrapper>
      <DashboardLayout>
        <DashboardSidebar>
          <DashboardBrand>ALOMAWY<span>Admin workspace</span></DashboardBrand>
          <TabBar>
            {tabs.map((tab) => (
              <Tab key={tab.key} $active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
                <FontAwesomeIcon icon={tab.icon} />
                {t(tab.labelKey)}
              </Tab>
            ))}
          </TabBar>
          <SidebarFooter>Project administration</SidebarFooter>
        </DashboardSidebar>

        <div>
          <PanelHeader>
            <div>
              <div className="header-title">{t(tabs.find((tab) => tab.key === activeTab)?.labelKey || "admin.panel_title")}</div>
              <div className="header-description">Manage projects, content, visibility, and site settings.</div>
            </div>
            <div className="header-actions">
              <span className="project-total">{projects.length} projects</span>
              <button
                type="button"
                className="create-project-btn"
                onClick={() => {
                  handleReset();
                  setActiveTab("projects");
                  setShowProjectForm(true);
                }}
              >
                <FontAwesomeIcon icon={faPlus} /> New project
              </button>
              <button className="logout-btn" onClick={() => dispatch(signOut())}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                {t("admin.logout")}
              </button>
            </div>
          </PanelHeader>

          <TabContent>
        {activeTab === "overview" && <AdminOverview projects={projects} />}

        {activeTab === "projects" && (
          <>
            {showProjectForm && (
            <Styled_Form onSubmit={handleAdd} onReset={handleReset}>
              {cropImage && (
                <div className="crop-editor" ref={cropEditorRef}>
                  <div className="crop-editor-header">
                    <h3><FontAwesomeIcon icon={faCropSimple} />Edit &amp; Crop Image</h3>
                  </div>
                  <div className="crop-container">
                    <Cropper
                      image={cropImage}
                      crop={crop}
                      zoom={zoom}
                      aspect={16 / 9}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                    />
                  </div>
                  <div className="crop-actions">
                    <button type="button" className="cancel" onClick={cancelCrop}>
                      <FontAwesomeIcon icon={faTimes} style={{ marginRight: 8 }} />{t("dashboard.cancel")}
                    </button>
                    <button type="button" className="confirm" onClick={handleCropConfirm}>
                      <FontAwesomeIcon icon={faCheck} style={{ marginRight: 8 }} />{t("dashboard.crop_confirm") || "Crop & Add"}
                    </button>
                  </div>
                </div>
              )}
              <div className="header">
                <h2>{editId ? t("dashboard.edit_project") : t("dashboard.add_project")}</h2>
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
                    <select name="source" id="source" value={projectData.source} onChange={handleChange} required>
                      <option value="">{t("admin.select_source") || "Select source..."}</option>
                      {sourceOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                      {projectData.source && !sourceOptions.includes(projectData.source) && (
                        <option value={projectData.source}>{projectData.source}</option>
                      )}
                    </select>
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

              <div className="selection-box">
                <div className="title"><FontAwesomeIcon icon={faChessPawn} />{t("portfolio.type") || "Project Types"}</div>
                <div className="options">
                  {ALL_PROJECT_TYPES.map((val) => (
                    <div key={val} className="option">
                      <input type="checkbox" onChange={handleChange} name={val} id={`type-${val}`} checked={types.includes(val)} />
                      <label htmlFor={`type-${val}`}>{t(`portfolio.category.${val}`)}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="selection-box">
                <div className="title"><FontAwesomeIcon icon={faCode} />{t("portfolio.techs") || "Technologies"}</div>
                {(Object.keys(techCategories.frontend) as Array<keyof typeof techCategories.frontend>).map((cat) => (
                  <div className="tech-category" key={`fe-${cat}`}>
                    <div className="cat-label">{t(`dashboard.tech.${cat}`) || cat}</div>
                    <div className="options">
                      {techCategories.frontend[cat].map((tech) => (
                        <div key={tech} className="option">
                          <input type="checkbox" name={tech} id={tech} onChange={handleChange} checked={techs.includes(tech)} />
                          <label htmlFor={tech}>{tech.toUpperCase()}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "1.25rem 0" }} />
                {(Object.keys(techCategories.backend) as Array<keyof typeof techCategories.backend>).map((cat) => (
                  <div className="tech-category" key={`be-${cat}`}>
                    <div className="cat-label">{t(`dashboard.tech.${cat}`) || cat}</div>
                    <div className="options">
                      {techCategories.backend[cat].map((tech) => (
                        <div key={tech} className="option">
                          <input type="checkbox" name={tech} id={tech} onChange={handleChange} checked={techs.includes(tech)} />
                          <label htmlFor={tech}>{tech.toUpperCase()}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid-section">
                <div className="selection-box">
                  <div className="title"><FontAwesomeIcon icon={faLanguage} />{t("portfolio.langs") || "Languages"}</div>
                  <div className="options">
                    {languages.map((lang) => (
                      <div key={lang} className="option">
                        <input type="checkbox" name={lang} onChange={handleChange} id={lang} checked={langs.includes(lang)} />
                        <label htmlFor={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="selection-box">
                  <div className="title"><FontAwesomeIcon icon={faStar} />{t("dashboard.rate")}</div>
                  <div className="rate-display">{Math.round(+range / 20)} / 5</div>
                  <div style={{ position: "relative", marginTop: "0.5rem" }}>
                    <input type="range" name="range" id="rate" style={{ opacity: "0", height: "40px", width: "100%", cursor: "pointer", zIndex: 2, position: "relative" }} onChange={handleRange} value={range} />
                    <div style={{ width: "100%", height: "8px", top: "16px", backgroundColor: "rgba(255,255,255,0.05)", position: "absolute", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: range + "%", height: "100%", background: `linear-gradient(to right, ${+range > 80 ? "#2ecc71" : +range > 40 ? "#3498db" : "#e67e22"}, var(--main-color))`, boxShadow: `0 0 10px ${+range > 40 ? "rgba(52,152,219,0.4)" : "rgba(230,126,34,0.4)"}` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="selection-box">
                <div className="title"><FontAwesomeIcon icon={faEye} />{t("dashboard.visibility", "Visibility")}</div>
                <div className="visibility-row">
                  <div className="visibility-text">
                    <div className="visibility-label">Show on company website</div>
                    <div className="visibility-hint">When off, this project is hidden from the company site. Your personal site is unaffected.</div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={projectData.showOnCompanySite} onChange={handleCompanySiteToggle} />
                    <span className="track" />
                  </label>
                </div>
              </div>

              <div className="selection-box">
                <div className="title"><FontAwesomeIcon icon={faImage} />{t("dashboard.projectImages") || "Project Images"}</div>
                <div className="image-upload-container">
                  <label onClick={() => fileInputRef.current?.click()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", cursor: "pointer", padding: "2rem", border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "24px", width: "200px" }}>
                    <FontAwesomeIcon icon={faImage} size="2x" />
                    <span style={{ color: "var(--main-color)", fontWeight: 900, fontSize: "0.7rem", textTransform: "uppercase" }}>
                      {uploadingImage ? t("dashboard.uploading") : t("dashboard.select_image")}
                    </span>
                  </label>
                  <input ref={fileInputRef} style={{ display: "none" }} type="file" accept="image/*" onChange={handleImageSelect} />

                  <div className="images-grid">
                    {existingImages.map((img, i) => {
                      const src = img?.startsWith("/uploads") ? `${API_URL}${img}` : img;
                      return (
                        <div className="image-thumb" key={`existing-${i}`}>
                          <img src={src} alt="" />
                          <div className="image-overlay">
                            <button type="button" className="delete-btn" onClick={() => handleRemoveExistingImage(i)}>
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {imageFiles.map((img, i) => (
                      <div className="image-thumb" key={`new-${i}`}>
                        <img src={img.url} alt="" />
                        <div className="image-overlay">
                          <button type="button" className="delete-btn" onClick={() => handleRemoveImage(i)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {error && <div style={{ color: "#e74c3c", textAlign: "center", fontWeight: "bold" }}>{t("dashboard.check_fields")}</div>}

              <button type="submit" disabled={loading || uploadingImage}>
                {uploadingImage ? t("dashboard.uploadingImage") : loading ? t("info.loading") : editId ? (
                  <><FontAwesomeIcon icon={faSave} style={{ marginRight: "10px" }} />{t("dashboard.save")}</>
                ) : (
                  <><FontAwesomeIcon icon={faPlus} style={{ marginRight: "10px" }} />{t("dashboard.add")}</>
                )}
              </button>

              <button type="button" onClick={handleReset} style={{ background: "rgba(255,255,255,0.1)", marginTop: "1rem" }}>
                <FontAwesomeIcon icon={faTimes} style={{ marginRight: "10px" }} />
                {t("dashboard.cancel")}
              </button>
            </Styled_Form>
            )}

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
                    {ALL_PROJECT_TYPES.map((val) => (
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

              {selectedProjects.length > 0 && (
                <div className="bulk-selection-toolbar">
                  <strong style={{ color: "#fff", fontSize: "0.82rem" }}>{selectedProjects.length} selected</strong>
                  <div className="bulk-selection-actions">
                    <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      onClick={() => setBulkMenuOpen((open) => !open)}
                      aria-expanded={bulkMenuOpen}
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 0.85rem", borderRadius: "9px", background: "var(--main-color)", color: "#fff", fontWeight: 700, fontSize: "0.78rem" }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} /> Bulk actions
                    </button>
                    {bulkMenuOpen && (
                      <div className="bulk-menu">
                        <button className="edit-selected" type="button" onClick={openBulkEditor}>
                          Edit selected details
                        </button>
                        <button className="delete-selected" type="button" onClick={handleBulkDelete}>
                          Delete selected projects
                        </button>
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => { setSelectedProjects([]); setBulkMenuOpen(false); }} style={{ padding: "0.6rem 0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(226,232,240,0.7)", fontSize: "0.75rem" }}>
                    Clear selection
                  </button>
                  </div>
                </div>
              )}

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: "48px" }}>
                        <input
                          type="checkbox"
                          checked={hasAllSelected}
                          onChange={() => {
                            if (hasAllSelected) {
                              const visibleIds = new Set(filteredProjects.map((project) => project._id));
                              setSelectedProjects((prev) => prev.filter((id) => !visibleIds.has(id)));
                            } else {
                              setSelectedProjects((prev) => [...new Set([...prev, ...filteredProjects.map((project) => project._id)])]);
                            }
                          }}
                          aria-label="Select all projects"
                        />
                      </th>
                      <th>{t("dashboard.projectName")}</th>
                      <th>{t("portfolio.type")}</th>
                      <th style={{ textAlign: "right" }}>{t("dashboard.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => {
                      const projectTypes = project.types || [project.type];
                      const isSelected = selectedProjects.includes(project._id);
                      return (
                        <tr key={project._id}>
                          <td data-label="Select">
                            <input type="checkbox" checked={isSelected} onChange={() => handleSelectProject(project._id)} aria-label={`Select ${project.title}`} />
                          </td>
                          <td data-label={t("dashboard.projectName")}>
                            <div className="project-info">
                              <img src={project.image?.startsWith("/uploads") ? `${API_URL}${project.image}` : project.image || "./assets/project-placeholder.png"} alt="" />
                              <span className="title">{project.title}</span>
                              <span className={`company-badge ${project.showOnCompanySite ? "on" : "off"}`} title={project.showOnCompanySite ? "Visible on company site" : "Hidden from company site"}>
                                <FontAwesomeIcon icon={faEye} />
                              </span>
                            </div>
                          </td>
                          <td data-label={t("portfolio.type")}>
                            <div className="type-badges">
                              {projectTypes.map((ty: string) => {
                                const style = getProjectTypeStyle(ty);
                                return (
                                  <span key={ty} className="category-badge" style={{ backgroundColor: style.accentBg, borderColor: style.color + "50", color: style.color }}>
                                    {t(`portfolio.category.${ty}`)}
                                  </span>
                                );
                              })}
                            </div>
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </StyledTable>
          </>
        )}

        {activeTab === "statistics" && <AdminStatistics projects={projects} />}
        {activeTab === "settings" && <AdminSettings />}
          </TabContent>
        </div>
      </DashboardLayout>

      {bulkEditorOpen && (
        <BulkModalOverlay onMouseDown={(event) => {
          if (event.target === event.currentTarget) setBulkEditorOpen(false);
        }}>
          <BulkModal role="dialog" aria-modal="true" aria-labelledby="bulk-editor-title">
            <form onSubmit={submitBulkEdit}>
              <BulkModalHeader>
                <div>
                  <h2 id="bulk-editor-title">Edit selected projects</h2>
                  <p>Choose the details to apply to all {selectedProjects.length} selected projects. Unchecked fields stay unchanged.</p>
                </div>
                <button type="button" aria-label="Close bulk editor" onClick={() => setBulkEditorOpen(false)} style={{ color: "rgba(226,232,240,0.65)", fontSize: "1.15rem" }}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </BulkModalHeader>

              <BulkModalGrid>
                {([
                  ["title", "Project title"],
                  ["developer", "Developer name"],
                  ["source", "Idea source"],
                  ["visit", "Project link"],
                  ["rate", "Rating (0–100)"],
                ] as const).map(([field, label]) => (
                  <BulkField key={field}>
                    <label className="bulk-field-title">
                      <input type="checkbox" checked={!!bulkApplyFields[field]} onChange={() => toggleBulkField(field)} />
                      Apply {label.toLowerCase()}
                    </label>
                    {field === "source" ? (
                      <>
                        <input
                        className="bulk-input"
                        list="bulk-source-options"
                        value={bulkValues.source}
                        disabled={!bulkApplyFields.source}
                        placeholder="Set or clear idea source"
                        onChange={(event) => setBulkValues((prev) => ({ ...prev, source: event.target.value }))}
                        />
                        <datalist id="bulk-source-options">
                        {sourceOptions.map((source) => <option key={source} value={source} />)}
                        </datalist>
                      </>
                    ) : (
                      <input
                        className="bulk-input"
                        type={field === "visit" ? "url" : field === "rate" ? "number" : "text"}
                        min={field === "rate" ? 0 : undefined}
                        max={field === "rate" ? 100 : undefined}
                        value={bulkValues[field]}
                        disabled={!bulkApplyFields[field]}
                        placeholder={field === "rate" ? "0–100" : `Set ${label.toLowerCase()}`}
                        onChange={(event) => setBulkValues((prev) => ({ ...prev, [field]: event.target.value }))}
                      />
                    )}
                  </BulkField>
                ))}

                <BulkField className="wide">
                  <label className="bulk-field-title">
                    <input type="checkbox" checked={!!bulkApplyFields.disc} onChange={() => toggleBulkField("disc")} />
                    Apply project description
                  </label>
                  <textarea
                    className="bulk-textarea"
                    value={bulkValues.disc}
                    disabled={!bulkApplyFields.disc}
                    placeholder="Set the description for selected projects"
                    onChange={(event) => setBulkValues((prev) => ({ ...prev, disc: event.target.value }))}
                  />
                </BulkField>

                <BulkField>
                  <label className="bulk-field-title">
                    <input type="checkbox" checked={!!bulkApplyFields.visibility} onChange={() => toggleBulkField("visibility")} />
                    Apply website visibility
                  </label>
                  <select
                    className="bulk-select"
                    value={bulkValues.showOnCompanySite}
                    disabled={!bulkApplyFields.visibility}
                    onChange={(event) => setBulkValues((prev) => ({ ...prev, showOnCompanySite: event.target.value }))}
                  >
                    <option value="">Choose visibility</option>
                    <option value="true">Visible on company website</option>
                    <option value="false">Hidden from company website</option>
                  </select>
                </BulkField>

                {([
                  ["types", "Project categories", ALL_PROJECT_TYPES],
                  ["langs", "Languages", languages],
                  ["techs", "Technologies", [...Object.values(techCategories.frontend).flat(), ...Object.values(techCategories.backend).flat()]],
                ] as const).map(([field, label, options]) => (
                  <BulkField className={field === "techs" ? "wide" : ""} key={field}>
                    <label className="bulk-field-title">
                      <input type="checkbox" checked={!!bulkApplyFields[field]} onChange={() => toggleBulkField(field)} />
                      Manage {label.toLowerCase()}
                    </label>
                    <select
                      className="bulk-select"
                      value={bulkArrayActions[field]}
                      disabled={!bulkApplyFields[field]}
                      onChange={(event) => setBulkArrayActions((prev) => ({
                        ...prev,
                        [field]: event.target.value as "replace" | "add" | "remove",
                      }))}
                      style={{ marginBottom: "0.7rem" }}
                    >
                      <option value="replace">Replace existing values</option>
                      <option value="add">Add selected values</option>
                      <option value="remove">Remove selected values</option>
                    </select>
                    <BulkChoiceGrid className={!bulkApplyFields[field] ? "disabled" : ""}>
                      {options.map((option) => (
                        <BulkChoice key={option}>
                          <input
                            type="checkbox"
                            checked={bulkValues[field].includes(option)}
                            disabled={!bulkApplyFields[field]}
                            onChange={() => toggleBulkValue(field, option)}
                          />
                          {field === "types" ? t(`portfolio.category.${option}`) : option}
                        </BulkChoice>
                      ))}
                    </BulkChoiceGrid>
                    {bulkApplyFields[field] && bulkArrayActions[field] === "replace" && bulkValues[field].length === 0 && (
                      <small style={{ display: "block", marginTop: "0.55rem", color: "#f1ba68", fontSize: "0.68rem" }}>
                        No selected values will clear this field for the selected projects.
                      </small>
                    )}
                  </BulkField>
                ))}
              </BulkModalGrid>

              <BulkModalFooter>
                <button type="button" className="cancel" onClick={() => setBulkEditorOpen(false)}>Cancel</button>
                <button type="submit" className="save" disabled={loading}>
                  {loading ? "Applying…" : "Apply changes"}
                </button>
              </BulkModalFooter>
            </form>
          </BulkModal>
        </BulkModalOverlay>
      )}
    </PanelWrapper>
  );
};

export default Dashboard;
