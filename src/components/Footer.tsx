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
import styled, { keyframes } from "styled-components";

const float = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.02); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 30px 10px rgba(var(--main-color-rgb), 0.3); }
  50% { box-shadow: 0 0 60px 20px rgba(var(--main-color-rgb), 0.5); }
`;

const Styled_Footer = styled.footer`
  color: #fff;
  border-top: 1px solid rgba(var(--main-color-rgb), 0.2);
  padding: 4rem 2rem 2rem;
  background: rgba(0, 12, 20, 0.7);
  backdrop-filter: blur(25px);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 4rem;

  /* ... before pseudo-element ... */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--main-color), transparent);
    opacity: 0.5;
  }

  .content {
    /* ... content styles ... */
    display: grid;
    grid-template-columns: 1.2fr 1fr 1.2fr;
    gap: 3rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;

    @media (max-width: 1100px) {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 4rem;
    }

    /* ... contact-box styles ... */
    .contact-box {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .item {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        padding: 1rem 1.5rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        transition: all 0.3s ease;
        width: 100%;

        &:hover {
          background: rgba(var(--main-color-rgb), 0.05);
          border-color: rgba(var(--main-color-rgb), 0.3);
          transform: translateX(10px);
        }

        &[lang="ar"], &:has([lang="ar"]), .dir-rtl & {
           &:hover {
            transform: translateX(-10px);
          }
        }

        .icon-wrap {
          width: 45px;
          height: 45px;
          min-width: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(var(--main-color-rgb), 0.1);
          color: var(--main-color);
          border-radius: 12px;
          font-size: 1.2rem;
        }

        .text-wrap {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;

          span {
            font-size: 0.8rem;
            opacity: 0.6;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          p, a {
            font-size: 0.95rem;
            margin: 0;
            line-height: 1.4;
            color: #fff;
            font-weight: 600;
            word-break: break-word;
            transition: color 0.3s ease;
            
            &.email {
              text-transform: lowercase;
            }
          }
          
          text-align: start;
          align-items: flex-start;
          
          .dir-rtl & {
            text-align: end;
            align-items: flex-end;
          }

          a:hover {
            color: var(--main-color);
          }

          strong {
            font-weight: 700;
            color: var(--main-color);
          }
        }
      }
    }

    .main-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2.5rem;
      text-align: center;

      .image {
        width: 140px;
        height: 140px;
        background: rgba(255, 255, 255, 0.03);
        border: 2px solid rgba(var(--main-color-rgb), 0.3);
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        backdrop-filter: blur(20px);
        position: relative;
        overflow: hidden;
        animation: ${float} 6s ease-in-out infinite, ${glow} 4s ease-in-out infinite;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.9;
          filter: drop-shadow(0 0 20px rgba(var(--main-color-rgb), 0.2));
        }

        &:hover {
          border-radius: 50%;
          border-color: var(--main-color);
          transform: scale(1.05);
        }
      }

      .text-content {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        align-items: center;
      }

      h1 {
        font-size: 2rem;
        font-weight: 900;
        margin: 0;
        background: linear-gradient(135deg, #fff 40%, var(--main-color));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -0.5px;
        text-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
      }

      p {
        font-size: 1rem;
        line-height: 1.8;
        color: rgba(255, 255, 255, 0.6);
        max-width: 400px;
        margin: 0;
        font-weight: 500;
        letter-spacing: 0.2px;
      }
    }

    .social-extra {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      align-items: flex-end;

      @media (max-width: 1100px) {
        align-items: center;
      }

      .social-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: flex-end;
        padding-bottom: 2rem; /* Add space for the staircase drop */

        @media (max-width: 1100px) {
          justify-content: center;
          padding-bottom: 0;
        }

        a {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          color: #fff;
          font-size: 1.4rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

          /* Staircase Effect & Individual Hover */
          &:nth-child(1) { transform: translateY(0px); }
          &:nth-child(1):hover { transform: translateY(0px) rotate(8deg) !important; }
          
          &:nth-child(2) { transform: translateY(35px); }
          &:nth-child(2):hover { transform: translateY(35px) rotate(8deg) !important; }
          
          &:nth-child(3) { transform: translateY(70px); }
          &:nth-child(3):hover { transform: translateY(70px) rotate(8deg) !important; }
          
          &:nth-child(4) { transform: translateY(105px); }
          &:nth-child(4):hover { transform: translateY(105px) rotate(8deg) !important; }
          
          &:nth-child(5) { transform: translateY(140px); }
          &:nth-child(5):hover { transform: translateY(140px) rotate(8deg) !important; }
          
          &:nth-child(6) { transform: translateY(175px); }
          &:nth-child(6):hover { transform: translateY(175px) rotate(8deg) !important; }

          @media (max-width: 1100px) {
            transform: none !important;
          }

          &:hover {
            background: var(--main-color);
            color: #000;
            box-shadow: 0 15px 30px rgba(var(--main-color-rgb), 0.4);
            border-color: var(--main-color);
          }
        }
      }
    }
  }

  .sections-nav {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 2rem;
    
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 2rem;
      
      li {
        a {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: 0.3s;

          &:hover {
            color: var(--main-color);
            text-shadow: 0 0 10px rgba(var(--main-color-rgb), 0.5);
          }
        }
      }
    }
  }

  .copyright {
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 2rem;
    
    p {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.4);
      margin: 0;
      
      span { color: var(--main-color); font-weight: 600; }
    }
  }
