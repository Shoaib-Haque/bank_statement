import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet';
import Layout from "../Layout/Admin/Layout.Component";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import NotFound from "../Error/Error_404.Component";

export default function Create() {
  const navigate = useNavigate();
  const [TITLE, setTitle] = useState("");
  const token = localStorage.getItem("authToken");
  const { id } = useParams();
  const [bank_id, setBankId] = useState("");
  const [bank_name, setBankName] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false);
  const [button_text, setButtonText] = useState("Create");
  const [card_header, setCardHeader] = useState("Create an Account");
  const [card_title, setCardTitle] = useState("Fill the Form");
  const [notFound, setNotFound] = useState("");

  useEffect(() => {
    if (typeof id !== "undefined") {
      setLoading(true);
      show();
      setButtonText("Save");
      setCardHeader("Update Account Information");
      setCardTitle("Account Information");
    }
  }, []);

  const show = async () => {
    await axios
    .get(`${process.env.REACT_APP_API_BASE_URL}accounts/${id}`, { headers: { Authorization: `Bearer ${token}` }})
    .then(({data})=>{
      const { bank_id, bank_name } = data.account
      setBankId(bank_id);
      setBankName(bank_name);
      setTitle(bank_id + ' | ' + bank_name);
    }).catch(({response})=>{
      if (response.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else if (response.status === 404) {
        setNotFound(response.data.message);
        setTitle(response.data.message);
      } else {
        setNotFound(response.data.message);
      }
    })
    setLoading(false);
  };

  const create = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bank_id", bank_id);
    formData.append("bank_name", bank_name);
    const token = localStorage.getItem("authToken");
    var api = ``;
    if (id) {
      api = `${process.env.REACT_APP_API_BASE_URL}accounts/${id}/edit`;
    } else {
      api = `${process.env.REACT_APP_API_BASE_URL}accounts`;
      formData.append("password", password);
    }

    await axios
      .post(api, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        }).then(function() {
          navigate("/accounts");
        });
      })
      .catch(({ response }) => {
        console.log(response.data);
        if (response.status === 422) {
          setValidationError(response.data.errors);
        } else if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error",
          });
        }
      });
  };

  return (
    <Container>
      {loading ? (
        <Helmet>
          <title>{ TITLE }</title>
        </Helmet>
      ) : (
        <Layout TITLE={TITLE}>
          <Container>
            <Row className="justify-content-md-center">
                {bank_id ? (
                  <Col md={6}>
                    <Card>
                      <Card.Header>{card_header}</Card.Header>
                      <Card.Body>
                        <Card.Title>{card_title}</Card.Title>
                        <Form onSubmit={create}>
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
                          {typeof id === "undefined" ? (
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
                          ) : (
                            ""
                          )}
                          <Row>
                            <Col sm={10}>
                              <Button
                                variant="primary"
                                className="mt-2"
                                size="lg"
                                block="block"
                                type="submit"
                              >
                                {button_text}
                              </Button>
                            </Col>
                          </Row>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                ) : (
                  <NotFound notFound={notFound} />
                )}
            </Row>
          </Container>
        </Layout>
      )}
    </Container>
  );
}
