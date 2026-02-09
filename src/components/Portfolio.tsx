import { useEffect, useMemo, useState, memo, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, 
  faSpinner, 
  faChevronDown, 
  faLayerGroup, 
  faGlobe, 
  faGamepad, 
  faCode, 
  faChartPie, 
  faMobileAlt 
} from "@fortawesome/free-solid-svg-icons";
import { useMyContext } from "./Context";
import { getProjectTypeStyle } from "../utils";

const API_URL = import.meta.env.VITE_API_URL;

const Styled_Portfolio = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(calc((100% / 3) - 1rem), calc(100% / 3 - 1rem))
  );
  position: relative;
  justify-content: center;

  @media (max-width: 991px) {
    grid-template-columns: repeat(
      auto-fit,
      minmax(calc((100% / 2) - 1rem), calc(100% / 2 - 1rem))
    );
  }

  @media (max-width: 668px) {
    grid-template-columns: repeat(
      auto-fit,
      minmax(calc((100% / 1) - 1rem), calc(100% / 1 - 1rem))
    );
  }

  gap: 1rem;
  margin: 2rem 0;
`;

const Categories = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
  color: #fff;
  width: fit-content;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  padding: 8px;
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0 auto 3rem auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);

  @media (max-width: 900px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: calc(100% - 2rem);
    max-width: 500px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 20px;
    padding: 6px;
    gap: 6px;
  }
`;

const CategoryItem = styled.div<{ $active?: boolean; $isCount?: boolean }>`
  cursor: pointer;
  padding: 10px 20px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 30px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  background: ${props => props.$active ? 'var(--main-color)' : 'transparent'};
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.6)'};
  border: 1px solid ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};

  @media (max-width: 900px) {
    flex-direction: column;
    padding: 12px 6px;
    border-radius: 12px;
    font-size: 0.6rem;
    gap: 6px;
    letter-spacing: 0;
    
    background: ${props => props.$active ? 'rgba(var(--main-color-rgb), 0.2)' : 'rgba(255, 255, 255, 0.03)'};
    color: ${props => props.$active ? 'var(--main-color)' : 'rgba(255, 255, 255, 0.5)'};
    border-color: ${props => props.$active ? 'rgba(var(--main-color-rgb), 0.4)' : 'rgba(255, 255, 255, 0.05)'};
    
    svg {
      font-size: 1.1rem;
      opacity: ${props => props.$active ? '1' : '0.5'};
    }
  }

  ${props => props.$isCount && `
    background: rgba(255, 255, 255, 0.1);
    color: var(--main-color);
    cursor: default;
    @media (max-width: 900px) {
      grid-column: span 3;
      padding: 6px;
      font-size: 0.8rem;
      flex-direction: row;
      background: transparent;
      border: none;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 0;
    }
  `}

  &:hover {
    ${props => !props.$active && !props.$isCount && `
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    `}
  }
`;

const NoItemsMessage = styled.h1`
  width: fit-content;
  color: #fff;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 3px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 3rem 4rem;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  opacity: 0.6;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  
  @media (max-width: 768px) {
    padding: 2rem;
    font-size: 1rem;
    width: 90%;
  }
`;

const PortfolioSection = styled.div`
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  width: 100%;
  gap: 4rem;
  color: #fff;
  padding: 2rem;

  .square-loader {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    width: 120px;
    height: 120px;
    transform: rotate(45deg);

    @media (max-width: 768px) {
      width: 80px;
      height: 80px;
    }

    div {
      width: 100%;
      height: 100%;
      background: rgba(var(--main-color-rgb), 0.15);
      border: 2px solid rgba(var(--main-color-rgb), 0.4);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      box-shadow: 0 0 20px rgba(var(--main-color-rgb), 0.2);
      animation: square-anim 1.5s infinite ease-in-out;

      &:nth-child(1) { animation-delay: 0s; }
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
      &:nth-child(4) { animation-delay: 0.6s; }
    }
  }

  @keyframes square-anim {
    0%, 100% {
      transform: scale(1);
      background: rgba(var(--main-color-rgb), 0.15);
      border-color: rgba(var(--main-color-rgb), 0.4);
    }
    50% {
      transform: scale(1.2);
      background: var(--main-color);
      border-color: var(--main-color);
      box-shadow: 0 0 30px var(--main-color);
    }
  }

  p {
    font-size: 1.8rem;
    font-weight: 900;
    letter-spacing: 8px;
    text-transform: uppercase;
    opacity: 0.9;
    background: linear-gradient(135deg, #fff 30%, var(--main-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
    margin-top: 1rem;

    @media (max-width: 768px) {
      font-size: 1.2rem;
      letter-spacing: 4px;
    }
  }
`;

