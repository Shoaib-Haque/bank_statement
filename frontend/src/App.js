import './App.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
              <Route path="/login" element={<Login />} />
              {/* Account */}
              <Route path="/register" element={<RequireAuth><Register /></RequireAuth>}/>
              {/* Statement */}
              <Route path="/statements" element={<RequireAuth><Statements /></RequireAuth>} />
              {/* Particulars */}
              <Route path="/particulars" element={<RequireAuth><Particulars /></RequireAuth>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

function RequireAuth({ children, redirectTo }) {
  let isAuthenticated = getAuth();
  return isAuthenticated ? children : <Navigate to='/login' />;
}

function getAuth() {
  let token = localStorage.getItem("authToken");
  return token;
}
export default App;
