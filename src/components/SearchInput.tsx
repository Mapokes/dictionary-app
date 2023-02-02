import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  setPath: React.Dispatch<React.SetStateAction<string>>;
  error: {
    error: boolean;
    errorMsg: string;
    fetchError: boolean;
  };
  setError: React.Dispatch<
    React.SetStateAction<{
      error: boolean;
      errorMsg: string;
      fetchError: boolean;
    }>
  >;
}

const SearchInput: React.FC<Props> = ({ setPath, error, setError }: Props) => {
  const [wordInput, setWordInput] = React.useState<string>("");
  // used for updating path in browser's URL search bar from site's input: text
  const navigate = useNavigate();

  /**Handles change on the input: text */
  function handleChange(e: string) {
    setWordInput(e);
  }

  /**Handles click on the search button, if input is empty - displays error, else - updates state on "path" and "navigate" */
  function handleClick() {
    if (wordInput === "") {
      setError({ error: true, errorMsg: "Text field is empty.", fetchError: true });
    } else {
      navigate(wordInput);
      setPath(wordInput.trim());
    }
  }

  return (
    <div className="search-container">
      {error.error && <span className="error-msg">{error.errorMsg} Try another word</span>}
      <input
        type="text"
        name="search-input"
        className="search-container__input"
        value={wordInput}
        placeholder="Enter word"
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            document.querySelector<HTMLButtonElement>(".search-container__btn")!.click();
          }
        }}
      />
      <button className="search-container__btn" onClick={() => handleClick()}>
        <i className="fa-solid fa-magnifying-glass search-container__icon"></i>
      </button>
    </div>
  );
};
export default SearchInput;
