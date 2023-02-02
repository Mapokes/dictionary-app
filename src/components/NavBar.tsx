import React from "react";
import { nanoid } from "nanoid";

type Font = {
  value: string;
  name: string;
};

const NavBar: React.FC = () => {
  // Array with font families - used for inline CSS for HTML elements - select options
  const fontFamilies: Font[] = [
    { value: "serif", name: "Serif" },
    { value: "sans-serif", name: "Sans Serif" },
    { value: "monospace", name: "Monospace" },
  ];
  // default font family for the above on page load
  const [fontFam, setFontFam] = React.useState<string>(fontFamilies[0].value);
  // loads theme from local storage - if it's empty gets "prefers-color-scheme" value from user's browsers and saves it in local storage
  const [checked, setChecked] = React.useState<boolean>(() => {
    if (localStorage.getItem("darkTheme") === "true") {
      return true;
    } else if (localStorage.getItem("darkTheme") === "false") {
      return false;
    } else {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  });
  const siteBody = document.querySelector("body");
  /**Handles changes for font Select and theme checkbox slider */
  function handleOnChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const name: string = e.target.name;
    const value: string = e.target.value;

    if (name === "fonts") {
      setFontFam(value);
    } else if (name === "checkbox") {
      setChecked((prevChecked) => !prevChecked);
    }
  }

  // sets class on the body when user changes font
  React.useEffect(() => {
    siteBody!.classList.contains("serif") && siteBody!.classList.remove("serif");
    siteBody!.classList.contains("sans-serif") && siteBody!.classList.remove("sans-serif");
    siteBody!.classList.contains("monospace") && siteBody!.classList.remove("monospace");
    siteBody!.classList.add(fontFam);
  }, [fontFam]);

  // every time user checks or unchecks checkbox, class is set on HTML Body and local storage is updated
  React.useEffect(() => {
    checked ? siteBody!.classList.add("dark") : siteBody!.classList.remove("dark");
    localStorage.setItem("darkTheme", JSON.stringify(checked));
  }, [checked]);

  return (
    <nav className="nav">
      <i className="fa-solid fa-book nav__logo"></i>
      <div className="nav-options">
        <div className="fonts-wrapper">
          <select
            name="fonts"
            className="fonts-wrapper__fonts-select"
            value={fontFam}
            onChange={(e) => handleOnChange(e)}
          >
            {fontFamilies.map((fontFam) => {
              return (
                <option key={nanoid()} value={fontFam.value} className={`fonts-select-${fontFam.value}`}>
                  {fontFam.name}
                </option>
              );
            })}
          </select>
          <i className="fa-solid fa-chevron-down fonts-wrapper__arrow"></i>
        </div>
        <div className="toggle-container">
          <label className="switch">
            <input
              type="checkbox"
              name="checkbox"
              className="switch__checkbox"
              checked={checked}
              onChange={(e) => handleOnChange(e)}
            />
            <span className="switch__slider"></span>
          </label>
          <i className="fa-regular fa-moon toggle-container__icon"></i>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
