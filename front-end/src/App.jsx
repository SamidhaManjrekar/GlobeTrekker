import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/Landing/LandingPage'
import Signin from './pages/Authentication/Signin';
import Signup from './pages/Authentication/Signup';
import Home from './pages/Home/Home';
import CreateTrip from './pages/CreateTrip/CreateTrip';
import Blog from './pages/Blog/Blog';
import Posts from './components/blog/BlogPosts';
import ShowTrip from './pages/CreateTrip/ShowTrip';

const routes = (
  <Router>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/signin' element={<Signin/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/create-trip' element={<CreateTrip/>}/>
      <Route path='/show-trip' element={<ShowTrip/>}/>
      <Route path='/blog' element={<Blog/>}/>
      <Route path="/blog/:id" element={<Posts />} />
    </Routes>
  </Router>

);

const App = () => {
  return (
    <div>{routes}</div>
  )
}

export default App