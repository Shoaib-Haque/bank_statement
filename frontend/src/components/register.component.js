import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

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
    await axios
      .post(`http://127.0.0.1:8000/api/auth/register`, formData)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        });
        navigate("/login");
      })
      .catch(({ response }) => {
        if (response.status === 400) {
          setValidationError(response.data.errors);
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
              <h4 className="card-bank_id">Register</h4>
              <hr />
              <div className="form-wrapper">
                {Object.keys(validationError).length > 0 && (
                  <div className="row">
                    <div className="col-12">
                      <div className="alert alert-danger">
                        <ul className="mb-0">
                          {Object.entries(validationError).map(
                            ([key, value]) => (
                              <li key={key}>{value}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                <Form onSubmit={register}>
                  <Row>
                    <Col>
                      <Form.Group controlId="bank_id">
                        <Form.Label>bank_id</Form.Label>
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
                  <Row>
                    <Col sm={10}>
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
                        to="/login"
                      >
                        Login
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
