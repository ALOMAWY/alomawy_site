# Alomawy Portal

A professional portfolio and services management platform built with React, TypeScript, and Firebase. This application serves as a personal brand website with a dynamic dashboard for managing content.

## 🚀 Features

- **Personal Portfolio**: Showcase projects and professional experience.
- **Service Management**: Display and manage services offered.
- **Admin Dashboard**: Secure area for managing site content.
- **Bilingual Support**: Full support for English and Arabic (RTL support).
- **Theming System**: Custom theme color support with persistence.
- **Responsive Design**: Optimized for all devices using Styled-Components.
- **Auth & Database**: Integrated with Firebase for secure admin access and real-time data.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Database/Auth**: [Firebase](https://firebase.google.com/)
- **Styling**: [Styled Components](https://styled-components.com/) + [FontAwesome](https://fontawesome.com/)
- **Internationalization**: [i18next](https://www.i18next.com/)
- **Navigation**: [React Router DOM](https://reactrouter.com/)

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd alomawy
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your Firebase and Admin credentials:
   ```env
   VITE_FIREBASE_KEY=your_firebase_api_key
   VITE_ADMIN_EMAIL=your_admin_email
   VITE_ADMIN_PASSWORD=your_admin_password
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🚀 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint to check for code quality.
- `npm run preview`: Locally previews the production build.

## 📁 Project Structure

```text
src/
├── components/   # UI Components (Landing, Portfolio, Dashboard, etc.)
├── data/         # Mock data or static constants
├── lib/          # External library configurations (Firebase, Redux store)
├── locals/       # Translation files (EN/AR)
├── redux/        # Redux slices and logic
├── utils/        # Helper functions
├── App.tsx       # Main Application entry and Routing
└── main.tsx      # React DOM rendering
```

## 🔐 Admin Access

To access the dashboard:
1. Navigate to `/dash`.
2. Login with the credentials defined in your environment variables.

