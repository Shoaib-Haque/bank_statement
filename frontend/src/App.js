import logo from './logo.svg';
import './App.css';
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./components/login.component";
import Register from "./components/register.component";

function App() {
  return (
    <Router>
      <Navbar bg="primary">
        <Container>
          <Link to={"/login"} className="navbar-brand text-white">
            Login
          </Link>
          <Link to={"/register"} className="navbar-brand text-white">
            Register
          </Link>
        </Container>
      </Navbar>
      <Container className="mt-5">
        <Row>
          <Col md={12}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}
export default App;
