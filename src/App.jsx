import { useState } from "react";
import "./App.css";
import { Button } from "antd";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./routers/PrivateRoute";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import EmployeeManagement from "./components/EmployeeManagement";
import RouteManagement from "./components/RouteManagement";
import TripManagement from "./components/TripManagement";
import TicketManagement from "./components/TicketManagement";
import VehicleManagement from "./components/VehicleManagement";
import Payment from "./components/Payment";
import Statistic from "./components/Statistic";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/employee"
        element={
          <PrivateRoute>
            <MainLayout>
              <EmployeeManagement />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/route"
        element={
          <PrivateRoute>
            <MainLayout>
              <RouteManagement />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/trip"
        element={
          <PrivateRoute>
            <MainLayout>
              <TripManagement />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/ticket"
        element={
          <PrivateRoute>
            <MainLayout>
              <TicketManagement />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/vehicle"
        element={
          <PrivateRoute>
            <MainLayout>
              <VehicleManagement />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <PrivateRoute>
            <MainLayout>
              <Payment />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/statistic"
        element={
          <PrivateRoute>
            <MainLayout>
              <Statistic />
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
export default App;
