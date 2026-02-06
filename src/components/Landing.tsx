import styled, { keyframes, css } from "styled-components";
import { useTranslation } from "react-i18next";

const float = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.02); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 30px 10px rgba(var(--main-color-rgb), 0.3); }
  50% { box-shadow: 0 0 60px 20px rgba(var(--main-color-rgb), 0.5); }
`;

const LandingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 2rem;

  @media (max-width: 991px) {
    flex-direction: column-reverse;
    padding: 1rem;
    gap: 3rem;
  }
`;

const HeroSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  gap: 4rem;
  z-index: 2;

  @media (max-width: 991px) {
    flex-direction: column-reverse;
    text-align: center;
    gap: 2rem;
  }
`;

const TextArea = styled.section`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .welcome-badge {
    background: rgba(var(--main-color-rgb), 0.15);
    color: var(--main-color);
    padding: 8px 16px;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 700;
    width: fit-content;
    text-transform: uppercase;
    letter-spacing: 2px;
    border: 1px solid rgba(var(--main-color-rgb), 0.3);
    backdrop-filter: blur(10px);

    @media (max-width: 991px) {
      margin: 0 auto;
    }
  }

  h1.main-title {
    font-size: 3.5rem;
    line-height: 1.1;
    color: #fff;
    margin: 0;
    font-weight: 800;
    
    span {
      display: block;
      background: linear-gradient(135deg, #fff 30%, var(--main-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    @media (max-width: 991px) {
      font-size: 2.5rem;
    }
  }

  p.description {
    font-size: 1.1rem;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.8);
    max-width: 600px;
    margin: 0;

    @media (max-width: 991px) {
      margin: 0 auto;
    }
  }

  .skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 1rem;

    @media (max-width: 991px) {
      justify-content: center;
    }

    .skill-chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px 20px;
      border-radius: 12px;
      color: #fff;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.3s ease;
      cursor: default;
      backdrop-filter: blur(5px);

      &:hover {
        background: var(--main-color);
        color: #000;
        transform: translateY(-5px) scale(1.05);
        box-shadow: 0 10px 20px rgba(var(--main-color-rgb), 0.3);
        border-color: var(--main-color);
      }
    }
  }
`;

const VisualSection = styled.div`
  flex: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 140%;
    height: 140%;
    background: radial-gradient(circle, rgba(var(--main-color-rgb), 0.15) 0%, transparent 70%);
    z-index: -1;
  }
`;

const ImageContainer = styled.div`
  width: 25vw;
  height: 25vw;
  max-width: 400px;
  max-height: 400px;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(var(--main-color-rgb), 0.3);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  animation: ${float} 6s ease-in-out infinite, ${glow} 4s ease-in-out infinite;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-radius: 50%;
    border-color: var(--main-color);
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.9;
    filter: drop-shadow(0 0 20px rgba(var(--main-color-rgb), 0.2));
  }

  @media (max-width: 991px) {
    width: 60vw;
    height: 60vw;
  }
`;

const BackgroundElement = styled.div<{ $top: string; $left: string; $size: string; $delay: string }>`
  position: absolute;
  top: ${props => props.$top};
  left: ${props => props.$left};
  width: ${props => props.$size};
  height: ${props => props.$size};
  background: radial-gradient(circle, rgba(var(--main-color-rgb), 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
  filter: blur(40px);
  animation: ${float} 8s ease-in-out infinite;
  animation-delay: ${props => props.$delay};
`;

const Landing = () => {
  const { t } = useTranslation();

  const skills: string[] = [
    "HTML", "CSS", "JavaScript", "ReactJS", "NextJs", "TypeScript", "Sass", "GITHUB", "Tailwind"
  ];

  return (
    <LandingContainer>
      <BackgroundElement $top="10%" $left="5%" $size="300px" $delay="0s" />
      <BackgroundElement $top="60%" $left="80%" $size="400px" $delay="-2s" />
      
      <HeroSection>
        <TextArea>
          <div className="welcome-badge">{t("info.welcome")}</div>
          <h1 className="main-title">
            <span>{t("info.fullname")}</span>
            {t("info.description.work")}
          </h1>
          <p className="description">
            {t("info.description.from")}
            <br />
            {t("info.description.website")}
            <br />
            {t("info.description.technology")}
          </p>
          
          <div className="skills-grid">
            {skills.map(skill => (
              <span key={skill} className="skill-chip">
                {skill}
              </span>
            ))}
          </div>
        </TextArea>

        <VisualSection>
          <ImageContainer>
            <img src="./logos/newLogo.webp" alt="Alomawy Logo" />
          </ImageContainer>
        </VisualSection>
      </HeroSection>
    </LandingContainer>
  );
};

export default Landing;
