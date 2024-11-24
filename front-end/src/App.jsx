import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/Landing/LandingPage'
import Signin from './pages/Authentication/Signin';
import Signup from './pages/Authentication/Signup';

const routes = (
  <Router>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/signin' element={<Signin/>}/>
      <Route path='/signup' element={<Signup/>}/>
    </Routes>
  </Router>

);

const App = () => {
  return (
    <div>{routes}</div>
  )
}

export default App