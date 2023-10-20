import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import AddEntry from "./components/AddEntry";
import DisplayEntries from "./components/DisplayEntries";
import personService from "./services/persons";

const Notification = ({ errorMessage, newAdd }) => {
  if (errorMessage !== null) {
    return <div className="error">{errorMessage}</div>;
  }
  if (newAdd === "") {
    return null;
  }

  return <div className="addSuccess">Added {newAdd}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newAdd, setNewAdd] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((response) => setPersons(response));
  }, []);
  const onDeletePerson = (id) => {
    personService.erase(id).then(() => {
      // After the delete operation is successful, update the state to trigger a re-render
      setPersons(persons.filter((person) => person.id !== id));
    });
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification errorMessage={errorMessage} newAdd={newAdd} />
      <Filter
        searchName={searchName}
        setSearchName={setSearchName}
        setPersons={setPersons}
      />
      <AddEntry
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        setPersons={setPersons}
        setSearchName={setSearchName}
        setNewAdd={setNewAdd}
        setErrorMessage={setErrorMessage}
      />
      <DisplayEntries
        persons={persons}
        onDeletePerson={(id) => onDeletePerson(id)}
      />
    </div>
  );
};

export default App;
