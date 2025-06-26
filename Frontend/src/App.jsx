import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import NavBar from './Components/NavBar'
import ProtectedRoute from './Components/ProtectedRoute'
import HomePage from './Pages/HomePage'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import Bookmark from './Pages/Bookmark'
import Summary from './Pages/Summary'
import Profile from './Pages/Profile'
import ArticlePage from './Pages/ArticlePage'
import GeoPolitics from './Pages/GeoPolitics'
import Sports from './Pages/Sports'
import CategoryPage from './Pages/CategoryPage'
import BreakingNewsPage from './Pages/BreakingNewsPage'
import TrendingPage from './Pages/TrendingPage'
import Contact from "./Pages/Contact"
const App = () => {
  return (
    <div>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <NavBar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/article/:id' element={<ArticlePage />} />
        <Route path="/geopolitics" element={<GeoPolitics />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/breaking-news" element={<BreakingNewsPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path='/bookmark' element={
          <ProtectedRoute>
            <Bookmark />
          </ProtectedRoute>
        } />
        
        <Route path='/summary' element={
          <ProtectedRoute>
            <Summary />
          </ProtectedRoute>
        } />
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path='/contact' element={<Contact />} />
      </Routes>
    </div>
  )
}

export default App
