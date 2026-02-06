import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useMyContext } from "./Context";

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = "https://alomawy-site.vercel.app";

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
  gap: 1rem;
  justify-content: center;
  color: #fff;
  width: fit-content;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  padding: 8px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin: 0 auto;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);

  @media (max-width: 991px) {
    width: 95%;
    gap: 0.5rem;
    padding: 6px;
  }

  @media (max-width: 485px) {
    flex-wrap: wrap;
    border-radius: 16px;
  }
`;

const CategoryItem = styled.div<{ $active?: boolean; $isCount?: boolean }>`
  cursor: pointer;
  padding: 10px 20px;
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: ${props => props.$active ? 'var(--main-color)' : 'transparent'};
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.5)'};
  box-shadow: ${props => props.$active ? '0 8px 20px -5px rgba(var(--main-color-rgb), 0.5)' : 'none'};

  ${props => props.$isCount && `
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--main-color);
    padding-left: 20px;
    margin-left: 10px;
    cursor: default;
    border-radius: 0;
    
    @media (max-width: 485px) {
      border-left: none;
      width: 100%;
      text-align: center;
      margin-left: 0;
      padding: 5px;
    }
  `}

  &:hover {
    ${props => !props.$active && !props.$isCount && `
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      transform: translateY(-2px);
    `}
  }

  &:active {
    transform: scale(0.95);
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
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
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

const Portfolio = () => {
  const { newProject } = useMyContext();
  const { t } = useTranslation();

  const [projects, setProjects] = useState<any[]>([]);

  const [category, setCategory] = useState<string>("all");
  const categoriesList = [
    { text: t("portfolio.category.all"), value: "all" },
    { text: t("portfolio.category.website"), value: "website" },
    { text: t("portfolio.category.game"), value: "game" },
    { text: t("portfolio.category.simple"), value: "simple" },
    { text: t("portfolio.category.dashboard"), value: "dashboard" },
    { text: t("portfolio.category.app"), value: "app" },
  ];

  const filteredProjects = useMemo(() => {
    if (category === "all") {
      return projects;
    } else {
      return projects.filter((pr) => pr.type == category);
    }
  }, [category, projects]);

  const handleFetchingData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
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
            {cate.text}
          </CategoryItem>
        ))}
        <CategoryItem $isCount>
          {filteredProjects.length < 10 ? `0${filteredProjects.length}` : filteredProjects.length}
        </CategoryItem>
      </Categories>
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
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  padding: 24px;
  color: #fff;
  box-shadow: 
    0 10px 30px -10px rgba(0, 0, 0, 0.5),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.05);
    border-color: ${props => props.$color}50;
    box-shadow: 
      0 20px 40px -15px rgba(0, 0, 0, 0.6),
      0 0 20px -5px ${props => props.$color}30,
      inset 0 1px 1px rgba(255, 255, 255, 0.15);
  }

  h1 {
    font-size: 1.4rem;
    font-weight: 900;
    margin: 0 0 16px 0;
    text-transform: uppercase;
    letter-spacing: 2px;
    background: linear-gradient(to right, #fff, ${props => props.$color});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .image-container {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.4));
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

  .infos {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;

    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      font-size: 0.8rem;
      border: 1px solid rgba(255, 255, 255, 0.02);

      .label {
        opacity: 0.4;
        text-transform: uppercase;
        font-weight: 900;
        letter-spacing: 1px;
        font-size: 0.7rem;
      }

      .value {
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 60%;
      }
    }
  }

  .visit-btn {
    margin-top: auto;
    width: 100%;
    padding: 16px;
    background: ${props => props.$accent};
    border: 1px solid ${props => props.$color}40;
    border-radius: 16px;
    color: #fff;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 4px;
    transition: all 0.3s ease;
    text-align: center;
    text-decoration: none;

    &:hover {
      background: ${props => props.$color};
      box-shadow: 0 0 20px ${props => props.$color}50;
      transform: scale(1.02);
    }
    
    &:active {
      transform: scale(0.98);
    }
  }
`;

const Card = ({ project }: any) => {
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

  let color: string = "";
  let accentBg: string = "";

  switch (type) {
    case "website":
      color = "#3498db";
      accentBg = "rgba(52, 152, 219, 0.1)";
      break;
    case "game":
      color = "#9b59b6";
      accentBg = "rgba(155, 89, 182, 0.1)";
      break;
    case "simple":
      color = "#2ecc71";
      accentBg = "rgba(46, 204, 113, 0.1)";
      break;
    case "dashboard":
      color = "#f1c40f";
      accentBg = "rgba(241, 196, 15, 0.1)";
      break;
    case "app":
      color = "#e91e63";
      accentBg = "rgba(233, 30, 99, 0.1)";
      break;
    default:
      color = "#3498db";
      accentBg = "rgba(52, 152, 219, 0.1)";
      break;
  }

  const projectImage = image?.startsWith('/uploads') ? `${API_URL}${image}` : image;

  return (
    <StyledCard $color={color} $accent={accentBg}>
      <h1>{title}</h1>
      <div className="image-container">
        <img src={projectImage || "./assets/project-placeholder.png"} alt="Project" />
      </div>

      <div className="infos">
        <div className="info">
          <span className="label text-color-main">{t("portfolio.developer")}</span>
          <span className="value">{developer}</span>
        </div>

        <div className="info">
          <span className="label">{t("portfolio.type")}</span>
          <span className="value">{type}</span>
        </div>

        <div className="info">
          <span className="label">{t("portfolio.source")}</span>
          <span className="value">{source}</span>
        </div>

        <div className="info">
          <span className="label">{t("portfolio.disc")}</span>
          <span className="value">{disc}</span>
        </div>

        <div className="info">
          <span className="label">{t("portfolio.techs")}</span>
          <span className="value">
            {techs?.map((e: any, i: number) => (
              <span key={i}>{e}{i < techs.length - 1 ? ", " : ""}</span>
            ))}
          </span>
        </div>

        <div className="info">
          <span className="label">{t("portfolio.rate")}</span>
          <span className="value">
            <Rate rate={rate} color={color} />
          </span>
        </div>
      </div>

      <a href={visit} className="visit-btn" target="_blank" rel="noreferrer">
        {t("portfolio.visit") || "Visit"}
      </a>
    </StyledCard>
  );
};

export default Portfolio;
