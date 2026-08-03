import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Home from './pages/Home'
import Browseitem from './pages/items/Browseitem'
import ClaimItem from './pages/items/ClaimItem'
import Dashboard from './pages/dashboard/Dashboard'
import ItemDetails from './pages/items/ItemDetails'
import Myclaims from './pages/account/Myclaims'
import MyPosts from './pages/account/MyPosts'
import Admin from './pages/admin/Admin'
import RootLayout from './layout/RootLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import "./index.css"
import ReportLost from './pages/items/ReportLost'
import ReportFound from './pages/items/ReportFound'
import Profile from './pages/account/Profile'
import CreatePost from './components/common/CreatePost'

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
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
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