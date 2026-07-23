import styled from "styled-components";
import Headroom from "react-headroom";
import ActionsNavbar from "./ActionsNavbar";
import { useMyContext } from "./Context";
import LinksNavbar from "./LinksNavbar";
import Name from "./Name";
import PagesSelect from "./PagesSelect";
import ActionSelect from "./ActionSelect";

const HeaderWrapper = styled.div`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: var(--q-blur-header);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  width: 100%;
  position: relative;
  z-index: 1000;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    backdrop-filter: var(--q-blur-header-mobile);
    background: rgba(0, 0, 0, 0.7);
  }
`;

const Mobile_Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const DesktopHeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = () => {
  const { isList, isMobile, isDropdownOpen } = useMyContext();
  return (
    <Headroom 
      disable={isDropdownOpen} 
      style={{ 
        zIndex: 10000,
        position: 'relative',
        overflow: 'visible' 
      }}
    >
      <header style={{ 
        position: 'relative', 
        zIndex: 10000,
        overflow: 'visible'
      }}>
        <HeaderWrapper style={{ overflow: 'visible' }}>
          {isMobile ? (
            <Mobile_Header>
              <Name />
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <ActionSelect />
                <PagesSelect />
              </div>
            </Mobile_Header>
          ) : (
            <DesktopHeaderContent>
              {isList ? <LinksNavbar /> : <ActionsNavbar />}
            </DesktopHeaderContent>
          )}
        </HeaderWrapper>
      </header>
    </Headroom>
  );
};

export default Header;
