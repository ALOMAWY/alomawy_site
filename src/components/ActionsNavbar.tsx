import {
  faBrush,
  faCircleInfo,
  faDownload,
  faGaugeHigh,
  faLanguage,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { useMyContext } from "./Context";
import Name from "./Name";
import { useTranslation } from "react-i18next";
import { handleChangeLang, handleSetTheme } from "../utils";
import { getItemFromLocalStorage } from "../utils/localStorage";
import { QualityLevel } from "../utils/quality";

const Styled_Navbar = styled.nav``;

const Holder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1.5rem;
`;

const Buttons_List = styled.ul`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
`;

export const Navigation_Button = styled.li`
  min-width: 44px;
  height: 44px;
  transition: all var(--q-transition-speed) var(--q-transition-ease);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  cursor: pointer;

  button {
    text-transform: uppercase;
    font-weight: 900;
    font-size: 0.75rem;
    letter-spacing: 1px;
    padding: 0 1rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    color: #fff;
    opacity: 0.7;
    transition: all var(--q-transition-speed) var(--q-transition-ease);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--main-color);
    transform: translateY(-2px);
    
    svg {
      color: var(--main-color);
      opacity: 1;
      transform: scale(1.1);
    }
  }

  &::before {
    display: none; /* Removed old spinning border */
  }

  a {
    position: relative;
    z-index: 2;
    padding: 0 1.25rem;
    height: 100%;
    display: flex;
    align-items: center;
    font-weight: 900;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: rgba(255, 255, 255, 0.7);
    transition: all var(--q-transition-speed) var(--q-transition-ease);

    &:hover {
      color: #fff;
    }
  }
`;

const ActionsNavbar = () => {
  const { isList, setIsList, qualityLevel, setQualityLevel } = useMyContext();
  const { i18n, t } = useTranslation();

  const cycleQuality = () => {
    const cycle: QualityLevel[] = ["low", "medium", "high"];
    const idx = cycle.indexOf(qualityLevel);
    setQualityLevel(cycle[(idx + 1) % cycle.length]);
  };

  return (
    <Holder className={!isList ? "translate-x-l" : ""}>
      <Name />
      <Styled_Navbar>
        <Buttons_List>
          <Navigation_Button
            className="theme-btn"
            onClick={() => {
              const currentColor = getItemFromLocalStorage(
                "theme-color",
                "blue"
              );
              handleSetTheme(currentColor, true);
            }}
          >
            <button>
              <FontAwesomeIcon icon={faBrush} />
            </button>
          </Navigation_Button>
          <Navigation_Button
            className="theme-btn"
            onClick={() => handleChangeLang(i18n)}
          >
            <button>
              <FontAwesomeIcon icon={faLanguage} />
            </button>
          </Navigation_Button>
          <Navigation_Button className="theme-btn">
            <button>
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </Navigation_Button>
          <Navigation_Button className="theme-btn">
            <button>
              <FontAwesomeIcon icon={faCircleInfo} />
            </button>
          </Navigation_Button>

          <Navigation_Button className="theme-btn" onClick={cycleQuality} title={`${t("info.quality") || "Quality"}: ${t(`info.quality_${qualityLevel}`) || qualityLevel}`}>
            <button>
              <FontAwesomeIcon icon={faGaugeHigh} />
            </button>
          </Navigation_Button>

          <Navigation_Button
            className="theme-btn"
            onClick={() => setIsList(!isList)}
          >
            <button>
              <FontAwesomeIcon icon={faList} />
            </button>
          </Navigation_Button>
        </Buttons_List>
      </Styled_Navbar>
    </Holder>
  );
};

export default ActionsNavbar;
