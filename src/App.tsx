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

  const Holder = styled.div`
    min-height: ${!isMobile
      ? `calc(100vh - ${headerSize.height}px)`
      : "min-content"};

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > * {
      width: 100%;
    }
  `;

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
                <Holder>
                  <Landing />
                </Holder>
              }
            />
            <Route
              path="/services"
              element={
                <Holder>
                  <Services />
                </Holder>
              }
            />
            <Route
              path="/portfolio"
              element={
                <Holder>
                  <Portfolio />
                </Holder>
              }
            />

            <Route
              path="/contact_us"
              element={
                <Holder>
                  <ContactUs />
                </Holder>
              }
            />
            <Route
              path="/about_us"
              element={
                <Holder>
                  <AboutUs />
                </Holder>
              }
            />
            <Route
              path="/social_media"
              element={
                <Holder>
                  <Socials />
                </Holder>
              }
            />
            <Route
              path="/dash"
              element={
                <Holder
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
