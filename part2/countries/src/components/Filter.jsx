import { useState, useEffect } from "react";
import countryService from "../services/country";

let name = "";
const Filter = ({ setMatchingCountries, setInfoCountry }) => {
  //why will this run everytime when u change the input, it only runs when filter component is rerendered
  const [country, setCountry] = useState("");
  useEffect(() => {
    setInfoCountry(null);
    if (name === "") {
      setMatchingCountries([]);
      return;
    }
    const compareCountry = (a, b) => {
      let pattern = new RegExp(b, "i");
      return pattern.test(a);
    };
    countryService
      .getAll()
      .then((response) => {
        return response.filter(
          (data) => compareCountry(data.name.common, name)
          // ||compareCountry(country.officialName, name)
        );
      })
      .then((response) => {
        if (response.length > 10) {
          setMatchingCountries(null);
        } else {
          setMatchingCountries(response);
        }
      });
  }, [country, setMatchingCountries, setInfoCountry]);

  const handleInputChange = (event) => {
    name = event.target.value;
    setCountry(name);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        Find countries
        <input value={country} onChange={handleInputChange} />
      </form>
    </div>
  );
};

export default Filter;
