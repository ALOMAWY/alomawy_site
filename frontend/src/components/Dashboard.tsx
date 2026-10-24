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
  overflow-x: hidden;
  color: #182338;
  background: #f3f6fb;
`;

const DashboardLayout = styled.div`
  width: min(1500px, 100%);
  min-height: 100vh;
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 3.75rem) 3rem;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80px;
  gap: 1rem;
  flex-wrap: wrap;
  border-bottom: 1px solid #e4e9f1;
  .brand {
    display: flex; align-items: center; gap: 0.7rem;
    color: #182338; font-size: 0.95rem; font-weight: 800; letter-spacing: -0.02em;
  }
  .brand-mark {
    display: grid; place-items: center; width: 34px; height: 34px; border-radius: 11px;
    background: #243b67; color: #fff; font-size: 0.8rem; font-weight: 800;
  }
  .header-actions { display: flex; align-items: center; gap: 0.65rem; }
  .project-total { color: #667187; font-size: 0.78rem; white-space: nowrap; }
  .create-project-btn {
    display: inline-flex; align-items: center; gap: 0.55rem; padding: 0.75rem 1rem;
    border-radius: 9px; background: #243b67; color: #fff; font-weight: 700;
    box-shadow: 0 5px 12px rgba(36,59,103,0.14);
    &:hover { background: #314e83; transform: translateY(-1px); }
  }
  .logout-btn {
    display: flex; align-items: center; gap: 0.5rem; padding: 0.7rem 0.85rem;
    background: #fff; border: 1px solid #dfe5ef; border-radius: 9px;
    color: #58647a; font-weight: 650; font-size: 0.78rem;
    white-space: nowrap;
    &:hover { border-color: #efb0aa; color: #be5148; background: #fff8f7; }
  }
  @media (max-width: 620px) {
    min-height: 68px;
    .brand { font-size: 0.84rem; }
    .header-actions { gap: 0.4rem; }
    .project-total { display: none; }
    .create-project-btn, .logout-btn { padding: 0.65rem 0.7rem; font-size: 0.72rem; }
  }
`;

const TabBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem;
  border: 1px solid #e3e8f0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(24,35,56,0.035);
  @media (max-width: 520px) {
    width: 100%;
    justify-content: space-between;
    gap: 0.15rem;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex; align-items: center; justify-content: center; gap: 0.55rem;
  padding: 0.7rem 0.9rem; border-radius: 9px;
  color: ${p => p.$active ? '#243b67' : '#7b8799'};
  background: ${p => p.$active ? '#edf2fa' : 'transparent'};
  border: 1px solid ${p => p.$active ? '#dce5f3' : 'transparent'};
  font-size: 0.76rem; font-weight: ${p => p.$active ? 750 : 600};
  cursor: pointer; white-space: nowrap;
  svg { font-size: 0.82rem; }
  &:hover:not([disabled]) { color: #243b67; background: #f4f7fb; }
  @media (max-width: 520px) {
    flex: 1;
    padding: 0.65rem 0.2rem;
    gap: 0.3rem;
    font-size: 0.64rem;
    svg { font-size: 0.75rem; }
  }
`;

const TabContent = styled.div`
  min-width: 0;
  padding: 0.25rem 0 3rem;
  color: #182338;
`;

const DashboardIntro = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.75rem 0 1.25rem;
  .eyebrow {
    margin-bottom: 0.4rem;
    color: #75829a;
    font-size: 0.68rem;
    font-weight: 750;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  h1 {
    color: #17243a;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 800;
    letter-spacing: -0.045em;
    line-height: 1.1;
  }
  p { margin-top: 0.5rem; color: #728097; font-size: 0.82rem; }
  .intro-count {
    padding: 0.6rem 0.85rem;
    color: #415271;
    background: #e7edf7;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 700;
    white-space: nowrap;
  }
  @media (max-width: 520px) {
    align-items: flex-start;
    flex-direction: column;
    padding-top: 1.25rem;
  }
`;

const BulkModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(21, 34, 54, 0.48);
  backdrop-filter: blur(5px);
  @media (max-width: 640px) {
    place-items: start center;
    padding: max(0.5rem, env(safe-area-inset-top)) 0.5rem max(0.5rem, env(safe-area-inset-bottom));
  }
`;

const BulkModal = styled.div`
  width: min(860px, 100%);
  max-height: min(90vh, 900px);
  overflow: auto;
  border: 1px solid #dce3ed;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 24px 80px rgba(24,40,68,0.24);
  color: #1f2e46;
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
  background: #fff;
  border-bottom: 1px solid #e7ebf1;
  h2 { color: #1e2d45; font-size: 1.05rem; font-weight: 800; }
  p { color: #77849a; font-size: 0.78rem; margin-top: 0.35rem; }
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
  border: 1px solid #e4e9f0;
  border-radius: 12px;
  background: #fbfcfe;
  &.wide { grid-column: 1 / -1; }
  .bulk-field-title { display: flex; align-items: center; gap: 0.55rem; margin-bottom: 0.7rem; color: #465670; font-size: 0.78rem; font-weight: 700; }
  .bulk-input, .bulk-select, .bulk-textarea {
    width: 100%; padding: 0.65rem 0.75rem; border-radius: 8px;
    border: 1px solid #dfe5ee; background: #fff; color: #273750;
    &:focus { border-color: #7189b0; }
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
  border: 1px solid #e1e7ef;
  border-radius: 8px;
  color: #596981;
  background: #fff;
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
  background: #fff;
  border-top: 1px solid #e7ebf1;
  button { padding: 0.7rem 1rem; border-radius: 9px; font-size: 0.78rem; font-weight: 650; }
  .cancel { border: 1px solid #dfe5ee; color: #5f6d83; }
  .save { background: #243b67; color: #fff; }
  @media (max-width: 640px) {
    padding: 0.75rem;
    button { flex: 1; }
  }
`;

const Styled_Form = styled.form`
  display: flex; flex-direction: column; gap: 1.4rem;
  padding: clamp(1rem, 2.5vw, 1.75rem);
  margin-bottom: 2rem;
  border: 1px solid #e1e7f0;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(30, 48, 80, 0.045);
  .header { text-align: left; margin-bottom: 0.2rem;
    h2 { color: #1b2b45; font-size: 1.1rem; font-weight: 750; letter-spacing: -0.01em; opacity: 0.96; }
    .line { display: none; }
  }
  .grid-section { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; @media (max-width: 768px) { grid-template-columns: minmax(0, 1fr); } }
  .input-group { display: flex; flex-direction: column; gap: 0.75rem;
    label { color: #66758c; font-size: 0.7rem; font-weight: 750; text-transform: none; letter-spacing: 0.02em; opacity: 1; margin-left: 0.2rem; }
    .field { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.5rem;
      background: #f8fafd; border: 1px solid #dfe6f0;
      border-radius: 9px; transition: all var(--q-transition-speed) var(--q-transition-ease);
      &:focus-within { background: #fff; border-color: #6a83b0; box-shadow: 0 0 0 3px rgba(67,101,160,0.1); }
      svg { color: #8090a8; opacity: 1; }
      input, textarea, select { flex: 1; min-width: 0; background: transparent; border: none; outline: none; color: #23334d; font-size: 0.9rem; &::placeholder { color: #a2adbd; opacity: 1; } }
      select { cursor: pointer; option { background: #fff; color: #23334d; } }
    }
  }
  .selection-box { background: #fbfcfe; border: 1px solid #e6ebf2;
    border-radius: 12px; padding: 1.25rem; height: 100%;
    .title { color: #566882; font-size: 0.72rem; font-weight: 750; text-transform: none; letter-spacing: 0.02em; opacity: 1;
      margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; svg { color: var(--main-color); } }
    .options { display: flex; flex-wrap: wrap; gap: 0.75rem;
      .option { position: relative;
        label { display: block; padding: 8px 12px; background: #f1f4f8;
          border: 1px solid #e5eaf1; border-radius: 8px; color: #68778d; font-size: 0.68rem; font-weight: 700;
          text-transform: none; cursor: pointer; transition: all var(--q-transition-speed) var(--q-transition-ease); opacity: 1; }
        input { position: absolute; opacity: 0; pointer-events: none; }
        input:checked + label { background: #e9eff8; border-color: #9badc9; color: #2e4b7b;
          box-shadow: none; }
        &:hover label { background: #e9eff8; }
      }
    }
  }
  .tech-category { margin-bottom: 1.25rem;
    &:last-child { margin-bottom: 0; }
    .cat-label { font-size: 0.65rem; font-weight: 750; text-transform: none; letter-spacing: 0.02em;
      opacity: 1; color: #8290a4; margin-bottom: 0.65rem; padding-left: 0.1rem; }
  }
  .image-upload-container { display: flex; flex-wrap: wrap; gap: 2rem; align-items: flex-start; }
  .images-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
  .image-thumb { position: relative; border-radius: 16px; overflow: hidden; width: 200px; height: 112px;
    border: 1px solid #dfe6f0; cursor: pointer;
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
  .crop-editor { background: #f6f8fb; border: 1px solid #a6b8d4;
    border-radius: 14px; padding: 1.25rem; box-shadow: 0 8px 24px rgba(36,59,103,0.08);
    .crop-editor-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;
      h3 { font-size: 0.8rem; font-weight: 800; text-transform: none; letter-spacing: 0; color: #314e7d;
        display: flex; align-items: center; gap: 0.5rem; margin: 0; } }
    .crop-container { position: relative; width: 100%; max-width: 640px; margin: 0 auto; height: 360px;
      border-radius: 16px; overflow: hidden; background: #000; }
    .crop-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.25rem; flex-wrap: wrap; }
    .crop-actions button { padding: 0.75rem 2rem; border-radius: 12px; font-weight: 800; font-size: 0.8rem;
      text-transform: uppercase; letter-spacing: 1px; cursor: pointer; border: 1px solid transparent; transition: all 0.2s; }
    .crop-actions .confirm { background: var(--main-color); color: #fff; border-color: var(--main-color);
      &:hover { filter: brightness(1.1); } }
    .crop-actions .cancel { background: #fff; color: #5d6d85; border-color: #dfe5ee;
      &:hover { background: #f4f7fb; } }
    @media (max-width: 768px) {
      .crop-container { height: 240px; }
      .crop-actions button { padding: 0.7rem 1.4rem; font-size: 0.7rem; }
    }
  }
  .visibility-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    .visibility-text { .visibility-label { color: #34445f; font-size: 0.75rem; font-weight: 750; text-transform: none;
        letter-spacing: 0; opacity: 1; display: flex; align-items: center; gap: 0.5rem;
        svg { color: #637ba1; } }
      .visibility-hint { color: #8390a3; font-size: 0.68rem; opacity: 1; margin-top: 0.35rem; max-width: 340px; } } }
  .switch { position: relative; display: inline-block; width: 52px; height: 28px; flex-shrink: 0;
    input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; margin: 0; cursor: pointer; }
    .track { position: absolute; inset: 0; background: #cbd4e1; border-radius: 999px; pointer-events: none;
      transition: background 0.2s;
      &::before { content: ""; position: absolute; height: 22px; width: 22px; left: 3px; top: 3px; background: #fff;
        border-radius: 50%; transition: transform 0.2s; } }
    input:checked + .track { background: var(--main-color);
      &::before { transform: translateX(24px); } }
    input:focus-visible + .track { outline: 2px solid #243b67; outline-offset: 2px; } }
  .rate-display { text-align: center; font-size: 1.5rem; font-weight: 900; color: var(--main-color);
    margin-bottom: 0.5rem; }
  button[type="submit"] { margin-top: 1rem; padding: 1.5rem; background: var(--main-color); border-radius: 24px;
    font-weight: 900; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.3em;
    box-shadow: 0 10px 20px rgba(var(--main-color-rgb), 0.3);
    transition: all var(--q-transition-speed) var(--q-transition-ease);
    &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(var(--main-color-rgb), 0.4); filter: brightness(1.1); }
    &:active:not(:disabled) { transform: translateY(0); }
    &:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); } }
  .form-cancel {
    align-self: flex-end;
    margin-top: 0 !important;
    padding: 0.75rem 1rem !important;
    border: 1px solid #dfe5ee !important;
    border-radius: 9px !important;
    background: #fff !important;
    color: #66758c !important;
    font-size: 0.8rem !important;
    letter-spacing: 0 !important;
    &:hover { background: #f4f7fb !important; }
  }
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
    button[type="submit"] { padding: 1rem; border-radius: 10px; font-size: 0.85rem; letter-spacing: 0.02em; }
  }
`;

const StyledTable = styled.div`
  margin-top: 2rem; overflow: hidden;
  h3 { text-align: left; margin-bottom: 1.1rem; font-size: 1rem; font-weight: 800;
    letter-spacing: -0.02em; color: #1d2c44; }
  .bulk-selection-toolbar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 0 1rem;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    background: #eaf0f8;
    border: 1px solid #d8e2f0;
    strong { color: #314a70 !important; }
  }
  .bulk-selection-actions { display: flex; align-items: center; gap: 0.6rem; margin-left: auto; }
  .bulk-menu {
    position: absolute; right: 0; top: calc(100% + 0.4rem); z-index: 5; min-width: 220px; padding: 0.35rem;
    border-radius: 10px; background: #fff; border: 1px solid #dfe6ef;
    box-shadow: 0 14px 34px rgba(30,48,80,0.14);
    button { width: 100%; padding: 0.7rem; border-radius: 7px; text-align: left; font-size: 0.78rem; }
    .edit-selected { color: #33445f; &:hover { background: #f1f5fa; } }
    .delete-selected { color: #bb5149; &:hover { background: #fff4f2; } }
  }
  .toolbar { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;
    .search-box { flex: 1; min-width: 200px; display: flex; align-items: center; gap: 0.75rem;
      padding: 0.7rem 0.9rem; background: #fff; border: 1px solid #dfe6ef;
      border-radius: 9px; transition: all var(--q-transition-speed) var(--q-transition-ease);
      svg { color: #8794a8; opacity: 1; font-size: 0.85rem; }
      input { flex: 1; min-width: 0; background: transparent; border: none; outline: none; color: #273750; font-size: 0.8rem; &::placeholder { color: #9aa6b8; opacity: 1; } }
      &:focus-within { border-color: #7189b0; box-shadow: 0 0 0 3px rgba(67,101,160,0.09); }
    }
    .filter-select, .sort-select { display: flex; align-items: center; gap: 0.5rem;
      padding: 0.65rem 0.85rem; background: #fff; border: 1px solid #dfe6ef;
      border-radius: 9px; color: #65738a; font-size: 0.7rem; font-weight: 650;
      text-transform: none; letter-spacing: 0; transition: all var(--q-transition-speed) var(--q-transition-ease);
      svg { color: #8794a8; opacity: 1; font-size: 0.75rem; }
      select { background: transparent; border: none; outline: none; color: #364760; font-size: 0.75rem; font-weight: 650;
        cursor: pointer; appearance: none; text-transform: none; letter-spacing: 0;
        option { background: #fff; color: #273750; } }
      &:focus-within { border-color: #7189b0; }
    }
    .count-badge { display: flex; align-items: center; padding: 0.75rem 1.25rem;
      background: #eaf0f8; border: 1px solid #d8e2f0;
      border-radius: 9px; font-size: 0.7rem; font-weight: 750; color: #425c82; white-space: nowrap;
      span { opacity: 0.65; margin-left: 0.35rem; } }
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.65rem;
      .search-box, .filter-select, .sort-select, .count-badge { width: 100%; min-width: 0; }
      .filter-select, .sort-select { justify-content: space-between; }
      .count-badge { justify-content: center; }
    }
  }
  .table-wrapper { overflow-x: auto; width: 100%; scrollbar-width: thin;
    scrollbar-color: #aab8cd #eef1f6;
    &::-webkit-scrollbar { height: 6px; }
    &::-webkit-scrollbar-track { background: #eef1f6; border-radius: 10px; }
    &::-webkit-scrollbar-thumb { background: #aab8cd; border-radius: 10px; } }
  table { width: 100%; min-width: 760px; border-collapse: separate; border-spacing: 0;
    th { padding: 0.8rem 1rem; text-align: left; font-size: 0.67rem; text-transform: uppercase; color: #8490a2;
      letter-spacing: 0.07em; font-weight: 750; border-bottom: 1px solid #e6ebf2; background: #f8fafd; }
    td { padding: 0.85rem 1rem; font-size: 0.83rem; color: #374760; background: #fff;
      border-bottom: 1px solid #edf0f5;
      transition: background-color 0.16s ease; vertical-align: middle;
      &:first-child { border-radius: 0; }
      &:last-child { border-radius: 0; } }
    tbody tr:last-child td { border-bottom: 0; }
    tr:hover td { background: #f8fafd; }
    .project-info { display: flex; align-items: center; gap: 0.85rem;
      img { width: 46px; height: 46px; object-fit: cover; border-radius: 9px; border: 1px solid #e3e8ef; flex-shrink: 0; }
      .title { color: #283a55; font-weight: 750; letter-spacing: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; }
      .company-badge { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px;
        border-radius: 50%; font-size: 0.7rem; flex-shrink: 0; border: 1px solid transparent;
        &.on { color: #248561; background: #e8f6ef; border-color: #c9ead9; }
        &.off { color: #8792a2; background: #f1f3f6; border-color: #e2e6ec; } } }
    .type-badges { display: flex; flex-wrap: wrap; gap: 0.35rem;
      .category-badge { display: inline-block; padding: 4px 10px; border-radius: 8px; font-size: 0.65rem;
        font-weight: 700; text-transform: none; white-space: nowrap; } }
    .actions { display: flex; gap: 0.75rem; justify-content: flex-end;
      button { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
        background: #fff; border: 1px solid #e3e8ef; cursor: pointer;
        transition: all var(--q-transition-speed) var(--q-transition-ease); border-radius: 8px; font-size: 0.85rem;
        &.edit { color: #49668f; &:hover { background: #edf3fa; border-color: #b7c7dc; transform: none; } }
        &.delete { color: #bf5a53; &:hover { background: #fff2f0; border-color: #e6b6b2; transform: none; } } } } }
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
      border: 1px solid #e3e8f0;
      border-radius: 12px;
      background: #fff;
    }
    td {
      display: flex !important;
      min-width: 0;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.7rem 0;
      border: 0 !important;
      border-bottom: 1px solid #edf0f5 !important;
      border-radius: 0 !important;
      background: transparent !important;
      &::before {
        content: attr(data-label);
        flex: 0 0 auto;
        color: #8390a3;
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
        <PanelHeader>
          <div className="brand">
            <span className="brand-mark">A</span>
            <span>ALOMAWY <span style={{ color: "#8792a5", fontSize: "0.68rem", fontWeight: 600 }}>STUDIO</span></span>
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

        <TabBar role="navigation" aria-label="Dashboard sections">
            {tabs.map((tab) => (
              <Tab key={tab.key} $active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
                <FontAwesomeIcon icon={tab.icon} />
                {t(tab.labelKey)}
              </Tab>
            ))}
        </TabBar>

        <DashboardIntro>
          <div>
            <div className="eyebrow">Workspace / {t(tabs.find((tab) => tab.key === activeTab)?.labelKey || "admin.panel_title")}</div>
            <h1>{activeTab === "overview" ? "Good to see you" : t(tabs.find((tab) => tab.key === activeTab)?.labelKey || "admin.panel_title")}</h1>
            <p>Keep your portfolio organized and ready to publish.</p>
          </div>
          {activeTab === "projects" && <span className="intro-count">{filteredProjects.length} of {projects.length} projects</span>}
        </DashboardIntro>

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
                <div style={{ height: 1, background: "#e7ebf1", margin: "1.25rem 0" }} />
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
                    <div style={{ width: "100%", height: "8px", top: "16px", backgroundColor: "#e9edf3", position: "absolute", borderRadius: "4px", overflow: "hidden" }}>
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
                  <label onClick={() => fileInputRef.current?.click()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", cursor: "pointer", padding: "2rem", border: "2px dashed #cfd8e6", borderRadius: "14px", width: "200px", color: "#71819a", background: "#f8fafd" }}>
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

              <button className="form-cancel" type="button" onClick={handleReset}>
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
                  <strong style={{ color: "#314a70", fontSize: "0.82rem" }}>{selectedProjects.length} selected</strong>
                  <div className="bulk-selection-actions">
                    <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      onClick={() => setBulkMenuOpen((open) => !open)}
                      aria-expanded={bulkMenuOpen}
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 0.85rem", borderRadius: "9px", background: "#243b67", color: "#fff", fontWeight: 700, fontSize: "0.78rem" }}
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
                  <button type="button" onClick={() => { setSelectedProjects([]); setBulkMenuOpen(false); }} style={{ padding: "0.6rem 0.75rem", borderRadius: "8px", border: "1px solid #cfd9e7", color: "#63728a", fontSize: "0.75rem" }}>
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
                <button type="button" aria-label="Close bulk editor" onClick={() => setBulkEditorOpen(false)} style={{ color: "#738097", fontSize: "1.15rem" }}>
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
                      <small style={{ display: "block", marginTop: "0.55rem", color: "#9b6b20", fontSize: "0.68rem" }}>
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
