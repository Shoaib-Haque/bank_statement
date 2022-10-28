import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [bank_id, setBankId] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [validationError, setValidationError] = useState({});

  const login = async (e) => {
    e.preventDefault();
    setAuthError("");
    setValidationError({});
    const formData = new FormData();
    formData.append("bank_id", bank_id);
    formData.append("password", password);
    await axios
      .post(`http://127.0.0.1:8000/api/auth/login`, formData)
      .then(({ data }) => {
        if (data.access_token !== "undefined" && data.access_token !== "") {
          localStorage.setItem("authToken", data.access_token);
          //navigate("/statements");
        }
      })
      .catch(({ response }) => {
        console.log(response);
        if (response.status === 422) {
          setValidationError(response.data);
        } else if (response.status === 401) {
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
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-id">Login</h4>
              <hr />
              <div className="form-wrapper">
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
                      {(typeof validationError.bank_id !== 'undefined' && validationError.bank_id !== "") ?
                        <div className="row mt-1">
                          <div className="col-12">
                            <div className="alert alert-danger">
                              <span>{validationError.bank_id}</span>
                            </div>
                          </div>
                        </div> : ''}
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
                      {(typeof validationError.password !== 'undefined' && validationError.password !== "") ?
                        <div className="row mt-1">
                          <div className="col-12">
                            <div className="alert alert-danger">
                              <span>{validationError.password}</span>
                            </div>
                          </div>
                        </div> : ''}
                    </Col>
                  </Row>
                  {(typeof authError !== 'undefined' && authError !== "") ?
                    <div className="row mt-1">
                      <div className="col-12">
                        <div className="alert alert-danger">
                          <span>{authError}</span>
                        </div>
                      </div>
                    </div> : ''}
                  <Row>
                    <Col>
                      <Button
                        variant="primary"
                        className="mt-2"
                        size="lg"
                        block="block"
                        type="submit"
                      >
                        Login
                      </Button>
                    </Col>
                    <Col>
                      <Link
                        style={{ textDecoration: 'none' }}
                        to="/register"
                      >
                        Register
                      </Link>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
