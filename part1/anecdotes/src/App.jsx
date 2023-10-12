import { useState } from "react";

const Button = ({ click, text }) => {
  return <button onClick={click}>{text}</button>;
};
const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };

  const addVote = () => {
    let curVotes = [...votes];
    curVotes[selected] += 1;
    setVotes(curVotes);
  };

  const indexOfMax = (arr) => {
    let maxIndex = 0;
    let maxValue = arr[0];

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > maxValue) {
        maxIndex = i;
        maxValue = arr[i];
      }
    }
    return maxIndex;
  };

  return (
    <div>
      <h1>Anectdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button click={addVote} text="vote" />
      <Button
        click={() => {
          setSelected(getRandomInt(anecdotes.length - 1));
        }}
        text="next anecdote"
      />

      <h1>Anectdote with most votes</h1>
      <p>{anecdotes[indexOfMax(votes)]}</p>
      <p>has {votes[indexOfMax(votes)]} votes</p>
    </div>
  );
};

export default App;
