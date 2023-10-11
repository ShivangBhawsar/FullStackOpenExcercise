import { useState } from "react";

const Button = (props) => {
  return <button onClick={props.click}>{props.name}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td> {value}</td>
      </tr>
    </>
  );
};
const Statistics = ({ good, neutral, bad, stats }) => {
  if (stats.all > 0)
    return (
      <>
        <h1>statistics</h1>
        <table>
          <tbody>
            <StatisticLine text="good" value={good} />
            <StatisticLine text="neutral" value={neutral} />
            <StatisticLine text="bad" value={bad} />
            <StatisticLine text="all" value={stats.all} />
            <StatisticLine text="average" value={stats.average} />
            <StatisticLine text="positive" value={stats.positive + " %"} />
          </tbody>
        </table>
      </>
    );
  else
    return (
      <>
        <h1>statistics</h1>
        <p>No feedback given</p>{" "}
      </>
    );
};
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [stats, setStats] = useState({
    all: 0,
    average: 0,
    positive: 0,
  });

  const updateStats = ({ name }) => {
    let newGood = good;
    let newNeutral = neutral;
    let newBad = bad;
    if (name === "good") {
      newGood++;
      setGood(good + 1);
    } else if (name === "neutral") {
      newNeutral++;
      setNeutral(neutral + 1);
    } else if (name === "bad") {
      newBad++;
      setBad(bad + 1);
    }
    setStats({
      all: newGood + newNeutral + newBad,
      average: (newGood - newBad) / (newGood + newNeutral + newBad),
      positive: (100 * newGood) / (newGood + newNeutral + newBad),
    });
  };
  return (
    <div>
      <h1>give feedback</h1>
      <Button
        click={() => {
          updateStats({ name: "good" });
        }}
        name={"good"}
      />
      <Button
        click={() => {
          updateStats({ name: "neutral" });
        }}
        name={"neutral"}
      />
      <Button
        click={() => {
          updateStats({ name: "bad" });
        }}
        name={"bad"}
      />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        stats={stats}
      ></Statistics>
    </div>
  );
};

export default App;
