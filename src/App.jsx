import "./App.css";
import Login from "./pages/Login";
import {Route, Routes} from "react-router-dom";
import PrivateRoute from "./routers/PrivateRoute";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import EmployeeManagement from "./containers/Employee/EmployeeManagement.jsx";
import RouteManagement from "./containers/Route/RouteManagement.jsx";
import TripManagement from "./containers/Trip/TripManagement.jsx";
import TicketManagement from "./containers/Ticket/TicketManagement.jsx";
import VehicleManagement from "./containers/Vehicle/VehicleManagement.jsx";
import Payment from "./containers/Payment/Payment.jsx";
import Statistic from "./containers/Statistic/Statistic.jsx";
import AccountManagement from "./containers/Account/AccountManagement.jsx";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <Home/>
                        </MainLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/account"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <AccountManagement/>
                        </MainLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/employee"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <EmployeeManagement/>
                        </MainLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/route"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <RouteManagement/>
                        </MainLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/trip"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <TripManagement/>
                        </MainLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/ticket"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <TicketManagement/>
                        </MainLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/vehicle"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <VehicleManagement/>
                        </MainLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/payment"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <Payment/>
                        </MainLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/statistic"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <Statistic/>
                        </MainLayout>
                    </PrivateRoute>
                }
            />
        </Routes>
    );
}

export default App;
