import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faImage, faEnvelope, faGlobe } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.4;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`;

const PlaceholderCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all var(--q-transition-speed) var(--q-transition-ease);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle at top right, rgba(var(--main-color-rgb), 0.08), transparent);
    pointer-events: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .card-icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: rgba(var(--main-color-rgb), 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--main-color);
    font-size: 1rem;
  }

  .card-title {
    font-size: 0.9rem;
    font-weight: 800;
    color: #fff;
  }

  .card-desc {
    font-size: 0.75rem;
    line-height: 1.6;
    opacity: 0.4;
    color: #fff;
  }

  .coming-soon {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 6px 14px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    font-size: 0.6rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.3;
    color: #fff;
    width: fit-content;
    margin-top: 0.5rem;
  }
`;

const AdminSettings = () => {
  const { t } = useTranslation();

  const settingsCards = [
    { icon: faGlobe, titleKey: "settings.social_title", descKey: "settings.social_desc" },
    { icon: faEnvelope, titleKey: "settings.contact_title", descKey: "settings.contact_desc" },
    { icon: faImage, titleKey: "settings.meta_title", descKey: "settings.meta_desc" },
    { icon: faLock, titleKey: "settings.footer_title", descKey: "settings.footer_desc" },
  ];

  return (
    <Container>
      <SectionTitle>{t("settings.section_title")}</SectionTitle>
      <CardGrid>
        {settingsCards.map((card, i) => (
          <PlaceholderCard key={i}>
            <div className="card-icon"><FontAwesomeIcon icon={card.icon} /></div>
            <div className="card-title">{t(card.titleKey)}</div>
            <div className="card-desc">{t(card.descKey)}</div>
            <div className="coming-soon">
              <FontAwesomeIcon icon={faLock} style={{ fontSize: '0.5rem' }} />
              {t("settings.coming_soon")}
            </div>
          </PlaceholderCard>
        ))}
      </CardGrid>
    </Container>
  );
};

export default AdminSettings;
