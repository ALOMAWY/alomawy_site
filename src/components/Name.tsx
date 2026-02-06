import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Styled_Name = styled.h3`
  font-family: "Anta", sans-serif;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 4px;
  position: relative;
  width: fit-content;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 2px;
  
  &::after {
    content: '';
    width: 2px;
    height: 1em;
    background: var(--main-color);
    animation: blink 0.8s infinite;
    margin-left: 4px;
  }

  @keyframes blink {
    50% { opacity: 0; }
  }
`;

const Name = () => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const words = ["ALOMAWY", "Developer", "Designer", "Creative"];

  // Typing effect logic
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev: number) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev: number) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 50 : 150, parseInt(Math.random() * 200 as any)));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  return (
    <Link to="/" style={{ textDecoration: 'none' }}>
      <div style={{ padding: "0.5rem 1rem" }}>
        <Styled_Name>
          {words[index].substring(0, subIndex)}
        </Styled_Name>
      </div>
    </Link>
  );
};

export default Name;
