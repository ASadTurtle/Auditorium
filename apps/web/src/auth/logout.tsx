import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

export function Logout() {
  const navigate = useNavigate();
  const BACKEND_PORT = Number(import.meta.env.VITE_API_PORT ?? 4000);

  function runLogout() {
    fetch('http://localhost:' + BACKEND_PORT + '/auth/logout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          return Promise.reject(data.error)
        } else {
          return Promise.resolve(data.token)
        }
    });
    localStorage.clear();
    navigate('/login')
  }

  return (
    <Button aria-label="Dashboard-logout" size="lg" className="justify-self-end" onClick={runLogout}>
      <LogOut />
      Logout
    </Button>
  )
}
  

