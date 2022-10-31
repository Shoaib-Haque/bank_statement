import './App.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Auth/Login.component";
import Register from "./components/Account/Register.component";
import Statements from "./components/Statement/Index.component";
import Particulars from "./components/Particulars/Index.component";

function App() {
  return (
    <Router>
      <Container className="mt-5">
        <Row>
          <Col md={12}>
            <Routes>
              <Route path="/" element={<Navigate replace to="/login" />} />
              {/* Auth */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              {/* Account */}
              <Route path="/register" element={<AdminProtectedRoute><Register /></AdminProtectedRoute>}/>
              {/* Statement */}
              <Route path="/statements" element={<AccountProtectedRoute><Statements /></AccountProtectedRoute>} />
              {/* Particulars */}
              <Route path="/particulars" element={<AdminProtectedRoute><Particulars /></AdminProtectedRoute>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

function PublicRoute({ children }) {
  let isAuthenticated = getAuth();
  return isAuthenticated ? getRole() === "admin" ? <Navigate to='/register' /> : <Navigate to='/statements' /> : children;
}

function AdminProtectedRoute({ children }) {
  let isAuthenticated = getAuth();
  return isAuthenticated ? getRole() === "admin" ? children : <Navigate to='/statements' /> : <Navigate to='/login' />;
}

function AccountProtectedRoute({ children }) {
  let isAuthenticated = getAuth();
  return isAuthenticated ? getRole() === "account" ? children : <Navigate to='/register' /> : <Navigate to='/login' />;
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
