const Header = (props) => {
  return <h2>{props.course.name}</h2>;
};

const Part = (props) => {
  return (
    <p>
      {props.parts} {props.exercise}
    </p>
  );
};

const Content = (props) => {
  return (
    <>
      {props.parts.map((x) => (
        <Part key={x.id} parts={x.name} exercise={x.exercises} />
      ))}
    </>
  );
};

const Total = (props) => {
  return (
    <div>
      <strong>
        total of{" "}
        {props.parts.reduce((sum, current) => sum + current.exercises, 0)}{" "}
        exercises
      </strong>
    </div>
  );
};

const Course = ({ course }) => {
  return (
    <>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  );
};

export default Course;