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
import Template from './components/blog/BlogTemplate';
import Itinerary from './pages/Itinerary/Itinerary';
import ItineraryDetails from './pages/Itinerary/ItineraryDetails';
import Profile from './pages/Profile/Profile';

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
      <Route path="/blog/:id" element={<ProtectedRoutes><Posts/></ProtectedRoutes>} />
      <Route path="/blog-create" element={<ProtectedRoutes><Template/></ProtectedRoutes>} />
      <Route path="/blog-edit/:id" element={<Template />} />
      <Route path="/my-itineraries" element={<ProtectedRoutes><Itinerary/></ProtectedRoutes>} />
      <Route path="/itinerary/:id" element={<ProtectedRoutes><ItineraryDetails/></ProtectedRoutes>} />
      <Route path="/profile" element={<ProtectedRoutes><Profile/></ProtectedRoutes>} />
    </Routes>
  </Router>

);

const App = () => {
  return (
    <div>{routes}</div>
  )
}

export default App