const Portfolio = () => {
  const { newProject } = useMyContext();
  const { t } = useTranslation();

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>("all");

  const categoriesList = [
    { text: t("portfolio.category.all"), value: "all", icon: faLayerGroup },
    { text: t("portfolio.category.website"), value: "website", icon: faGlobe },
    { text: t("portfolio.category.game"), value: "game", icon: faGamepad },
    { text: t("portfolio.category.simple"), value: "simple", icon: faCode },
    { text: t("portfolio.category.dashboard"), value: "dashboard", icon: faChartPie },
    { text: t("portfolio.category.app"), value: "app", icon: faMobileAlt },
  ];

  const filteredProjects = useMemo(() => {
    if (category === "all") return projects;
    return projects.filter((pr) => pr.type == category);
  }, [category, projects]);

  const handleFetchingData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      setProjects(await response.json());
    } catch (error) {
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    handleFetchingData();
  }, [newProject]);

  return (
    <PortfolioSection>
      <Categories className="categories">
        {categoriesList.map((cate) => (
          <CategoryItem
            key={cate.value}
            $active={category === cate.value}
            onClick={() => setCategory(cate.value)}
          >
            <FontAwesomeIcon icon={cate.icon} />
            {cate.text}
          </CategoryItem>
        ))}
        <CategoryItem $isCount>
          {filteredProjects.length < 10 ? `0${filteredProjects.length}` : filteredProjects.length}
        </CategoryItem>
      </Categories>

      {loading ? (
        <LoaderContainer>
          <div className="square-loader">
            <div />
            <div />
            <div />
            <div />
          </div>
          <p>{t("info.loading")}</p>
        </LoaderContainer>
      ) : (
        <>
          <Styled_Portfolio>
            {filteredProjects.map((project) => (
              <Card key={project._id} project={project} />
            ))}
          </Styled_Portfolio>
          {!filteredProjects.length && (
            <NoItemsMessage>
              {t("portfolio.no_projects")}
            </NoItemsMessage>
          )}
        </>
      )}
    </PortfolioSection>
  );
};

const Rate = ({ rate, color }: { rate: string; color: string }) => {
  const rateFrom5: number = +rate / 20;

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          <FontAwesomeIcon
            icon={faStar}
            color={star < rateFrom5 || star == 1 ? color : color + "40"}
          />
        </span>
      ))}
    </div>
  );
};

const StyledCard = styled.div<{ $color: string; $accent: string }>`
  width: 100%;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  @media (max-width: 768px) {
    backdrop-filter: blur(4px);
    padding: 16px;
  }
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 40px;
  overflow: hidden;
  transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  display: flex;
  flex-direction: column;
  padding: 24px;
  color: #fff;
  box-shadow: 
    0 10px 30px -10px rgba(0, 0, 0, 0.5),
    inset 0 1px 1px rgba(255, 255, 255, 0.05);

  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.05);
    border-color: ${props => props.$color}50;
    box-shadow: 
      0 25px 50px -15px rgba(0, 0, 0, 0.7),
      0 0 30px -5px ${props => props.$color}40,
      inset 0 1px 1px rgba(255, 255, 255, 0.1);
  }

  .image-container {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 24px;
    overflow: hidden;
    margin-bottom: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.5));
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  &:hover .image-container img {
    transform: scale(1.1);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    flex-grow: 1;
  }

  .header-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    h1 {
      font-size: 1.5rem;
      font-weight: 900;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 1px;
      line-height: 1.2;
      background: linear-gradient(to right, #fff, ${props => props.$color});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .description {
    font-size: 0.9rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-weight: 400;
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .tag {
    padding: 6px 12px;
    background: ${props => props.$accent};
    border: 1px solid ${props => props.$color}30;
    border-radius: 100px;
    font-size: 0.65rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${props => props.$color};
    transition: all 0.3s ease;

    &:hover {
      background: ${props => props.$color}20;
      border-color: ${props => props.$color};
    }
  }

  .langs-tag {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .label {
        font-size: 0.6rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        opacity: 0.4;
        font-weight: 900;
      }

      .value {
        font-size: 0.8rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;

    .visit-btn {
      flex: 1;
      padding: 14px;
      background: ${props => props.$color};
      border-radius: 16px;
      color: #fff;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2px;
      transition: all 0.3s ease;
      text-align: center;
      text-decoration: none;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      &:hover {
        box-shadow: 0 10px 20px ${props => props.$color}40;
        transform: translateY(-2px);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
`;

const Card = memo(({ project }: any) => {
  const { t } = useTranslation();

  const {
    title,
    image,
    developer,
    type,
    source,
    disc,
    techs,
    langs,
    rate,
    visit,
  } = project;

  const { color, accentBg } = getProjectTypeStyle(type);

  const projectImage = image?.startsWith('/uploads') ? `${API_URL}${image}` : image;

  return (
    <StyledCard $color={color} $accent={accentBg}>
      <div className="image-container">
        <img src={projectImage || "./assets/project-placeholder.png"} alt="Project" loading="lazy" />
      </div>

      <div className="content">
        <div className="header-info">
          <h1>{title}</h1>
          <Rate rate={rate} color={color} />
        </div>

        <p className="description">{disc}</p>

        <div className="tags-container">
          {techs?.map((tech: string, i: number) => (
            <span key={i} className="tag">{tech}</span>
          ))}
          {langs?.map((lang: string, i: number) => (
            <span key={`lang-${i}`} className="tag langs-tag">{lang}</span>
          ))}
        </div>

        <div className="info-grid">
          <div className="info-item">
            <span className="label text-color-main">{t("portfolio.developer")}</span>
            <span className="value">
              {developer}
              {["ALOMAWY", "alomawy", "Abdalrahman ALDABBAS"].includes(developer) && (
                <span style={{ fontSize: "0.7em", color: "var(--main-color)", marginLeft: "5px", fontFamily: "cursive" }}>
                  (Me)
                </span>
              )}
            </span>
          </div>

          <div className="info-item">
            <span className="label">{t("portfolio.type")}</span>
            <span className="value">{t(`portfolio.category.${type}`)}</span>
          </div>

          <div className="info-item">
            <span className="label">{t("portfolio.source")}</span>
            <span className="value">{source}</span>
          </div>
        </div>

        <div className="actions">
          <a href={visit} className="visit-btn" target="_blank" rel="noreferrer">
            {t("portfolio.visit") || "Visit"}
          </a>
        </div>
      </div>
    </StyledCard>
  );
});

export default Portfolio;
