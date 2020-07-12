import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { Loader } from './components/Loader';
import "materialize-css"


function App() {
  const { login, logout, token, userId, ready } = useAuth()
  const isAuth = !!token
  const routes = useRoutes(isAuth)

  if (!ready) {
    return <Loader />
  }

  return (
    <AuthContext.Provider value={{
      login, logout, token, userId, isAuth
    }}>
      <Router>
        {isAuth && <Navbar />}
        <div className="container">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider >

  );
}

export default App;
