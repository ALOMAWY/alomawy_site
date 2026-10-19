import { getItemFromLocalStorage, setItemInLocalStorage } from "./localStorage";

export const handleChangeLang = (i18n: any): void => {
  let lang: string = getItemFromLocalStorage("lang", "ar");

  if (lang == "ar") {
    setItemInLocalStorage("lang", "en");

    lang = "en";

    i18n.changeLanguage(lang);
    document.body.style.fontFamily = `"Anta", sans-serif`;
    document.body.style.direction = `ltr`;
  } else {
    setItemInLocalStorage("lang", "ar");
    lang = "ar";
    i18n.changeLanguage(lang);

    document.body.style.fontFamily = `Alexandria, sans-serif`;
    document.body.style.direction = `rtl`;
  }
};

export const handleSetTheme = (color: string, change?: boolean): void => {
  const colors: string[] = ["blue", "purple", "green", "red", "orange"];

  const currentColor = getItemFromLocalStorage("theme-color", "blue");
  let nextColor;

  if (change) {
    nextColor = colors[colors.indexOf(currentColor) + 1] || "blue";
  } else {
    nextColor = color;
  }

  setItemInLocalStorage("theme-color", nextColor);


  // document.body.style.backgroundImage = `url(./imgs/backgrounds/Background_${nextColor}.png)`;
  document.body.style.backgroundImage = `url("./backgrounds/Background_${nextColor}.png")`;
  
  let themeFile = document.getElementById("theme-style");
  if (!themeFile) {
    themeFile = document.createElement("style");
    themeFile.id = "theme-style";
    document.head.appendChild(themeFile);
  }

  switch (nextColor) {
    case "red":
      themeFile.innerHTML = `:root {
  --main-color: #ff0000;
  --main-color-rgb: 255, 0, 0;
  --secondary-color: #e7c3c3; 
  --background-main-color: #ff000038;
  --background-white-color: #e7c3c37e; 
  --background-color: #000f18;
}`;
      break;
    case "blue":
      themeFile.innerHTML = `:root {
  --main-color: #186ca4;
  --main-color-rgb: 24, 108, 164;
  --secondary-color: #fff;
  --background-main-color: rgba(30, 56, 103, 0.7);
  --background-white-color: rgba(255, 255, 255, 0.7);
  --background-color: #000f18;
}
`;
      break;
    case "green":
      themeFile.innerHTML = `:root {
  --main-color: #4caf50;
  --main-color-rgb: 76, 175, 80;
  --secondary-color: #b8f0ba;
  --background-main-color: #4caf505c;
  --background-white-color: #ffffff99;
  --background-color: #000f18;
}
`;
      break;
    case "orange":
      themeFile.innerHTML = `:root {
  --main-color: #ff9800;
  --main-color-rgb: 255, 152, 0;
  --secondary-color: #ffe2b6;
  --background-main-color: #ff980040;
  --background-white-color: #b7a488;
  --background-color: #000f18;
}
`;
      break;
    case "purple":
      themeFile.innerHTML = `:root {
  --main-color: #9c27b0;
  --main-color-rgb: 156, 39, 176;
  --secondary-color: #ba95c0;
  --background-main-color: #9c27b05c;
  --background-white-color: #d4abdb94;
  --background-color: #000f18;
}
`;
  }
};

export const calculate = (date: string): string => {
  const myDate = new Date(date);
  const currentDate = new Date();

  let years = currentDate.getFullYear() - myDate.getFullYear();
  let months = currentDate.getMonth() - myDate.getMonth();
  let days = currentDate.getDate() - myDate.getDate();

  if (days < 0) {
    months--;

    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    days += prevMonth.getDate();
  }

  if (months < 0) {
    --years;
    months += 12;
  }

  return getItemFromLocalStorage("lang", "en") == "en"
    ? `${years}-Years , ${months}-Months, ${days}-Days `
    : `${years} سنة و ${months} أشهر و ${days} يوم `;
};

export const ALL_PROJECT_TYPES = [
  "website", "game", "simple", "dashboard", "app",
  "api", "library", "mobile", "landing", "ecommerce", "blog", "portfolio", "other",
];

export const getProjectTypeStyle = (type: string) => {
  const styles: Record<string, { color: string; accentBg: string }> = {
    website: { color: "#3498db", accentBg: "rgba(52, 152, 219, 0.1)" },
    game: { color: "#9b59b6", accentBg: "rgba(155, 89, 182, 0.1)" },
    simple: { color: "#2ecc71", accentBg: "rgba(46, 204, 113, 0.1)" },
    dashboard: { color: "#f1c40f", accentBg: "rgba(241, 196, 15, 0.1)" },
    app: { color: "#e91e63", accentBg: "rgba(233, 30, 99, 0.1)" },
    api: { color: "#00bcd4", accentBg: "rgba(0, 188, 212, 0.1)" },
    library: { color: "#ff5722", accentBg: "rgba(255, 87, 34, 0.1)" },
    mobile: { color: "#8bc34a", accentBg: "rgba(139, 195, 74, 0.1)" },
    landing: { color: "#607d8b", accentBg: "rgba(96, 125, 139, 0.1)" },
    ecommerce: { color: "#ff9800", accentBg: "rgba(255, 152, 0, 0.1)" },
    blog: { color: "#795548", accentBg: "rgba(121, 85, 72, 0.1)" },
    portfolio: { color: "#673ab7", accentBg: "rgba(103, 58, 187, 0.1)" },
    other: { color: "#9e9e9e", accentBg: "rgba(158, 158, 158, 0.1)" },
  };
  return styles[type] || styles.other;
};
