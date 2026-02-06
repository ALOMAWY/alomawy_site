import styled from "styled-components";

import { useTranslation } from "react-i18next";

const LandingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;

  @media (max-width: 991px) {
    flex-direction: column-reverse;
    margin: 3rem 1rem;
    gap: 2rem;
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 75px;

  @media (max-width: 991px) {
    gap: 2.5rem;
  }

  @media (min-width: 992px) {
    margin-right: 2rem;
  }
`;

const Name = styled.h1`
  width: 100%;
  padding: 10px 20px;
  margin: 0 1rem;
  border: 1px solid var(--main-color);
  text-align: center;
  font-size: 1.7rem;
  background-image: linear-gradient(
    to left,
    var(--secondary-color),
    var(--main-color)
  );
  border-radius: 16px 0 16px 0;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rotating-color linear infinite 5s;
  background-size: 500%;
  background-color: var(--background-main-color);
  backdrop-filter: blur(6px);
`;

const ImageLogo = styled.div`
  width: 20vw;
  height: 20vw;
  border-radius: 50%;
  box-shadow: 0 0 40px 18px var(--main-color);
  animation: changeHue 10s infinite linear;
  outline: 3px solid var(--main-color);
  outline-offset: 15px;
  overflow: hidden;

  &:hover img {
    transform: scale(1.15) rotate(10deg);
  }

  @media (max-width: 991px) {
    width: 50vw;
    height: 50vw;
  }

  img {
    width: 100%;
    height: 100%;
  }
`;

const TextArea = styled.section`
  display: flex;
  flex-direction: column;
  max-width: 50%;
  justify-content: space-evenly;
  min-height: 100%;
  position: relative;
  color: var(--secondary-color);

  @media (max-width: 991px) {
    min-width: 50%%;
    max-width: 100%;
  }

  .description {
    width: 100%;
    position: relative;
    margin: 1rem 0;

    @media (max-width: 991px) {
      padding: 10px 0;
    }

    &:hover::before {
      width: 100%;
      border: 5px solid var(--main-color);
    }

    h2.sey-hello {
      color: var(--secondary-color);
      font-size: 1.3rem;
      background-color: var(--background-main-color);
      padding: 10px 20px;
      border-radius: 0;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      width: fit-content;

      @media (max-width: 991px) {
        text-align: center;
        width: 100%;
      }
    }

    & p {
      letter-spacing: 3px;
      line-height: 2;
      word-spacing: 2px;
      color: var(--secondary-color);
      position: relative;
      margin-top: 10px;
      border-radius: 0;
      width: fit-content;
      font-size: 0.9rem;
      word-wrap: break-word;
      text-align: start;
      width: 100%;

      @media (max-width: 991px) {
        text-align: center;
        line-height: 2;
        font-size: 1rem;
      }
    }

    &:hover {
      text-shadow: 3px 3px 10px var(--main-color);
    }

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      height: 100%;
      width: 0%;
      transform: translate(-50%, -50%);
      background-color: var(--background-main-color);
      opacity: 0.2;
      transition: 0.3s;
    }
  }

  ul#my-skills {
    position: relative;
    width: 75%;
    z-index: 2;

    li {
      padding: 10px;
      display: block;
      width: 100%;
      position: relative;
      background-color: var(--background-main-color);
      margin: 5px 0 5px 0;
      border-radius: 20px 2px 20px 2px / 30px 2px 30px 2px;
      transition: 0.3s;
      color: white;
      overflow: hidden;
      letter-spacing: 4px;
      border-top: 4px solid transparent;

      &:hover {
        border-top: 4px solid var(--background-main-color);
        color: var(--main-color);
        z-index: 3;
        letter-spacing: 6px;
      }

      &::before {
        content: "";
        background-color: var(--background-white-color);
        width: 100%;
        height: 100%;
        position: absolute;
        box-shadow: 0 0 2px 0px var(--main-color) inset;
        top: 0px;
        left: -120%;
        transition: 0.2s;
        z-index: -2;
      }

      &:hover::before {
        left: 0px;
      }

      @media (max-width: 991px) {
        text-align: center;
      }
    }

    @media (max-width: 991px) {
      max-width: 100%;
      min-width: 100%;
}
  
`;

const Landing = () => {
  const { t } = useTranslation();

  const numbers = Object.keys(t("info.numbers", { returnObjects: true }));
  return (
    <LandingContainer>
      <TextArea>
        <div className="description">
          <h2 className="sey-hello">{t("info.welcome")}</h2>
          <p>
            {t("info.description.name")}
            <br />
            {t("info.description.work")}
            <br />
            {t("info.description.from")}
            <br />
            {t("info.description.website")}
            <br /> {t("info.description.technology")}
          </p>
        </div>

        <ul id="my-skills" className="skills l-change dir-lang-ar">
          <li id="my-skill-1" className="my-skill">
            {numbers[1]}- HTML
          </li>
          <li id="my-skill-2" className="my-skill">
            {numbers[2]}- CSS
          </li>
          <li id="my-skill-3" className="my-skill">
            {numbers[3]}- JavaScript
          </li>
          <li id="my-skill-4" className="my-skill">
            {numbers[4]}- GITHUB
          </li>
          <li id="my-skill-6" className="my-skill">
            {numbers[5]}- TypeScript
          </li>
          <li id="my-skill-6" className="my-skill">
            {numbers[6]}- Sass
          </li>
          <li id="my-skill-6" className="my-skill">
            {numbers[7]}- ReactJs
          </li>
          <li id="my-skill-6" className="my-skill">
            {numbers[8]}- NextJs
          </li>
        </ul>
      </TextArea>
      <LogoSection>
        <Name>{t("info.fullname")}</Name>
        <ImageLogo>
          <img src="./logos/newLogo.webp" alt="main-logo" />
        </ImageLogo>
      </LogoSection>
    </LandingContainer>
  );
};

export default Landing;
