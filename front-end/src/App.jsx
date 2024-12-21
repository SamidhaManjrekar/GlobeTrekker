import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/Landing/LandingPage'
import Signin from './pages/Authentication/Signin';
import Signup from './pages/Authentication/Signup';
import Home from './pages/Home/Home';
import CreateTrip from './pages/CreateTrip/CreateTrip';
import Blog from './pages/Blog/Blog';
import Posts from './components/blog/BlogPosts';
import ShowTrip from './pages/CreateTrip/ShowTrip';
import ProtectedRoutes from './components/ProtectedRoutes';

function Logout(){
  localStorage.clear()
  return <Navigate to='/'/>
}

const routes = (
  <Router>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/signin' element={<Signin/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path="/logout" element={<Logout />} />
      <Route path='/home' element={<ProtectedRoutes><Home/></ProtectedRoutes>}/>
      <Route path='/create-trip' element={<CreateTrip/>}/>
      <Route path='/show-trip' element={<ProtectedRoutes><ShowTrip/></ProtectedRoutes>}/>
      <Route path='/blog' element={<ProtectedRoutes><Blog/></ProtectedRoutes>}/>
      <Route path="/blog/:id" element={<ProtectedRoutes><Posts /></ProtectedRoutes>} />
    </Routes>
  </Router>

);

const App = () => {
  return (
    <div>{routes}</div>
  )
}

export default App