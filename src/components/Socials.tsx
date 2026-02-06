import styled from "styled-components";
import socialMedia from "../data/socialMedia.json";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface SocialInterface {
  status: string;
  appName: string;
  color: {
    type: string;
    color: string;
  };
  content: string;
  logo: string;
  userName: string;
  posts: string;
  people: {
    type: string;
    friends: number;
    followers: number;
  };
  link: string;
}

const Styled_Socials = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  place-items: center;
  height: 100%;
  gap: 1rem 2rem;
  margin: 2rem 0;

  @media (max-width: 900px) {
    gap: 1rem 0.3rem;
  }
`;

const Socials = () => {
  const [data, setData] = useState<SocialInterface[] | []>([]);

  const socialMedias = socialMedia as unknown as SocialInterface[];
  useEffect(() => {
    setData(socialMedias);
  }, []);
  return (
    <Styled_Socials>
      {data &&
        data.map((social: SocialInterface) => {
          return (
            <Social
              social={{
                status: social.status,
                appName: social.appName,
                color: social.color,
                content: social.content,
                logo: social.logo,
                userName: social.userName,
                link: social.link,
                people: social.people,
                posts: social.posts,
              }}
            ></Social>
          );
        })}
    </Styled_Socials>
  );
};

const Styled_Social = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  height: 100%;
  color: #fff;
  position: relative;
  border-radius: 20px;
  padding: 2rem 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 900px) {
    width: 90%;
  }
    
  div {
    width: 100%;
    font-weight: normal;
  }

  .header-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    position: relative;
    width: 100%;

    img.logo {
      width: 60px;
      height: 60px;
      border-radius: 15px; /* Rounded square shape */
      object-fit: contain; /* Ensure logo fits inside without cropping */
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      background-color: #fff; /* Force the square shape */
      padding: 5px; /* Spacing for the icon inside the shape */
    }

    .appName {
      font-size: 1.2rem;
      font-weight: bold;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin: 0;
      background: transparent;
      color: #fff;
      padding: 0;
      position: static;
      transform: none;
      width: auto;
      
      &::before, &::after {
        display: none;
      }
    }
  }

  .stats-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .part {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    span {
      font-weight: normal;
      font-size: 0.85rem;
      opacity: 0.9;
      
      &:last-child {
        font-weight: bold;
        opacity: 1;
      }
    }
  }

  .visit {
    width: 100%;
    padding: 1rem;
    border-radius: 15px;
    cursor: pointer;
    letter-spacing: 1px;
    border: none;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.9rem;
    transition: 0.3s;
    margin-top: auto;
    color: #fff;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);

    a {
      color: inherit;
      text-decoration: none;
      display: block;
      width: 100%;
      height: 100%;
    }

    &:hover {
      transform: translateY(-2px);
      filter: brightness(1.1);
      box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    }
  }
`;

type SocialType = {
  social: SocialInterface;
};

const Social = ({ social }: SocialType) => {
  const { t } = useTranslation();
  return (
    <Styled_Social style={{ borderTop: `1px solid ${social.color.color}40` }}>
      <div className="header-section">
        <img className="logo" src={social.logo} alt={social.appName} style={{ border: `2px solid ${social.color.color}` }} />
        <h3 className="appName">{t(`socials.items.${social.appName}`)}</h3>
      </div>
      
      <div className="stats-container">
        <div className="part">
          <span>{t(`socials.${social.people.type}`)}</span>
          <span style={{ color: social.color.color }}>{+social.people.friends || +social.people.followers}</span>
        </div>
        <div className="part">
          <span>{t("socials.posts")}</span>
          <span>{t(`socials.items.${social.posts}`)}</span>
        </div>
        <div className="part">
          <span>{t("socials.username")}</span>
          <span>{social.userName}</span>
        </div>
        <div className="part">
          <span>{t(`socials.content`)}</span>
          <span>{t(`socials.items.${social.content}`)}</span>
        </div>
      </div>

      <button className="visit" style={{ backgroundColor: social.color.color }}>
        <a href={social.link} target="_blank" rel="noreferrer">
          {t(`socials.visit`)}
        </a>
      </button>
    </Styled_Social>
  );
};

export default Socials;
