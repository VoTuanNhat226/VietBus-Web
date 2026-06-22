# VietBus Web Dashboard

VietBus Web is a comprehensive Admin and Employee Dashboard for the VietBus transport management system. Built with modern web technologies, it provides a powerful, responsive, and intuitive interface to manage all aspects of the bus operations including trips, ticketing, vehicles, and personnel.

## 🚀 Features

- **Authentication & Authorization**: Secure login with JWT. Role-based access control for Admins and Employees.
- **Interactive Dashboard**: Real-time overview of today's trips, categorized by status (Departing Today, On Route, Open for Booking).
- **Statistics & Reporting**: 
  - Comprehensive data visualization using Recharts for revenue trends, ticket sales, and seat occupancy.
  - Export data and reports directly to Excel (`.xlsx`) and PDF (`.pdf`).
- **Trip & Route Management**: 
  - Schedule and manage trips, view detailed trip configurations.
  - Interactive seat map for managing bookings, seat holds, and ticket statuses in real-time.
- **Ticketing System**: Complete handling of ticket reservations, multi-seat bookings, cancellations, and tracking of pending/unpaid tickets.
- **Fleet Management**: Manage vehicle profiles, track vehicle statuses, and define seat layouts.
- **User Management**: Unified management interfaces for Accounts, Employees, and Passengers.
- **Payment History**: Track all transactions, including VNPay and MoMo payments processed through the backend.

## 🛠️ Technology Stack

- **Core**: React 19, Vite
- **Routing**: React Router DOM v7
- **UI & Styling**: Tailwind CSS, Ant Design (UI Components)
- **HTTP Client**: Axios (with centralized interceptors for authentication)
- **Data Visualization**: Recharts
- **Export Utilities**: jsPDF, jspdf-autotable, xlsx
- **Utilities**: Moment.js (Date formatting), JWT Decode

## 📂 Project Structure

```text
src/
├── assets/          # Static assets (fonts, icons, etc.)
├── components/      # Reusable UI components (Headbar, Sidebar, etc.)
├── constants/       # Global constants and configuration variables
├── containers/      # Page-level components organized by feature (Trip, Ticket, Statistic)
├── context/         # React Context for global state management (e.g., Auth)
├── hooks/           # Custom React hooks
├── layouts/         # Layout wrappers (MainLayout for dashboard wrapping)
├── pages/           # High-level route pages (Login, Home)
├── routers/         # Routing configuration (PrivateRoute)
├── services/        # API integration layer (Axios services for each entity)
└── utils/           # Helper functions and formatting utilities
```

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Running instance of the `VietBus-API` (Backend)

### Installation & Setup

1. **Navigate to the project directory:**
   ```bash
   cd VietBus-Web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Review and configure your environment variables. The project uses `.env.development` and `.env.production`. Ensure the API base URL points to your running backend:
   ```env
   VITE_API_URL=http://localhost:8088
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

## 📦 Build & Deployment

To build the project for production, run:

```bash
npm run build
```

This will generate an optimized production bundle in the `dist` folder. You can preview the production build locally using:

```bash
npm run preview
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and intended for the internal use of the VietBus transport company.
