import {
  faComment,
  faCommentSms,
  faEnvelope,
  faGears,
  faGlobe,
  faHeart,
  faLaptop,
  faLocationDot,
  faMessage,
  faMobileScreen,
  faStar,
  faUser,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const StyledContactUs = styled.div`
  height: 100%;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 50px;

  @media (max-width: 1040px) {
    flex-direction: column-reverse;
  }
`;

const DrawContainer = styled.div`
  flex: 1;
  max-width: 500px;
  max-width: 500px;

  .circle {
    width: 500px;
    height: 500px;
    position: relative;

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px #766e6e;
      border: 3px solid transparent;
      transition: 0.3s;

      &:hover {
        transform: translate(-50%, -50%) scale(1.1);
        z-index: 12321311;
        border-color: var(--main-color);
      }
    }

    .text {
      width: 55%;
      height: 55%;
      background-color: var(--secondary-color);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      right: -20%;
      bottom: -8%;
      z-index: 8;
      i {
        font-size: 150%;
        transform: translateY(-60%);
      }
      span {
        font-size: 100%;
        font-weight: 600;
      }
    }
    .c-c {
      width: 30%;
      height: 30%;
      background-color: var(--main-color);
      border-radius: 50%;
      i {
        font-size: 100%;
        color: var(--secondary-color);
      }
    }
    .c-w {
      width: 15%;
      height: 15%;
      background-color: var(--secondary-color);
      border-radius: 50%;
      i {
        font-size: 100%;
        color: var(--main-color);
      }
    }
    .location {
      top: 50%;
      left: 8%;
      z-index: 1;
    }
    .star-1 {
      top: 20%;
      left: 35%;
      z-index: 2;
    }
    .phone {
      top: 66%;
      left: 30%;
    }
    .internet {
      left: 35%;
      top: 38%;
    }
    .email {
      left: 55%;
      top: 20%;
    }
    .star {
      top: 80%;
      left: 50%;
    }
    .setting {
      left: 75%;
      top: 23%;
      z-index: 3;
    }
    .wifi {
      left: 23%;
      top: 35%;
    }
    .love {
      left: 87%;
      top: 16%;
    }
    .sms {
      top: 80%;
      left: 80%;
      background-color: var(--main-color);
      z-index: 7;
      i {
        color: var(--secondary-color);
      }
    }
    .message {
      top: 80%;
      z-index: 4;
      left: 20%;
    }

    @media (max-width: 550px) {
      width: 400px;
      height: 400px;
    }
    @media (max-width: 450px) {
      width: 300px;
      height: 300px;
    }
  }
  @media (max-width: 550px) {
    max-width: 400px;
    max-height: 400px;
  }
  @media (max-width: 450px) {
    max-width: 300px;
    max-height: 300px;
  }
`;

const ContactForm = styled.form`
  max-width: 600px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 3rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);

  .input {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    transition: all 0.3s ease;

    &:focus-within {
      background: rgba(255, 255, 255, 0.06);
      border-color: var(--main-color);
      box-shadow: 0 0 15px rgba(var(--main-color-rgb), 0.2);

      label svg {
        transform: scale(1.2);
        opacity: 1;
      }
    }

    &:has(label + textarea) {
      align-items: flex-start;
      
      label {
        margin-top: 5px;
      }
    }

    label {
      width: 20px;
      display: flex;
      justify-content: center;

      svg {
        color: var(--main-color);
        opacity: 0.6;
        font-size: 1.1rem;
        transition: all 0.3s ease;
      }
    }

    input,
    textarea {
      flex: 1;
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
      font-size: 0.9rem;
      resize: none;
      font-weight: normal;

      &::placeholder {
        opacity: 0.2;
        color: #fff;
      }
    }
  }

  button {
    margin-top: 1rem;
    padding: 1.5rem;
    background: var(--main-color);
    border-radius: 24px;
    border: none;
    font-weight: 900;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(var(--main-color-rgb), 0.3);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px rgba(var(--main-color-rgb), 0.4);
      filter: brightness(1.1);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

const ContactUs = () => {
  const { t } = useTranslation();

  const drawContainerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (drawContainerRef.current) {
    }
  });

  return (
    <StyledContactUs>
      <ContactForm>
        <div className="input">
          <label htmlFor="name">
            <FontAwesomeIcon icon={faUser} />
          </label>
          <input
            id="name"
            type="text"
            placeholder={t("form.placeholder.name")}
            name="name"
            min="3"
            max="15"
            required
          />
        </div>
        <div className="input">
          <label htmlFor="email">
            <FontAwesomeIcon icon={faEnvelope} />
          </label>
          <input
            id="email"
            type="email"
            placeholder={t("form.placeholder.email")}
            required
            name="email"
          />
        </div>
        <div className="input">
          <label htmlFor="message-area">
            <FontAwesomeIcon icon={faComment} />
          </label>
          <textarea
            name="message"
            id="message-area"
            placeholder={t("form.placeholder.message")}
            cols={30}
            rows={7}
            minLength={10}
            maxLength={500}
            required
          ></textarea>
        </div>
        <button type="submit" id="send-message">
          {t("form.send")}
        </button>
      </ContactForm>
      <DrawContainer>
        <div className="circle">
          <div className="text">
            <FontAwesomeIcon icon={faLaptop} />
            <span data-lang="contactUsPopup">Contact Us</span>
          </div>
          <div className="star-1 c-w">
            <FontAwesomeIcon icon={faStar} />
          </div>
          <div className="wifi c-c">
            <FontAwesomeIcon icon={faWifi} />
          </div>
          <div className="message c-w">
            <FontAwesomeIcon icon={faMessage} />
          </div>
          <div className="sms c-w">
            <FontAwesomeIcon icon={faCommentSms} />
          </div>
          <div className="internet c-w">
            <FontAwesomeIcon icon={faGlobe} />
          </div>
          <div className="location c-w">
            <FontAwesomeIcon icon={faLocationDot} />
          </div>
          <div className="star c-w">
            <FontAwesomeIcon icon={faStar} />
          </div>
          <div className="love c-w">
            <FontAwesomeIcon icon={faHeart} />
          </div>
          <div className="setting c-w">
            <FontAwesomeIcon icon={faGears} />
          </div>
          <div className="phone c-c">
            <FontAwesomeIcon icon={faMobileScreen} />
          </div>
          <div className="star c-w">
            <FontAwesomeIcon icon={faStar} />
          </div>
          <div className="email c-c">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
        </div>
      </DrawContainer>
    </StyledContactUs>
  );
};

export default ContactUs;
