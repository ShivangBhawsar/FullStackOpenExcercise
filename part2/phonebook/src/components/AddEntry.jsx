import personService from "../services/persons";

const AddEntry = ({
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  setPersons,
  setSearchName,
  setNewAdd,
  setErrorMessage,
}) => {
  const addPerson = (event) => {
    event.preventDefault();
    if (newName.trim().length === 0) {
      window.alert(`Name field is empty!!`);
      return;
    }
    personService.getAll().then((fullPersonList) => {
      //Check if newName already exists in persons
      if (
        fullPersonList.filter(
          (person) => person.name.toLowerCase() === newName.toLowerCase()
        ).length === 1
      ) {
        if (
          confirm(
            `${newName} is already added to phonebook, replace the old number with a new one?`
          )
        ) {
          const prevEntry = fullPersonList.filter(
            (person) => person.name.toLowerCase() === newName.toLowerCase()
          )[0];
          const newEntry = { ...prevEntry, number: newNumber };
          personService
            .update(newEntry.id, newEntry)
            .then((response) => {
              setPersons(
                fullPersonList.map((person) =>
                  person.id !== newEntry.id ? person : response.data
                )
              );
            })
            .catch((error) => {
              console.log(error);
              setErrorMessage(
                `Information of '${newName}' has already been removed from server`
              );
              setTimeout(() => {
                setErrorMessage(null);
              }, 5000);
            });

          setNewAdd(newName);
        }
      } else {
        personService
          .create({
            name: newName,
            number: newNumber,
          })
          .then((response) => setPersons(fullPersonList.concat(response))); // some issue here as when we add a new entry while on filter it doesent get added

        setNewAdd(newName);
      }
      setSearchName("");
      setNewName("");
      setTimeout(() => {
        setNewAdd("");
      }, 5000);
      setNewNumber("");
    });
  };

  const handleAddNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  return (
    <>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleAddNameChange} />
          <br />
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default AddEntry;
