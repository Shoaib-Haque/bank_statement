import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "../Layout/Admin/Layout.Component";
import NotFound from "../Error/Error_404.Component";

import Swal from "sweetalert2";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

export default function Create() {
  const navigate = useNavigate();
  const [TITLE, setTitle] = useState("Create Account");
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const [particulars, setParticulars] = useState("");
  const [validationError, setValidationError] = useState({});
  const [notFound, setNotFound] = useState("");

  const [button_text, setButtonText] = useState("Create");
  const [card_header, setCardHeader] = useState("Create Particulars");
  const [card_title, setCardTitle] = useState("Fill the Form");

  useEffect(() => {
    if (typeof id !== "undefined") {
      setLoading(true);
      show();
      setButtonText("Save");
      setCardHeader("Update Particulars");
      setCardTitle("Particulars");
    }
  }, []);

  const show = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_BASE_URL}particulars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const { particulars } = data.particulars;
        setParticulars(particulars);
        setTitle(particulars);
      })
      .catch(({ response }) => {
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else if (response.status === 404) {
          setNotFound(response.data.message);
          setTitle(response.data.message);
        } else {
          setNotFound(response.data.message);
        }
      });
    setLoading(false);
  };

  const create = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("particulars", particulars);
    const token = localStorage.getItem("authToken");
    var api = `${process.env.REACT_APP_API_BASE_URL}particulars`;
    if (id) {
      api = `${process.env.REACT_APP_API_BASE_URL}particulars/${id}/edit`;
    }

    await axios
      .post(api, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        }).then(function () {
          navigate("/particulars");
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
    <>
      {loading ? (
        <></>
      ) : (
        <Layout TITLE={TITLE}>
          {particulars || notFound === "" ? (
            <Row className="justify-content-center">
              <Col xs={10} sm={8} md={6} lg={5} xl={4}>
                <Card>
                  <Card.Header>
                    <Row>
                      <Col>{card_header}</Col>
                      <Col className="d-flex justify-content-end">
                        <Link to={`/particulars`}>
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            className="btn btn-block button"
                          >
                            Go Back
                          </Button>
                        </Link>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>{card_title}</Card.Title>
                    <Form onSubmit={create}>
                      <Row>
                        <Col>
                          <Form.Group controlId="particulars">
                            <Form.Label>Particulars</Form.Label>
                            <Form.Control
                              type="text"
                              value={particulars}
                              onChange={(event) => {
                                setParticulars(event.target.value);
                              }}
                            />
                          </Form.Group>
                          {typeof validationError.particulars !== "undefined" &&
                          validationError.particulars !== "" ? (
                            <Row>
                              <Col>
                                <Alert variant="danger p-2">
                                  {validationError.particulars}
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
                            {button_text}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <NotFound notFound={notFound} />
          )}
        </Layout>
      )}
    </>
  );
}
