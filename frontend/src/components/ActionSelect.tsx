import { faPuzzlePiece, faChevronDown, faBrush, faLanguage, faDownload, faCircleInfo, faGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { handleChangeLang, handleSetTheme } from "../utils";
import { getItemFromLocalStorage } from "../utils/localStorage";
import { useMyContext } from "./Context";
import { QualityLevel } from "../utils/quality";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DropdownWrapper = styled.div`
  position: relative;
  z-index: 10001;
`;

const Styled_MenuButton = styled.button<{ $isOpen: boolean }>`
  min-width: 140px;
  height: 44px;
  transition: all var(--q-transition-speed) var(--q-transition-ease);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background: ${props => props.$isOpen ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$isOpen ? 'var(--main-color)' : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 12px;
  cursor: pointer;
  gap: 0.75rem;

  .action-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    
    .label {
      font-size: 0.55rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.4;
      font-weight: 900;
      margin-bottom: -2px;
    }
    
    .current-action {
      font-size: 0.7rem;
      font-weight: 800;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }

  .chevron {
    color: #fff;
    opacity: 0.6;
    font-size: 0.7rem;
    transition: transform var(--q-transition-speed) var(--q-transition-ease);
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--main-color);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    min-width: 100px;
    padding: 0 0.75rem;
    .action-info .label { display: none; }
  }
`;

const DropdownMenu = styled.div<{ $dir: string }>`
  position: absolute;
  top: calc(100% + 10px);
  ${props => props.$dir === 'rtl' ? 'right: 0;' : 'left: 0;'}
  width: 220px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: var(--q-blur-dropdown);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} var(--q-transition-speed) ease-out forwards;
  z-index: 10002;
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 480px) {
    width: 200px;
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  background: transparent;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all var(--q-transition-speed) var(--q-transition-ease);

  svg {
    width: 16px;
    opacity: 0.5;
    color: #fff;
    transition: all var(--q-transition-speed) var(--q-transition-ease);
  }

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
    svg { opacity: 1; color: var(--main-color); }
  }
`;

const ActionSelect = () => {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [isDropdownReady, setIsDropdownReady] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { i18n, t } = useTranslation();
  const { registerDropdown, qualityLevel, setQualityLevel } = useMyContext();

  // Sync global state
  useEffect(() => {
    registerDropdown('action-select', localIsOpen);
  }, [localIsOpen, registerDropdown]);

  // Add delay before dropdown items become clickable
  useEffect(() => {
    if (localIsOpen) {
      const timer = setTimeout(() => setIsDropdownReady(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsDropdownReady(false);
    }
  }, [localIsOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLocalIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (type: string) => {
    switch (type) {
      case 'theme':
        const currentColor = getItemFromLocalStorage("theme-color", "blue");
        handleSetTheme(currentColor, true);
        break;
      case 'lang':
        handleChangeLang(i18n);
        break;
      case 'quality':
        const cycle: QualityLevel[] = ["low", "medium", "high"];
        const idx = cycle.indexOf(qualityLevel);
        setQualityLevel(cycle[(idx + 1) % cycle.length]);
        break;
      default:
        break;
    }
  };

  const qualityLabel = t(`info.quality_${qualityLevel}`) || qualityLevel.charAt(0).toUpperCase() + qualityLevel.slice(1);

  return (
    <DropdownWrapper ref={dropdownRef}>
      <Styled_MenuButton 
        type="button"
        $isOpen={localIsOpen} 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setLocalIsOpen(!localIsOpen);
        }}
      >
        <div className="action-info">
          <span className="label">Tools</span>
          <span className="current-action">{t("dashboard.actions") || "Actions"}</span>
        </div>
        <FontAwesomeIcon icon={faChevronDown} className="chevron" />
      </Styled_MenuButton>

      {localIsOpen && (
        <DropdownMenu $dir={i18n.dir()} style={{ pointerEvents: isDropdownReady ? 'auto' : 'none' }}>
          <DropdownItem onClick={() => { if (isDropdownReady) { handleAction('theme'); setLocalIsOpen(false); } }}>
            <FontAwesomeIcon icon={faBrush} />
            {t("info.change_theme") || "Change Theme"}
          </DropdownItem>
          <DropdownItem onClick={() => { if (isDropdownReady) { handleAction('lang'); setLocalIsOpen(false); } }}>
            <FontAwesomeIcon icon={faLanguage} />
            {t("info.change_lang") || "Change Language"}
          </DropdownItem>
          <DropdownItem onClick={() => { if (isDropdownReady) setLocalIsOpen(false); }}>
            <FontAwesomeIcon icon={faDownload} />
            {t("info.download") || "Download App"}
          </DropdownItem>
          <DropdownItem onClick={() => { if (isDropdownReady) setLocalIsOpen(false); }}>
            <FontAwesomeIcon icon={faCircleInfo} />
            {t("info.about") || "Project Info"}
          </DropdownItem>
          <DropdownItem onClick={() => { if (isDropdownReady) { handleAction('quality'); setLocalIsOpen(false); } }}>
            <FontAwesomeIcon icon={faGaugeHigh} />
            {t("info.quality") || "Quality"}: {qualityLabel}
          </DropdownItem>
        </DropdownMenu>
      )}
    </DropdownWrapper>
  );
};

export default ActionSelect;
