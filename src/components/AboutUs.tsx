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
  padding: 1rem;

  @media (max-width: 800px) {
    flex-direction: column;
  }

  .info-box {
    flex: 1;
    background: rgba(255, 255, 255, 0.03);
    max-width: 50%;
    border-radius: 40px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(12px);
    padding: 1rem;
    transition: 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 800px) {
      max-width: 100%;
    }

    > div {
      display: flex;
      padding: 1rem;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);

      &:last-child {
        border-bottom: none;
      }

      > div:first-child {
        width: 200px;
        max-width: 40%;
        display: flex;
        align-items: center;
        opacity: 0.8;

        span {
          margin: 0 0.4rem;
          width: 100%;
          font-weight: bold;
          font-size: 0.9rem;
        }
        
        span:first-child {
            width: auto;
            color: var(--main-color);
        }
      }
    }
  }
`;

const AnimationArea = styled.div`
  width: 20vw;
  height: 20vw;
  position: relative;

  @media (max-width: 800px) {
    width: 60vw;
    height: 60vw;
    margin-top: 2rem;
  }

  .animation-ball {
    width: 80%;
    height: 80%;
    background-image: linear-gradient(
      120deg,
      var(--main-color),
      var(--background-main-color)
    );
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.8;
    box-shadow: 0 0 40px var(--main-color);
    animation: ball-animation 5s linear infinite forwards;
  }

  @keyframes ball-animation {
    0% {
      border-radius: 5% 5% 5% 5% / 5% 5% 5% 5%;
      transform: translate(-50%, -50%) rotate(0deg) scale(1);
    }
    10% {
      border-radius: 15% 10% 20% 5% / 10% 15% 10% 20%;
    }
    25% {
      border-radius: 30% 20% 40% 10% / 25% 30% 20% 15%;
      transform: translate(-50%, -50%) rotate(90deg) scale(1.05);
    }
    40% {
      border-radius: 45% 40% 50% 40% / 40% 50% 40% 50%;
    }
    50% {
      border-radius: 50%;
      transform: translate(-50%, -50%) rotate(180deg) scale(0.9);
    }
    60% {
      border-radius: 40% 50% 40% 45% / 45% 40% 50% 40%;
    }
    75% {
      border-radius: 20% 30% 10% 25% / 20% 15% 30% 25%;
      transform: translate(-50%, -50%) rotate(270deg) scale(1.05);
    }
    90% {
      border-radius: 10% 15% 5% 20% / 15% 10% 20% 10%;
    }
    100% {
      border-radius: 5% 5% 5% 5% / 5% 5% 5% 5%;
      transform: translate(-50%, -50%) rotate(360deg) scale(1);
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
          <div
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              display: "flex",
              alignItems: "center",
              flex: 1,
              maxWidth: "100%",
              gap: "10px",
              padding: "10px 0",
            }}
          >
            {skills &&
              skills.map((skill) => (
                <span
                  style={{
                    margin: "0 10px 0 0",
                    padding: "6px 12px",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    whiteSpace: "nowrap",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    color: "var(--main-color)"
                  }}
                >
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
