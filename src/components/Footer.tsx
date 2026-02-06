import {
  faFacebook,
  faGithub,
  faInstagram,
  faLinkedin,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Styled_Footer = styled.footer`
  color: #fff;
  border: 1px solid var(--main-color);
  padding: 1rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  &::before {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background-color: #00000090;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }

  > .content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    @media (max-width: 768px) {
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
      padding: 1rem;

      div {
        width: 100%;

        .item {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          span {
            svg {
            }
          }
        }
      }
    }

    .image {
      margin-top: 2rem;
      width: 10vw;
      width: 10vw;
      border-radius: 50%;

      @media (max-width: 768px) {
        width: 50vw;
        height: 50vw;
      }
      img {
        width: 100%;
        height: 100%;
        aspect-ratio: 1/1;
        border-radius: 50%;
        border: 5px solid var(--main-color);
        box-shadow: 0 0 10px 10px var(--background-main-color);
      }
    }

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      width: 30%;
      text-align: center;

      @media (max-width: 768px) {
        width: 80%;
        gap: 1.3rem;
      }

      .item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: row;
        gap: 1rem;
        width: 100%;

        @media (max-width: 768px) {
          flex-direction: column;
          gap: 0.5rem;
        }

        > span {
          padding: 1rem;
          border: 2px solid var(--main-color);
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          position: relative;

          svg {
            color: var(--main-color);
          }

          &::before {
            content: "";
            display: block;
            width: 0%;
            height: 0%;
            background-color: var(--background-main-color);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: -1;
            transition: all 0.3s ease;
            border-radius: 50%;
          }

          &:hover {
            &::before {
              width: 100%;
              height: 100%;
            }
            svg {
              color: #fff;
            }
          }
        }
      }

      p {
        letter-spacing: 2px;
        line-height: 1.8;
      }

      .socials {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;

        li {
          &:hover {
            transform: scale(1.1);

            a svg {
              color: var(--main-color);
            }
          }

          a {
            color: #fff;
          }
        }
      }
    }
  }

  .sections {
    ul {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0rem 4rem;
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
        padding: 0.6rem;
      }

      li {
        position: relative;
        a {
          text-transform: uppercase;
        }

        border-bottom: 2px solid var(--main-color);
        padding: 0.5rem;

        &::before {
          content: "";
          display: block;
          width: 0;
          height: 100%;
          background-color: var(--background-main-color);
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: -1;
          transition: all 0.3s ease;
        }

        &:hover::before {
          width: 100%;
        }
      }
    }
  }
  .copyright {
    p {
      text-align: center;
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      padding: 2rem 1rem 0;
    }
  }
`;

const Footer = () => {
  const { t } = useTranslation();
  return (
    <Styled_Footer>
      <div className="content">
        <div className="contact">
          <div className="item">
            <span>
              <FontAwesomeIcon icon={faPhone} />
            </span>
            <p>+90 552 642 73 52</p>
          </div>
          <div className="item">
            <span>
              <FontAwesomeIcon icon={faLocationDot} />
            </span>
            <p>
              <span>{t("footer.address_title")}</span>
              <strong>{t("footer.city")}</strong>
            </p>
          </div>
          <div className="item">
            <span>
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <p>
              <a
                style={{ textTransform: "lowercase" }}
                href="mailto:aldabbas333abdalrahman@gmail.com"
              >
                aldabbas333abdalrahman@gmail.com
              </a>
            </p>
          </div>
        </div>
        <div className="info">
          <div className="image">
            <img src="./logos/newLogo.webp" alt="" />
          </div>
          <h1>{t("footer.about_title")}</h1>
          <p>{t("footer.about_desc")}</p>

          <ul className="socials">
            <li>
              <a href="https://www.facebook.com/profile.php?id=100082501930282">
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/alomawy.code.99//">
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
            </li>
            <li>
              <a href="https://wa.me/+9005526427352">
                <FontAwesomeIcon icon={faWhatsapp} size="2x" />
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/abdalrahman-aldabbas-50a7a4242/">
                <FontAwesomeIcon icon={faLinkedin} size="2x" />
              </a>
            </li>
            <li>
              <a href="https://twitter.com/alomawy_code_99">
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
            </li>
            <li>
              <a href="https://github.com/ALOMAWY">
                <FontAwesomeIcon icon={faGithub} size="2x" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="sections">
        <ul>
          <li>
            <Link to="/">{t("sections.home")}</Link>
          </li>
          <li>
            <Link to="/services">{t("sections.services")}</Link>
          </li>
          <li>
            <Link to="/portfolio">{t("sections.portfolio")}</Link>
          </li>
          <li>
            <Link to="/contact_us">{t("sections.contact_us")}</Link>
          </li>
          <li>
            <Link to="/about_us">{t("sections.about_us")}</Link>
          </li>
          <li>
            <Link to="/social_media">{t("sections.social_media")}</Link>
          </li>
        </ul>
      </div>
      <div className="copyright">
        <p>&copy; {new Date().getFullYear()} ALOMAWY. {t("footer.rights")}</p>
      </div>
    </Styled_Footer>
  );
};

export default Footer;
