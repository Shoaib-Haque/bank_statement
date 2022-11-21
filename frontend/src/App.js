import './App.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Auth/Index.component";
import Accounts from "./components/Account/Index.component";
import AccountCreate from "./components/Account/Create.component";
import Statements from "./components/Statement/Index.component";
import StatementCreate from "./components/Statement/Create.component";
import Particulars from "./components/Particulars/Index.component";
import ParticularsCreate from "./components/Particulars/Create.component";
import Dashboard from "./components/Dashboard/Index.component";

function App() {
  return (
    <Router>
      <Container fluid className="p-0">
        <Row>
          <Col>
            <Routes>
              <Route path="/" element={<Navigate replace to="/login" />} />
              {/* Auth */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              {/* Account */}
              <Route
                path="/accounts"
                element={
                  <AdminProtectedRoute>
                    <Accounts />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/accounts/create"
                element={
                  <AdminProtectedRoute>
                    <AccountCreate />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/accounts/:id/edit"
                element={
                  <AdminProtectedRoute>
                    <AccountCreate />
                  </AdminProtectedRoute>
                }
              />
              {/* Statement */}
              <Route
                path="/statements"
                element={
                  <AccountProtectedRoute>
                    <Statements />
                  </AccountProtectedRoute>
                }
              />
              <Route
                path="/statements/create"
                element={
                  <AccountProtectedRoute>
                    <StatementCreate />
                  </AccountProtectedRoute>
                }
              />
              <Route
                path="/statements/:id/edit"
                element={
                  <AccountProtectedRoute>
                    <StatementCreate />
                  </AccountProtectedRoute>
                }
              />
              {/* Particulars */}
              <Route
                path="/particulars"
                element={
                  <AdminProtectedRoute>
                    <Particulars />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/particulars/create"
                element={
                  <AdminProtectedRoute>
                    <ParticularsCreate />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/particulars/:id/edit"
                element={
                  <AdminProtectedRoute>
                    <ParticularsCreate />
                  </AdminProtectedRoute>
                }
              />
              {/* Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <UserProtectedRoute>
                    <Dashboard />
                  </UserProtectedRoute>
                }
              />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

function PublicRoute({ children }) {
  let isAuthenticated = getAuth();
  if(isAuthenticated) {
    if(getRole() === 'admin')
      return <Navigate to='/accounts' />;
    else if(getRole() === 'account')
      return <Navigate to='/statements' />;
    else if(getRole() === 'user')
      return <Navigate to='/dashboard' />;
  } else {
    return children;
  }
}

function AdminProtectedRoute({ children }) {
  let isAuthenticated = getAuth();
  return isAuthenticated ? getRole() === "admin" ? children : <Navigate to='/statements' /> : <Navigate to='/login' />;
}

function AccountProtectedRoute({ children }) {
  let isAuthenticated = getAuth();
  return isAuthenticated ? getRole() === "account" ? children : <Navigate to='/accounts' /> : <Navigate to='/login' />;
}

function UserProtectedRoute({ children }) {
  let isAuthenticated = getAuth();
  return isAuthenticated ? getRole() === "user" ? children : <Navigate to='/dashboard' /> : <Navigate to='/login' />;
}

function getAuth() {
  let token = localStorage.getItem("authToken");
  return token;
}

function getRole() {
  let role = localStorage.getItem("role");
  return role;
}

export default App;
