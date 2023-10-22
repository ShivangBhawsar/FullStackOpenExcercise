const DisplayInfo = ({ country }) => {
  if (country === null) {
    return;
  }
  const flagUrl = country.flags.png;
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital.join(", ")}</div>
      <div>area {country.area}</div>

      <h4>languages:</h4>
      <ul>
        {Object.values(country.languages).map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>

      <img src={flagUrl} />
    </div>
  );
};

export default DisplayInfo;
