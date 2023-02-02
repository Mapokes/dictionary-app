import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import SearchInput from "./components/SearchInput";
import WordDefinition from "./pages/WordDefinition";

const App: React.FC = () => {
  // on page load, takes path from browser's URL search bar - user for below "path" state. It's updated every time user inputs new word
  let location = useLocation();
  const urlWord: string = location.pathname.substring(1);
  const [path, setPath] = React.useState<string>(urlWord);
  const [error, setError] = React.useState<{ error: boolean; errorMsg: string; fetchError: boolean }>({
    error: false,
    errorMsg: "",
    fetchError: false,
  });

  React.useEffect(() => {
    setPath(urlWord);
  }, [urlWord]);

  return (
    <>
      <NavBar />
      <SearchInput setPath={setPath} error={error} setError={setError} />
      {path !== "" && urlWord === path && (
        <Routes>
          <Route path={path} element={<WordDefinition path={path} error={error} setError={setError} />} />
        </Routes>
      )}
    </>
  );
};
export default App;
