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
  const themeFile = document.createElement("style");

  document.head.appendChild(themeFile);

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




