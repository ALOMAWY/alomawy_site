import "./App.css";
import "normalize.css";
import Landing from "./components/Landing";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { useEffect, useRef, useState } from "react";
import Services from "./components/Services";
import styled from "styled-components";
import Paths from "./components/MyPath";
import { getItemFromLocalStorage } from "./utils/localStorage";
import ContactUs from "./components/ContactUs";
import Socials from "./components/Socials";
import AboutUs from "./components/AboutUs";
import Dashboard from "./components/Dashboard";
import { useSelector } from "react-redux";
import { handleSetTheme } from "./utils";
import Portfolio from "./components/Portfolio";
import ScrollToTop from "./components/ScrollToTop";
import AdminForm from "./components/AdminForm";
import { useMyContext } from "./components/Context";

const Holder = styled.div<{ $isMobile: boolean; $headerHeight: number }>`
  min-height: ${(props) =>
    !props.$isMobile
      ? `calc(100vh - ${props.$headerHeight}px)`
      : "min-content"};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > * {
    width: 100%;
  }
`;

function App() {
  const [headerSize, setHeaderSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  // Test
  const user = useSelector(
    (state: { admin: { user: true | null } }) => state.admin.user
  );

  const { isMobile } = useMyContext();
  // Test--

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      const { width, height } = headerRef.current.getBoundingClientRect();

      setHeaderSize({ width, height });
    }

    const currentLang = getItemFromLocalStorage("lang", "null");

    if (currentLang == "ar") {
      document.body.style.fontFamily = `Alexandria, sans-serif`;
      document.body.style.direction = `rtl`;
    } else {
      document.body.style.fontFamily = `"Anta", sans-serif`;
      document.body.style.direction = `ltr`;
    }

    const currentColor = getItemFromLocalStorage("theme-color", "blue");

    handleSetTheme(currentColor, false);
  }, []);

  return (
    <>
      <BrowserRouter>
        <Menu />

        <div className="container">
          <div ref={headerRef}>
            <Header />
            <Paths />
          </div>
          <ScrollToTop />
          <Routes>
            <Route
              path="/"
              element={
                <Holder $isMobile={isMobile} $headerHeight={headerSize.height}>
                  <Landing />
                </Holder>
              }
            />
            <Route
              path="/services"
              element={
                <Holder $isMobile={isMobile} $headerHeight={headerSize.height}>
                  <Services />
                </Holder>
              }
            />
            <Route
              path="/portfolio"
              element={
                <Holder $isMobile={isMobile} $headerHeight={headerSize.height}>
                  <Portfolio />
                </Holder>
              }
            />

            <Route
              path="/contact_us"
              element={
                <Holder $isMobile={isMobile} $headerHeight={headerSize.height}>
                  <ContactUs />
                </Holder>
              }
            />
            <Route
              path="/about_us"
              element={
                <Holder $isMobile={isMobile} $headerHeight={headerSize.height}>
                  <AboutUs />
                </Holder>
              }
            />
            <Route
              path="/social_media"
              element={
                <Holder $isMobile={isMobile} $headerHeight={headerSize.height}>
                  <Socials />
                </Holder>
              }
            />
            <Route
              path="/dash"
              element={
                <Holder $isMobile={isMobile} $headerHeight={headerSize.height}
                  style={{
                    minHeight: `calc(100vh - ${headerSize.height}px) `,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {user ? <Dashboard /> : <AdminForm />}
                </Holder>
              }
            />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
