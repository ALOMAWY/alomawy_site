import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const Styled_Paths = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;

  .paths {
    span {
      color: white;
      padding: 3px;
    }
  }

  h3 {
    margin: 0;
    font-size: 1.4rem;
    color: var(--secondary-color);
  }
`;

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const Paths = () => {
  const { t } = useTranslation();

  const location = useLocation();

  const paths = location.pathname.split("/").slice(1);

  const currentSection = paths[paths.length - 1];

  return (
    <Styled_Paths>
      <div className="paths">
        <Link to="/">
          <span>{capitalize(t("path.home"))}</span>
        </Link>
        {paths &&
          paths.map((path, index) => {
            const routeTo = "/" + paths.slice(0, index + 1).join("/");

            const isLast = index === paths.length - 1;
            return (
              <span key={index}>
                &gt;
                {isLast ? (
                  <span> {path && capitalize(t(`path.${path}`))}</span>
                ) : (
                  <Link to={routeTo}>
                    {path && capitalize(t(`path.${path}`))}
                  </Link>
                )}
              </span>
            );
          })}
      </div>
      <div className="current">
        {window.innerWidth > 400 ? (
          <h3>
            {!currentSection ? t("path.home") : t(`path.${currentSection}`)}
          </h3>
        ) : (
          ""
        )}
      </div>
    </Styled_Paths>
  );
};

export default Paths;
