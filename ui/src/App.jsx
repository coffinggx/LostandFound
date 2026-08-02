import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Browseitem from './pages/Browseitem'
import ClaimItem from './pages/ClaimItem'
import Dashboard from './pages/Dashboard'
import ItemDetails from './pages/ItemDetails'
import Myclaims from './pages/Myclaims'
import MyPosts from './pages/MyPosts'
import Admin from './pages/Admin'
import RootLayout from './layout/RootLayout'
import ProtectedRoute from './components/ProtectedRoute'
import "./index.css"
import ReportLost from './pages/ReportLost'
import ReportFound from './pages/ReportFound'
import Profile from './pages/Profile'
import CreatePost from './components/CreatePost'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {/* Public routes - no layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with RootLayout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="browse" element={<Browseitem />} />
            <Route path="item/:id" element={<ItemDetails />} />
            <Route path="claim/:id" element={<ClaimItem />} />
            <Route path="claims" element={<Myclaims />} />
            <Route path="posts" element={<MyPosts />} />
            <Route path="report-lost" element={<ReportLost />} />
            <Route path="report-found" element={<ReportFound />} />
            <Route path="admin" element={<Admin />} />
            <Route path="profile" element={<Profile />} />
            <Route path="create-post" element={<CreatePost />} />
          </Route>
        </Route>
      </Route>
    )
  )

  return (
    <RouterProvider router={router} />
  );
}

export default App;