import { useEffect } from "react";

const DisplayMatches = ({ matchingCountries, handleInfoDisplay }) => {
  useEffect(() => {
    if (matchingCountries !== null && matchingCountries.length === 1)
      handleInfoDisplay(matchingCountries[0]);
  });

  if (matchingCountries === null) {
    return <p>Too many matches, specify another filter</p>;
  } else if (matchingCountries.length < 2) {
    return;
  } else {
    return (
      <div>
        {matchingCountries.map((country) => {
          return (
            <div key={country.name.common}>
              <div>
                {country.name.common}
                <button onClick={() => handleInfoDisplay(country)}>
                  {" "}
                  show
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
};

export default DisplayMatches;
