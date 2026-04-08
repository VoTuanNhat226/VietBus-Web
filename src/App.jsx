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
import PaymentHistory from "./containers/Payment/PaymentHistory.jsx";
import Statistic from "./containers/Statistic/Statistic.jsx";
import AccountManagement from "./containers/Account/AccountManagement.jsx";
import VehicleDetail from "./containers/Vehicle/VehicleDetail.jsx";
import TripDetail from "./containers/Trip/TripDetail.jsx";
import PendingTicket from "./containers/PendingTicket/PendingTicket.jsx";
import PassengerManagement from "./containers/Passenger/PassengerManagement.jsx";

function App() {
    return (
        <Routes>
            {/* PUBLIC */}
            <Route path="/login" element={<Login />} />

            {/* PRIVATE */}
            <Route element={<PrivateRoute />}>

                {/* LAYOUT */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/account" element={<AccountManagement />} />
                    <Route path="/employee" element={<EmployeeManagement />} />
                    <Route path="/passenger" element={<PassengerManagement />} />
                    <Route path="/route" element={<RouteManagement />} />
                    <Route path="/trip" element={<TripManagement />} />
                    <Route path="/trip/:tripId" element={<TripDetail />} />
                    <Route path="/ticket" element={<TicketManagement />} />
                    <Route path="/pending-ticket" element={<PendingTicket />} />
                    <Route path="/vehicle" element={<VehicleManagement />} />
                    <Route path="/vehicle/:vehicleId" element={<VehicleDetail />} />
                    <Route path="/payment" element={<PaymentHistory />} />
                    <Route path="/statistic" element={<Statistic />} />
                </Route>

            </Route>
        </Routes>
    );
}

export default App;
