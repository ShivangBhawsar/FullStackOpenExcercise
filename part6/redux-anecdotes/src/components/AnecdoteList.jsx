import { useDispatch, useSelector } from "react-redux";
import { incrementVote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === "") {
      return anecdotes;
    }
    return anecdotes.filter((a) =>
      a.content.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const dispatch = useDispatch();

  const vote = (anecdote) => {
    console.log("vote", anecdote.id);
    dispatch(setNotification(`you voted '${anecdote.content}'`,5));
    dispatch(incrementVote(anecdote));
  };
  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
