export const Header = ({ course }) => <h1>{course}</h1>

const Part = ({ part }) => (
  <p>{part.name} {part.exercises}</p>
)

export const Content = ({ parts }) => (
  <div>
    {parts.map(part => <Part key={part.id} part={part} />)}
  </div>
)

export const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return <p><strong>total of {total} exercises</strong></p>
}