`;

const Footer = () => {
  const { t } = useTranslation();
  return (
    <Styled_Footer>
      <div className="content">
        <div className="contact-box">
          <div className="item">
            <div className="icon-wrap">
              <FontAwesomeIcon icon={faPhone} />
            </div>
            <div className="text-wrap">
              <span>{t("footer.phone_label") || "Phone"}</span>
              <p dir="ltr">{t("footer.phone")}</p>
            </div>
          </div>
          <div className="item">
            <div className="icon-wrap">
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <div className="text-wrap">
              <span>{t("footer.address_label") || "Address"}</span>
              <p>
                {t("footer.address_title")} <strong>{t("footer.city")}</strong>
              </p>
            </div>
          </div>
          <div className="item">
            <div className="icon-wrap">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <div className="text-wrap">
              <span>{t("footer.email_label") || "Email"}</span>
              <a href="mailto:aldabbas333abdalrahman@gmail.com" className="email">
                aldabbas333abdalrahman@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="main-info">
          <div className="image">
            <img src="./logos/newLogo.webp" alt="Alomawy Logo" />
          </div>
          <div className="text-content">
            <h1>{t("footer.about_title")}</h1>
            <p>{t("footer.about_desc")}</p>
          </div>
        </div>

        <div className="social-extra">
          <div className="social-chips">
            <a href="https://www.facebook.com/profile.php?id=100082501930282">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://www.instagram.com/alomawy.code.99//">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://wa.me/963952437717">
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
            <a href="https://www.linkedin.com/in/abdalrahman-aldabbas-50a7a4242/">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="https://twitter.com/alomawy_code_99">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://github.com/ALOMAWY">
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </div>
        </div>
      </div>

      <div className="sections-nav">
        <ul>
          <li><Link to="/">{t("sections.home")}</Link></li>
          <li><Link to="/services">{t("sections.services")}</Link></li>
          <li><Link to="/portfolio">{t("sections.portfolio")}</Link></li>
          <li><Link to="/contact_us">{t("sections.contact_us")}</Link></li>
          <li><Link to="/about_us">{t("sections.about_us")}</Link></li>
          <li><Link to="/social_media">{t("sections.social_media")}</Link></li>
        </ul>
      </div>

      <div className="copyright">
        <p>
          &copy; {new Date().getFullYear()} <span>ALOMAWY</span>. {t("footer.rights")}
        </p>
      </div>
    </Styled_Footer>
  );
};

export default Footer;
