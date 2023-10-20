import { useEffect } from "react";
import personService from "../services/persons";

let fullPersonList = [];
const Filter = ({ searchName, setSearchName, setPersons }) => {
  useEffect(() => {
    personService.getAll().then((response) => (fullPersonList = response));
  });

  const handleSearchNameChange = (event) => {
    const name = event.target.value;
    setSearchName(name);

    const comparePerson = (a, b) => {
      let pattern = new RegExp(b, "i");
      return pattern.test(a);
    };
    setPersons(
      fullPersonList.filter((person) => comparePerson(person.name, name))
    );
  };

  return (
    <form>
      <div>
        filter shown with:{" "}
        <input value={searchName} onChange={handleSearchNameChange} />
      </div>
    </form>
  );
};

export default Filter;
