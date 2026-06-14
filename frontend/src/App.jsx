import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Dashboard from '../pages/Dashboard/Dashboard'
import Login from '../pages/Auth/Login'
import ProtectedRoute from '../components/ProtectedRoutes'
import Layout from "../components/Layout";
import Families from '../pages/Families/Families'
import Entries from '../components/EntriesModal'
import History from '../pages/History/History'
import CalendarPage from '../components/Calendar'
import InvoiceDashboard from '../pages/Invoice/InvoiceDashboard'

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login />} />
       <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/families"
          element={
            <ProtectedRoute>
              <Layout>
                <Families />
              </Layout>
            </ProtectedRoute>
          }
        />

<Route
  path="/entries/:id"
  element={
    <ProtectedRoute>
      <Layout>
        <Entries />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/invoice/dashboard"
  element={
    <ProtectedRoute>
      <Layout>
        <InvoiceDashboard />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route path="/calendar/:id" element={<CalendarPage />} />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <History />
              </Layout>
            </ProtectedRoute>
          }
        />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App