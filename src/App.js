import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminLogin from './components/adminLogin/adminLogin';
import AdminDashboard from './components/adminDashboard/adminDashboard';
import EmsignerDashboard from './components/adminDashboard/emsignerDashboard';
import Esign from './components/adminDashboard/esign';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path='/'
            element={
              <>
                <AdminLogin/>
              </>
            }
          />
          <Route
            path='/admindashboard'
            element={
              <>
                <AdminDashboard/>
              </>
            }
          />
          <Route
            path='/emsignerDashboard'
            element={
              <>
                <EmsignerDashboard/>
              </>
            }
          />
          <Route
            path='/esign'
            element={
              <>
                <Esign/>
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
