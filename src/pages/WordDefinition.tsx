import React from "react";
import { nanoid } from "nanoid";

interface Props {
  path: string;
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

type WordData = {
  word: string;
  phonetic: string;
  audio: string;
  meanings: Meaning[];
  sourceUrls: string;
};

type Meaning = {
  partOfSpeech: string;
  definitions: Array<{
    definition: string;
    example?: string;
  }>;
  synonyms: string[];
};

const WordDefinition: React.FC<Props> = ({ path, error, setError }: Props) => {
  // state for search word information
  const [wordData, setWordData] = React.useState<WordData>({
    word: "",
    phonetic: "",
    audio: "",
    meanings: [],
    sourceUrls: "",
  });
  // state for the sound
  const [sound, setSound] = React.useState(new Audio());
  // state used to display loading animation during fetch request
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // every time path changes, updates state of loading to true. If fetch request is successful then state of "wordData" is updated accordingly, "loading" is set to false, resets "error".
  // If fetch is failed - catches error, and updates state of the "error"
  React.useEffect(() => {
    setIsLoading(true);

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${path}`)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Server responds with error!");
        }
        return response.json();
      })
      .then((data) => {
        const dataElement = data[0];
        const meanings: Meaning[] = [];
        let audioLink: string = "";

        for (let meaning of dataElement.meanings) {
          const definitions: { definition: string; example?: string }[] = [];
          const synonyms: string[] = [];

          for (let definition of meaning.definitions) {
            if (definition.example) {
              definitions.push({ definition: definition.definition, example: definition.example });
            } else {
              definitions.push({ definition: definition.definition });
            }
          }

          for (let synonym of meaning.synonyms) {
            synonyms.push(synonym);
          }

          meanings.push({
            partOfSpeech: meaning.partOfSpeech,
            definitions: definitions,
            synonyms: synonyms,
          });
        }

        for (let phonetic of dataElement.phonetics) {
          if (phonetic.audio && phonetic.audio !== "") {
            audioLink = phonetic.audio;
            break;
          }
        }

        setWordData({
          word: dataElement.word,
          phonetic: dataElement.phonetic,
          audio: audioLink,
          meanings: meanings,
          sourceUrls: dataElement.sourceUrls[0],
        });
        setIsLoading(false);
        setError({
          error: false,
          errorMsg: "",
          fetchError: false,
        });
      })
      .catch((e) => {
        console.log(e);
        setError({
          error: true,
          errorMsg: e.message,
          fetchError: true,
        });
      });
  }, [path]);

  /**handles click on audio button. Stops the audio, then creates new istance of audio, plays it and then updates state of the "sound" */
  function handleAudio(url: string) {
    sound.pause();
    const newSound = new Audio(url);
    newSound.play();
    setSound(newSound);
  }

  return !isLoading ? (
    <main className="main">
      <header className="main-header">
        <h1 className="main-header__title">{wordData.word}</h1>
        {wordData.phonetic && <h3 className="main-header__sub">{wordData.phonetic}</h3>}
        {wordData.audio !== "" && (
          <button className="main-header__play-btn" onClick={() => handleAudio(wordData.audio)}>
            <i className="fa-solid fa-play main-header__play-btn__icon"></i>
          </button>
        )}
      </header>

      {wordData.meanings.map((meaning) => {
        return (
          <section className="section" key={nanoid()}>
            <header className="section-header">
              <h4 className="section-header__title">{meaning.partOfSpeech}</h4>
              <div className="section-header__line"></div>
            </header>

            <article className="article">
              <h4 className="article__title">Meaning</h4>
              <ul className="article__list">
                {meaning.definitions.map((definition) => {
                  return (
                    <li className="article__list__item" key={nanoid()}>
                      {definition.definition}
                      {definition.example && (
                        <p className="article__list__item__example">{`"${definition.example}"`}</p>
                      )}
                    </li>
                  );
                })}
              </ul>

              {meaning.synonyms[0] && (
                <div className="article__synonyms">
                  <h4 className="article__synonyms__title">Synonyms</h4>
                  <ul className="synonyms-list">
                    {meaning.synonyms.map((synonym) => {
                      return (
                        <li className="synonyms-list__item" key={nanoid()}>
                          {synonym}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </article>
          </section>
        );
      })}

      <footer className="footer">
        <h4 className="footer__title">Source</h4>
        <a href={wordData.sourceUrls} className="footer__link" target="_blank">
          {wordData.sourceUrls}
          <i className="fa-solid fa-up-right-from-square footer__link__icon"></i>
        </a>
      </footer>
    </main>
  ) : (
    <div className="loading-animation">
      {!error.fetchError && (
        <>
          {" "}
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </>
      )}
    </div>
  );
};
export default WordDefinition;
