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
  const [TITLE, setTitle] = useState("Save Statement");
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const [particulars_id, setParticularsId] = useState("");
  const [particulars_list, setParticularsList] = useState([]);
  const [amount, setAmount] = useState("");
  const [entry, setEntry] = useState("");
  const [date, setDate] = useState("");
  const [validationError, setValidationError] = useState({});
  const [notFound, setNotFound] = useState("");

  const [button_text, setButtonText] = useState("Save");
  const [card_header, setCardHeader] = useState("Save Statement");
  const [card_title, setCardTitle] = useState("Fill the Form");

  useEffect(() => {
    getParticularsList();
    if (typeof id !== "undefined") {
      setLoading(true);
      show();
      setButtonText("Save");
      setCardHeader("Update Statement Information");
      setCardTitle("Statement Information");
    }
  }, []);

  const getParticularsList = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_BASE_URL}particulars/list`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        setParticularsList(data);
        console.log(data);
      })
      .catch(({ response }) => {
        console.log(response.data);
        if (response.status === 401) {
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

  const show = async () => {
    await axios
    .get(`${process.env.REACT_APP_API_BASE_URL}statements/${id}`, { headers: { Authorization: `Bearer ${token}` }})
    .then(({data})=>{
      const { particulars_id, amount, entry, date } = data.statement;
      setParticularsId(particulars_id);
      setAmount(amount);
      setEntry(entry);
      setDate(date);
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
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("particulars_id", particulars_id);
    formData.append("amount", amount);
    formData.append("entry", entry);
    formData.append("date", date);
    var api = `${process.env.REACT_APP_API_BASE_URL}statements`;
    if (id) {
      api = `${process.env.REACT_APP_API_BASE_URL}statements/${id}/edit`;
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
          navigate("/statements");
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
          {notFound === "" ? (
            <Row className="justify-content-center">
              <Col xs={10} sm={8} md={6} lg={5} xl={4}>
                <Card>
                  <Card.Header>
                    <Row>
                      <Col>{card_header}</Col>
                      <Col className="d-flex justify-content-end">
                        <Link to={`/statements`}>
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
                          <Form.Group controlId="amount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                              type="text"
                              value={amount}
                              onChange={(event) => {
                                setAmount(event.target.value);
                              }}
                            />
                          </Form.Group>
                          {typeof validationError.amount !== "undefined" &&
                          validationError.amount !== "" ? (
                            <Row>
                              <Col>
                                <Alert variant="danger p-2">
                                  {validationError.amount}
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
                          <Form.Group controlId="particulars_id">
                            <Form.Label>Particulars</Form.Label>
                            <Form.Select
                              value={particulars_id}
                              onChange={(event) => {
                                setParticularsId(event.currentTarget.value);
                              }}
                            >
                              <option value=""></option>
                              {particulars_list &&
                                particulars_list.length > 0 &&
                                particulars_list.map((particular) => (
                                  <option
                                    key={particular.id}
                                    value={particular.id}
                                  >
                                    {particular.particulars}
                                  </option>
                                ))}
                            </Form.Select>
                          </Form.Group>
                          {typeof validationError.particulars_id !==
                            "undefined" &&
                          validationError.particulars_id !== "" ? (
                            <Row>
                              <Col>
                                <Alert variant="danger p-2">
                                  {validationError.particulars_id}
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
                          <Form.Group controlId="entry">
                            <Form.Label>Entry</Form.Label>
                            <Form.Check
                              type="radio"
                              id="default-type"
                              aria-label="radio 1"
                              label="Credit"
                              value="Credit"
                              checked={entry === "Credit"}
                              onChange={(event) => {
                                event.persist();
                                setEntry(event.target.value);
                              }}
                            />
                            <Form.Check
                              type="radio"
                              id="default-type"
                              aria-label="radio 2"
                              label="Debit"
                              value="Debit"
                              checked={entry === "Debit"}
                              onChange={(event) => {
                                event.persist();
                                setEntry(event.target.value);
                              }}
                            />
                          </Form.Group>
                          {typeof validationError.entry !== "undefined" &&
                          validationError.entry !== "" ? (
                            <Row>
                              <Col>
                                <Alert variant="danger p-2">
                                  {validationError.entry}
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
                          <Form.Group controlId="entry">
                            <Form.Label>Entry</Form.Label>
                            <Form.Control
                              type="date"
                              placeholder="DateRange"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
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
