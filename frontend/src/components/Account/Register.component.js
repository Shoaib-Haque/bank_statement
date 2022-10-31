import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../Layout/Admin/Layout.Component";

export default function Register() {
  const navigate = useNavigate();
  const [bank_id, setBankId] = useState("");
  const [bank_name, setBankName] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState({});

  const register = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bank_id", bank_id);
    formData.append("bank_name", bank_name);
    formData.append("password", password);
    const token = localStorage.getItem("authToken");

    await axios
      .post(`http://127.0.0.1:8000/api/account/register`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        });
        navigate("/login");
      })
      .catch(({ response }) => {
        console.log(response.data);
        if (response.status === 422) {
          setValidationError(response.data.errors);
          console.log(validationError);
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error",
          });
        }
      });
  };

  return (
    <Layout>
      <Container>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <Card>
              <Card.Header>Register Account</Card.Header>
              <Card.Body>
                <Card.Title>Fill the From</Card.Title>
                <Card.Text>
                  <Form onSubmit={register}>
                    <Row>
                      <Col>
                        <Form.Group controlId="bank_id">
                          <Form.Label>bank Id</Form.Label>
                          <Form.Control
                            type="text"
                            value={bank_id}
                            onChange={(event) => {
                              setBankId(event.target.value);
                            }}
                          />
                        </Form.Group>
                        {typeof validationError.bank_id !== "undefined" &&
                        validationError.bank_id !== "" ? (
                          <Row>
                            <Col>
                              <Alert variant="danger p-2">
                                {validationError.bank_id}
                              </Alert>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group controlId="bank_name">
                          <Form.Label>Bank Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={bank_name}
                            onChange={(event) => {
                              setBankName(event.target.value);
                            }}
                          />
                        </Form.Group>
                        {typeof validationError.bank_name !== "undefined" &&
                        validationError.bank_name !== "" ? (
                          <Row>
                            <Col>
                              <Alert variant="danger p-2">
                                {validationError.bank_name}
                              </Alert>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
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
                        {typeof validationError.password !== "undefined" &&
                        validationError.password !== "" ? (
                          <Row>
                            <Col>
                              <Alert variant="danger p-2">
                                {validationError.password}
                              </Alert>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={10}>
                        <Button
                          variant="primary"
                          className="mt-2"
                          size="lg"
                          block="block"
                          type="submit"
                        >
                          Register
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
