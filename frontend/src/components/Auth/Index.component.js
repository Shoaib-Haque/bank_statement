import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./Index.css";

export default function Login() {
  const navigate = useNavigate();
  const [bank_id, setBankId] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setAuthError("");
    const formData = new FormData();
    formData.append("bank_id", bank_id);
    formData.append("password", password);
    await axios
      .post(`${process.env.REACT_APP_API_BASE_URL}account/login`, formData)
      .then(({ data }) => {
        if (data.access_token !== "undefined" && data.access_token !== "") {
          localStorage.setItem("authToken", data.access_token);
          localStorage.setItem("role", "account");
          navigate("/statements");
        }
      })
      .catch(({ response }) => {
        adminLogin();
      });
  };

  const adminLogin = async () => {
    setAuthError("");
    const formData = new FormData();
    formData.append("username", bank_id);
    formData.append("password", password);
    await axios
      .post(`${process.env.REACT_APP_API_BASE_URL}admin/login`, formData)
      .then(({ data }) => {
        if (data.access_token !== "undefined" && data.access_token !== "") {
          localStorage.setItem("authToken", data.access_token);
          localStorage.setItem("role", "admin");
          navigate("/accounts");
        }
      })
      .catch(({ response }) => {
        userLogin();
      });
  };

  const userLogin = async () => {
    setAuthError("");
    const formData = new FormData();
    formData.append("email", bank_id);
    formData.append("password", password);
    await axios
      .post(`${process.env.REACT_APP_API_BASE_URL}user/login`, formData)
      .then(({ data }) => {
        if (data.access_token !== "undefined" && data.access_token !== "") {
          localStorage.setItem("authToken", data.access_token);
          localStorage.setItem("role", "user");
          localStorage.setItem("user_id", data.user_id);
          navigate("/dashboard");
        }
      })
      .catch(({ response }) => {
        console.log(response);
        if (response.status === 401) {
          setAuthError(response.data.error);
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error",
          });
        }
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={11} sm={10} md={8} lg={6} xl={5} xxl={4} className="fs-6">
          <Card>
            <Card.Header>Login</Card.Header>
            <Card.Body>
              <Card.Title className="login-card-title">
                Please Login with Your Id and Password
              </Card.Title>
              <Form onSubmit={login}>
                <Row>
                  <Col>
                    <Form.Group controlId="bank_id">
                      <Form.Label>Bank Id</Form.Label>
                      <Form.Control
                        type="text"
                        value={bank_id}
                        onChange={(event) => {
                          setBankId(event.target.value);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="Password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {typeof authError !== "undefined" && authError !== "" ? (
                  <Row>
                    <Col>
                      <Form.Group
                        controlId="authError"
                        className="alert alert-danger text-black p-1 mt-1"
                      >
                        <Form.Label>{authError}</Form.Label>
                      </Form.Group>
                    </Col>
                  </Row>
                ) : null}
                <Button
                  variant="primary"
                  className="mt-2"
                  size="lg"
                  block="block"
                  type="submit"
                >
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
