import { Link } from 'react-router'
export function App() {
  return (
    <>
      <Link to="/login">
        <button>Login Page</button>
      </Link>
      <Link to="/register">
        <button>Register Page</button>
      </Link>
    </>
  )
}