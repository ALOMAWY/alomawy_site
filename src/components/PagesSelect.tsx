import { faChevronDown, faHome, faBriefcase, faImages, faEnvelope, faUser, faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { keyframes } from "styled-components";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { useMyContext } from "./Context";

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

  .page-info {
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
    
    .current-page {
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
    .page-info .label { display: none; }
  }
`;

const DropdownMenu = styled.div<{ $dir: string }>`
  position: absolute;
  top: calc(100% + 10px);
  ${props => props.$dir === 'rtl' ? 'left: 0;' : 'right: 0;'}
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
  pointer-events: auto;

  @media (max-width: 480px) {
    width: 200px;
  }
`;

const DropdownItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  color: ${props => props.$active ? 'var(--main-color)' : 'rgba(255, 255, 255, 0.7)'};
  background: ${props => props.$active ? 'rgba(var(--main-color-rgb), 0.1)' : 'transparent'};
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all var(--q-transition-speed) var(--q-transition-ease);

  svg {
    width: 16px;
    opacity: ${props => props.$active ? '1' : '0.5'};
    color: ${props => props.$active ? 'var(--main-color)' : '#fff'};
  }

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
    svg { opacity: 1; color: var(--main-color); }
  }
`;

const PagesSelect = () => {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [isDropdownReady, setIsDropdownReady] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const { registerDropdown } = useMyContext();

  // Sync global state
  useEffect(() => {
    registerDropdown('pages-select', localIsOpen);
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

  const getPageName = () => {
    const path = location.pathname;
    if (path === "/") return t("sections.home");
    const section = path.substring(1).split('/')[0];
    return t(`sections.${section}`) || section;
  };

  const menuItems = [
    { name: t("sections.home"), path: "/", icon: faHome },
    { name: t("sections.services"), path: "/services", icon: faBriefcase },
    { name: t("sections.portfolio"), path: "/portfolio", icon: faImages },
    { name: t("sections.contact_us"), path: "/contact_us", icon: faEnvelope },
    { name: t("sections.about_us"), path: "/about_us", icon: faUser },
    { name: t("sections.social_media"), path: "/social_media", icon: faHashtag },
  ];

  return (
    <DropdownWrapper ref={dropdownRef}>
      <Styled_MenuButton 
        type="button"
        $isOpen={localIsOpen} 
        onClick={(e) => {
          console.log('Button clicked, preventing default');
          e.preventDefault();
          e.stopPropagation();
          setLocalIsOpen(!localIsOpen);
          console.log('Dropdown state toggled to:', !localIsOpen);
        }}
      >
        <div className="page-info">
          <span className="label">{t("dashboard.page_label") || "Page"}</span>
          <span className="current-page">{getPageName()}</span>
        </div>
        <FontAwesomeIcon icon={faChevronDown} className="chevron" />
      </Styled_MenuButton>

      {localIsOpen && (
        <DropdownMenu $dir={i18n.dir()} style={{ pointerEvents: isDropdownReady ? 'auto' : 'none' }}>
          {menuItems.map((item) => (
            <DropdownItem 
              key={item.path} 
              to={item.path} 
              $active={location.pathname === item.path}
              onClick={(e) => {
                console.log('Dropdown item clicked:', item.path, 'Ready:', isDropdownReady);
                if (!isDropdownReady) {
                  console.log('Not ready, preventing');
                  e.preventDefault();
                  return;
                }
                // Prevent navigation to current page
                if (location.pathname === item.path) {
                  console.log('Already on this page, preventing navigation');
                  e.preventDefault();
                }
                setLocalIsOpen(false);
              }}
            >
              <FontAwesomeIcon icon={item.icon} />
              {item.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownWrapper>
  );
};

export default PagesSelect;
