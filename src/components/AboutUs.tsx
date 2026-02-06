import {
  faBriefcase,
  faChartSimple,
  faDiagramProject,
  faDumbbell,
  faHeartPulse,
  faMapPin,
  faShieldHeart,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { calculate } from "../utils";

const StyledAboutUs = styled.div`
  height: 100%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  gap: 2rem;

  @media (max-width: 900px) {
    flex-direction: column;
    padding: 1rem;
  }

  .info-box {
    flex: 1.5;
    background: rgba(255, 255, 255, 0.03);
    max-width: 65%;
    border-radius: 35px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(15px);
    padding: 1.5rem;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
      border-color: rgba(var(--main-color-rgb), 0.3);
      transform: translateY(-5px);
    }

    @media (max-width: 900px) {
      max-width: 100%;
    }

    > div {
      display: flex;
      padding: 1.2rem;
      align-items: center;
      gap: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);

      &:last-child {
        border-bottom: none;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      > div:first-child {
        width: 180px;
        min-width: 150px;
        display: flex;
        align-items: center;
        opacity: 0.9;

        span {
          margin: 0 0.5rem;
          font-weight: 600;
          font-size: 1rem;
          color: #eee;
        }
        
        span:first-child {
            width: auto;
            color: var(--main-color);
            font-size: 1.1rem;
        }
      }

      > span, > p {
        font-size: 1.05rem;
        font-weight: 500;
        color: #fff;
        letter-spacing: 0.5px;
      }
    }

    .skills-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 12px;
      padding: 1rem 0;
      width: 100%;

      span {
        padding: 8px 16px;
        border-radius: 12px;
        background: rgba(var(--main-color-rgb), 0.1);
        border: 1px solid rgba(var(--main-color-rgb), 0.2);
        white-space: nowrap;
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--main-color);
        transition: all 0.3s ease;
        cursor: default;

        &:hover {
          background: var(--main-color);
          color: #000;
          transform: scale(1.1) translateY(-3px);
          box-shadow: 0 5px 15px rgba(var(--main-color-rgb), 0.4);
        }
      }
    }
  }
`;

const AnimationArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 900px) {
    width: 60vw;
    height: 60vw;
    margin-top: 3rem;
  }

  .animation-ball {
    width: 250px;
    height: 250px;
    background-image: linear-gradient(
      135deg,
      var(--main-color),
      var(--background-main-color)
    );
    border-radius: 50%;
    opacity: 0.8;
    box-shadow: 0 0 50px rgba(var(--main-color-rgb), 0.5);
    animation: ball-animation 8s ease-in-out infinite alternate;

    @media (max-width: 1100px) {
      width: 200px;
      height: 200px;
    }
  }

  @keyframes ball-animation {
    0% {
      border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
      transform: scale(1) rotate(0deg);
    }
    33% {
      border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%;
      transform: scale(1.1) rotate(10deg);
    }
    66% {
      border-radius: 30% 70% 70% 30% / 50% 40% 30% 60%;
      transform: scale(0.95) rotate(-5deg);
    }
    100% {
      border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
      transform: scale(1) rotate(0deg);
    }
  }
`;

const AboutUs = () => {
  const { t } = useTranslation();

  const skills: string[] = [
    "HTML",
    "CSS",
    "Sass",
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Tailwind",
    "Bootstrap",
    "GitHub & Git",
  ];

  return (
    <StyledAboutUs>
      <div className="info-box">
        <div className="name">
          <div>
            <span>
              <FontAwesomeIcon icon={faSignature} />
            </span>
            <span>{t("about.fullname")}</span>
          </div>
          <span>{t("info.fullname")}</span>
        </div>

        <div className="age">
          <div>
            <span>
              <FontAwesomeIcon icon={faHeartPulse} />
            </span>
            <span>{t("about.age")}</span>
          </div>
          <p>{calculate("2006-06-22")}</p>
        </div>

        <div>
          <div>
            <span>
              <FontAwesomeIcon icon={faShieldHeart} />
            </span>
            <span>{t("about.marital_status")}</span>
          </div>
          <span>{t("about.marital_status_now")}</span>
        </div>

        <div>
          <div>
            <span>
              <FontAwesomeIcon icon={faBriefcase} />
            </span>
            <span>{t("about.work")}</span>
          </div>
          <span>{t("about.work_now")}</span>
        </div>
        <div>
          <div>
            <span>
              <FontAwesomeIcon icon={faMapPin} />
            </span>
            <span>{t("about.position")}</span>
          </div>
          <span>{t("about.position_now")}</span>
        </div>
        <div>
          <div>
            <span>
              <FontAwesomeIcon icon={faDiagramProject} />
            </span>
            <span>{t("about.status")}</span>
          </div>
          <span>{t("about.status_now")}</span>
        </div>
        <div>
          <div>
            <span>
              <FontAwesomeIcon icon={faChartSimple} />
            </span>
            <span>{t("about.exp")}</span>
          </div>
          <span>{calculate("2021-01-04")}</span>
        </div>

        <div>
          <div>
            <span>
              <FontAwesomeIcon icon={faDumbbell} />
            </span>
            <span>{t("about.skills")}</span>
          </div>
          <div className="skills-container">
            {skills &&
              skills.map((skill) => (
                <span key={skill}>
                  {skill}
                </span>
              ))}
          </div>
        </div>
      </div>

      <AnimationArea className="animation-area">
        <div className="animation-ball b-blur"></div>
      </AnimationArea>
    </StyledAboutUs>
  );
};

export default AboutUs;
