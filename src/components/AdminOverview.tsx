import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faStar, faCode, faImage, faLink, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

interface Project {
  _id: string;
  title: string;
  developer: string;
  type: string;
  types?: string[];
  rate: string;
  techs: string[];
  langs: string[];
  image?: string;
  images?: string[];
  visit?: string;
  disc?: string;
  source?: string;
  createdAt?: string;
}

interface AdminOverviewProps {
  projects: Project[];
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
`;

const Card = styled.div<{ $accent?: string }>`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all var(--q-transition-speed) var(--q-transition-ease);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$accent || 'var(--main-color)'};
    opacity: 0.6;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .card-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(var(--main-color-rgb), 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.$accent || 'var(--main-color)'};
    font-size: 1rem;
  }

  .card-value {
    font-size: 2rem;
    font-weight: 900;
    color: #fff;
    line-height: 1;
  }

  .card-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.5;
    color: #fff;
  }
`;

const RecentSection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.5rem;
  margin-top: 1rem;

  h3 {
    font-size: 0.8rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.5;
    color: #fff;
    margin-bottom: 1rem;
  }
`;

const RecentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

  &:last-child {
    border-bottom: none;
  }

  .recent-img {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .recent-info {
    flex: 1;
    min-width: 0;

    .recent-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .recent-type {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.4;
      color: #fff;
    }
  }

  .recent-rating {
    color: #f1c40f;
    font-size: 0.75rem;
    font-weight: 700;
  }
`;

const AdminOverview = ({ projects }: AdminOverviewProps) => {
  const { t } = useTranslation();

  const totalCount = projects.length;
  const avgRating = totalCount > 0
    ? (projects.reduce((sum, p) => sum + (+p.rate || 0), 0) / totalCount / 20).toFixed(1)
    : "0";

  const typeCounts = projects.reduce((acc, p) => {
    const projectTypes = p.types || (p.type ? [p.type] : []);
    for (const ty of projectTypes) {
      acc[ty] = (acc[ty] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

  const techCounts = projects.flatMap(p => p.techs || []).reduce((acc, t) => {
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topTech = Object.entries(techCounts).sort((a, b) => b[1] - a[1])[0];

  const withImage = projects.filter(p => p.image || (p.images && p.images.length > 0)).length;
  const withLink = projects.filter(p => p.visit).length;

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  return (
    <div>
      <Container>
        <Card $accent="#3498db">
          <div className="card-icon"><FontAwesomeIcon icon={faFolderOpen} /></div>
          <div className="card-value">{totalCount}</div>
          <div className="card-label">{t("admin.total_projects")}</div>
        </Card>

        <Card $accent="#f1c40f">
          <div className="card-icon"><FontAwesomeIcon icon={faStar} /></div>
          <div className="card-value">{avgRating}</div>
          <div className="card-label">{t("admin.avg_rating")}</div>
        </Card>

        <Card $accent="#2ecc71">
          <div className="card-icon"><FontAwesomeIcon icon={faTrophy} /></div>
          <div className="card-value" style={{ fontSize: topType ? '1.2rem' : '2rem' }}>
            {topType ? t(`portfolio.category.${topType[0]}`) : '-'}
          </div>
          <div className="card-label">{t("admin.top_type")} {topType ? `(${topType[1]})` : ''}</div>
        </Card>

        <Card $accent="#9b59b6">
          <div className="card-icon"><FontAwesomeIcon icon={faCode} /></div>
          <div className="card-value" style={{ fontSize: topTech ? '1.2rem' : '2rem' }}>
            {topTech ? topTech[0].toUpperCase() : '-'}
          </div>
          <div className="card-label">{t("admin.top_tech")} {topTech ? `(${topTech[1]})` : ''}</div>
        </Card>

        <Card $accent="#e67e22">
          <div className="card-icon"><FontAwesomeIcon icon={faImage} /></div>
          <div className="card-value">{withImage}<span style={{ fontSize: '1rem', opacity: 0.4 }}>/{totalCount}</span></div>
          <div className="card-label">{t("admin.with_images")}</div>
        </Card>

        <Card $accent="#1abc9c">
          <div className="card-icon"><FontAwesomeIcon icon={faLink} /></div>
          <div className="card-value">{withLink}<span style={{ fontSize: '1rem', opacity: 0.4 }}>/{totalCount}</span></div>
          <div className="card-label">{t("admin.with_links")}</div>
        </Card>
      </Container>

      {recentProjects.length > 0 && (
        <RecentSection>
          <h3>{t("admin.recent_projects")}</h3>
          {recentProjects.map((project) => (
            <RecentItem key={project._id}>
              <img
                className="recent-img"
                src={project.image || "./assets/project-placeholder.png"}
                alt=""
              />
              <div className="recent-info">
                <div className="recent-title">{project.title}</div>
                <div className="recent-type">{t(`portfolio.category.${project.type}`)}</div>
              </div>
              <div className="recent-rating">
                {'★'.repeat(Math.round(+project.rate / 20))}
              </div>
            </RecentItem>
          ))}
        </RecentSection>
      )}
    </div>
  );
};

export default AdminOverview;
