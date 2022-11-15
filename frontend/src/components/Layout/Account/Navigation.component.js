import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const logout = async () => {
    const formData = new FormData();
    formData.append("token", token);
    await axios
      .post(`${process.env.REACT_APP_API_BASE_URL}account/logout`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("role");
          navigate("/login");
        } else {
          console.log(response);
        }
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container fluid className="p-0">
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Button
              variant=""
              className=""
              size="sm"
              block="block"
              type="button"
              onClick={logout}
            >
              Logout
            </Button>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
