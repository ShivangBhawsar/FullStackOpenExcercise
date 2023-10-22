import { useState } from "react";
import Filter from "./components/Filter";
import DisplayInfo from "./components/DisplayInfo";
import DisplayMatches from "./components/DisplayMatches";
import Weather from "./components/Weather";

function App() {
  const [matchingCountries, setMatchingCountries] = useState([]);
  const [infoCountry, setInfoCountry] = useState(null);

  const handleInfoDisplay = (country) => {
    setInfoCountry(country);
    setMatchingCountries([]);
  };

  return (
    <>
      <Filter
        setInfoCountry={setInfoCountry}
        setMatchingCountries={setMatchingCountries}
      />
      <DisplayMatches
        matchingCountries={matchingCountries}
        handleInfoDisplay={handleInfoDisplay}
      />
      <DisplayInfo country={infoCountry} />
      <Weather country={infoCountry} />
    </>
  );
}

export default App;
