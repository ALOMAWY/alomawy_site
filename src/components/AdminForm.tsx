import { faKey, faUserTie, faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from "styled-components";
import { signRejected, signResolved } from "../redux/adminSign";
import { useState } from "react";
import { useDispatch } from "react-redux";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

const StyledForm = styled.form<{ $error?: boolean }>`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2.5rem;
  border: 1px solid rgba(var(--main-color-rgb), 0.3);
  backdrop-filter: blur(15px);
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  animation: ${fadeIn} 0.6s ease-out;
  ${props => props.$error && `animation: ${shake} 0.3s ease-in-out;`}
  transition: all 0.3s ease;

  h1 {
    color: #fff;
    margin-bottom: 2rem;
    text-align: center;
    font-size: 1.8rem;
    letter-spacing: 1px;
    text-shadow: 0 0 10px var(--main-color);
  }

  .input {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 15px;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:focus-within {
      border-color: var(--main-color);
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 15px rgba(var(--main-color-rgb), 0.2);
      transform: translateY(-2px);
    }

    label {
      width: 20px;
      display: flex;
      justify-content: center;
      svg {
        color: var(--main-color);
        font-size: 1.1rem;
        transition: transform 0.3s ease;
      }
    }

    &:focus-within label svg {
      transform: scale(1.2);
    }

    input {
      padding: 8px 5px;
      width: 100%;
      background: transparent;
      color: #fff;
      border: none;
      outline: none;
      font-size: 1rem;

      &::placeholder {
        color: rgba(255, 255, 255, 0.4);
        font-weight: 300;
      }
    }
  }

  button {
    margin-top: 1rem;
    padding: 14px;
    border: none;
    border-radius: 12px;
    background: var(--main-color);
    color: #fff;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    &:hover:not(:disabled) {
      filter: brightness(1.2);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(var(--main-color-rgb), 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      background: #555;
    }
  }

  .error-msg {
    color: #ff4d4d;
    font-size: 0.85rem;
    text-align: center;
    margin-top: -0.5rem;
    min-height: 1.2rem;
  }
`;

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

const AdminForm = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const handleSign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    const formData = new FormData(e.target as HTMLFormElement);
    const { email, password } = Object.fromEntries(formData);

    setLoading(true);

    // Smooth simulated check for a better feel
    setTimeout(() => {
      if (email === adminEmail && password === adminPassword) {
        setSuccess(true);
        setLoading(false);
        // Duration after pressing login to make it smooth before transition
        setTimeout(() => {
          dispatch(signResolved());
        }, 1000);
      } else {
        setError(true);
        setLoading(false);
        dispatch(signRejected());
        // Auto clear error shake after animation
        setTimeout(() => setError(false), 500);
      }
    }, 1200);
  };

  return (
    <StyledForm onSubmit={handleSign} $error={error}>
      <h1>{t("admin.ask")}</h1>
      <div className="input">
        <label htmlFor="email">
          <FontAwesomeIcon icon={faUserTie} />
        </label>
        <input
          type="text"
          placeholder={t("admin.placeholder.email")}
          id="email"
          name="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="input">
        <label htmlFor="adminPass">
          <FontAwesomeIcon icon={faKey} />
        </label>
        <input
          type="password"
          name="password"
          placeholder={t("admin.placeholder.pass")}
          id="adminPass"
          autoComplete="current-password"
          required
        />
      </div>
      
      <div className="error-msg">
        {error && "Invalid credentials. Please try again."}
      </div>

      <button type="submit" disabled={loading || success}>
        {success ? (
          <>
            <FontAwesomeIcon icon={faCheckCircle} />
            {t("admin.success")}
          </>
        ) : loading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin />
            {t("info.loading")}
          </>
        ) : (
          t("admin.sign")
        )}
      </button>
    </StyledForm>
  );
};

export default AdminForm;
