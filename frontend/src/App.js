import './App.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Statement from "./components/statement.component";

function App() {
  return (
    <Router>
      <Container className="mt-5">
        <Row>
          <Col md={12}>
            <Routes>
              <Route path="/" element={<Navigate replace to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/statements" element={<Statement />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}
export default App;
