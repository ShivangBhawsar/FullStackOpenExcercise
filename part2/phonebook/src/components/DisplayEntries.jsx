const Person = ({ id, name, number, onDelete }) => {
  const handleDelete = () => {
    if (confirm(`Delete ${name} ?`)) onDelete(id);
  };
  return (
    <>
      <p>
        {name} {number} <button onClick={handleDelete}>delete</button>
      </p>
    </>
  );
};
const DisplayEntries = ({ persons, onDeletePerson }) => {
  return (
    <>
      <h2>Numbers</h2>
      <div>
        {persons.map((person) => (
          <Person
            key={person.id}
            name={person.name}
            number={person.number}
            id={person.id}
            onDelete={onDeletePerson}
          />
        ))}
      </div>
    </>
  );
};

export default DisplayEntries;
