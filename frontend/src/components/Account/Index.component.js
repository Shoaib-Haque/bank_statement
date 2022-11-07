import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../Layout/Admin/Layout.Component";

export default function Index() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const token = localStorage.getItem("authToken");

  const index = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_BASE_URL}accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        setList(data);
      })
      .catch(({ response }) => {
        console.log(response.data);
        if (response.status === 422) {
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error",
          });
        }
      });
  };

  useEffect(() => {
    index();
  }, []);

  return (
    <Layout>
      <Container>
        <Row className="justify-content-md-center">
          <Col md={8}>
            <Card>
              <Card.Header>Account List</Card.Header>
              <Card.Body>
                <Card.Title>List of Accounts</Card.Title>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Bank Id</th>
                        <th>Bank Name</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        list.map((item, key) => {
                          return (
                            <tr key={key}>
                              <td>{key + 1}</td>
                              <td>{item.bank_id}</td>
                              <td>{item.bank_name}</td>
                              <td>
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="default"
                                    id="dropdown-basic"
                                  >
                                    Action
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item>
                                      <Link to={`/accounts/${item.id}/edit`}>
                                        <Button
                                          type="button"
                                          variant="success"
                                          size="sm"
                                          className="btn  btn-block"
                                        >
                                          Edit
                                        </Button>
                                      </Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                      <Button
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        className="btn  btn-block"
                                      >
                                        Delete
                                      </Button>
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
