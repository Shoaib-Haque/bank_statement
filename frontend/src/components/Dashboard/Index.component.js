import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import Layout from "../Layout/User/Layout.Component";
import Loader from "../Loader/Loader.component";

import Swal from "sweetalert2";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {Search, CSVExport} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Index() {
  const navigate = useNavigate();
  const [TITLE, setTitle] = useState("");
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);

  const [receiver_id, setReceiverId] = useState("");
  const [receiver_name, setReceiverName] = useState("");
  const [message, setMessage] = useState("");
  const [chat_box_show, setChatBoxShow] = useState(false);
  const [validationError, setValidationError] = useState({});

  const [list, setList] = useState([]);
  const columns = [
    {
      dataField: "user_name",
    },
  ];
  const { SearchBar, ClearSearchButton } = Search;
  const { ExportCSVButton } = CSVExport;

  useEffect(() => {
    index();
  }, []);

  const index = async () => {
    setLoading(true);
    await axios
      .get(`${process.env.REACT_APP_API_BASE_URL}users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        setList(data);
        setTitle("User List");
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
    setLoading(false);
  };

  const send = async (e) => {
    e.preventDefault();
    console.log("ola");
    const formData = new FormData();
    formData.append("receiver_id", receiver_id);
    formData.append("message", message);
    const token = localStorage.getItem("authToken");
    var api =  `${process.env.REACT_APP_API_BASE_URL}messages`;

    await axios
      .post(api, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        
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

  const rowEvents = {
  onClick: (e, row, rowIndex) => {
      setReceiverId(row.id);
      setReceiverName(row.user_name);
      setMessage("");
      setChatBoxShow(true);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Layout TITLE={TITLE}>
          <Row>
            <Col md={4} lg={6} xl={5}>
              <Row className="justify-content-center text-nowrap h-50">
                <Col>
                  <Card>
                    <Card.Header>Users</Card.Header>
                    <Card.Body>
                      {list.length ? (
                        <ToolkitProvider
                          keyField="Id"
                          data={list}
                          columns={columns}
                          search
                          bootstrap4
                        >
                          {(props) => (
                            <Row>
                              <Col>
                                <Row className="mt-1">
                                  <Col>
                                    <SearchBar
                                      {...props.searchProps}
                                      srText=""
                                      placeholder="Search..."
                                      className="search-bar"
                                    />
                                  </Col>
                                </Row>
                                <Row className="mt-2 scroll-div">
                                  <Col>
                                    <BootstrapTable
                                      bootstrap4
                                      width="100vw;"
                                      hover
                                      condensed
                                      wrapperClasses="table-responsive"
                                      rowEvents={rowEvents}
                                      {...props.baseProps}
                                    ></BootstrapTable>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          )}
                        </ToolkitProvider>
                      ) : (
                        <Row>
                          <Col>Nothing to Show</Col>
                        </Row>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
            {chat_box_show ? (
              <Col md={8} lg={6} xl={5}>
                <Row className="justify-content-center text-nowrap">
                  <Col>
                    <Card>
                      <Card.Header>{receiver_name}</Card.Header>
                      <Card.Body></Card.Body>
                      <Card.Footer>
                        <Form onSubmit={send}>
                          <Form.Group className="mb-3" controlId="text">
                            <Form.Control
                              as="textarea"
                              required
                              type="text"
                              placeholder=""
                              onChange={(event) => {
                                setMessage(event.target.value);
                              }}
                            />
                          </Form.Group>
                          <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            className="btn btn-block button"
                          >
                            Send
                          </Button>
                        </Form>
                      </Card.Footer>
                    </Card>
                  </Col>
                </Row>
              </Col>
            ) : null}
          </Row>
        </Layout>
      )}
    </>
  );
}
