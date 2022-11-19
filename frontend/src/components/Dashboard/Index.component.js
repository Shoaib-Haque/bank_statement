import React, { useEffect, useState, useCallback  } from "react";
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
import CloseButton from 'react-bootstrap/CloseButton';
import ListGroup from 'react-bootstrap/ListGroup';

export default function Index() {
  const navigate = useNavigate();
  const [TITLE, setTitle] = useState("");
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);
  const [chatBoxes, setChatBoxes] = useState([]);

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

  const getChatMessages = function(receiver_id, callback) {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}messages/${receiver_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response =>{
        callback(response.data);
      })
      .catch(({ response }) => {
        console.log(response.data);
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          console.log(response);
          Swal.fire({
            text: response.data.message,
            icon: "error",
          });
        }
      });
  };

  const send = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("receiver_id", e.target.receiver_id.value);
    formData.append("message", e.target.message.value);
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

  const rowEvents = {
  onClick: (e, row, rowIndex) => {
    let flag = false;
    chatBoxes &&
    chatBoxes.length > 0 &&
    chatBoxes.map((chatBox, index) => {
      if(chatBox.receiver_id === row.id){
        flag = true;
      }
    })
    if(!flag) {
      getChatMessages(row.id, function(response) {
        let obj = {'receiver_id' : row.id, 'receiver_name' : row.user_name, 'messages' : response};
        console.log(obj);
        const newChatBoxes = [...chatBoxes, obj];
        setChatBoxes(newChatBoxes);
      });
    }
    }
  };

  const closeChatBox = (index) => {
    const list = chatBoxes.slice();
    list.splice(index, 1);
    setChatBoxes(list);
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Layout TITLE={TITLE}>
          <Row>
            <Col md={4} lg={6} xl={3}>
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
            <Col md={8} lg={6} xl={9}>
              <Row className="justify-content-left text-nowrap">
              {chatBoxes &&
                chatBoxes.length > 0 &&
                chatBoxes.map((chatBox, index) => (
                  <Col sm={4}>
                    <Card>
                      <Card.Header>
                        <Row>
                          <Col>{chatBox.receiver_name}</Col>
                          <Col className="justify-content-right">
                            <CloseButton 
                            onClick={(event) => {
                              //event.persist();
                              closeChatBox(index);
                            }}
                            />
                          </Col>
                        </Row>
                      </Card.Header>
                      <Card.Body>
                      {chatBox.messages &&
                        chatBox.messages.length > 0 &&
                        chatBox.messages.map((message, messageIndex) => (
                          <ListGroup>
                            <ListGroup.Item>{message.message}</ListGroup.Item>
                          </ListGroup>
                      ))}
                      </Card.Body>
                      <Card.Footer>
                        <Form onSubmit={send}>
                        <Form.Group className="mb-3" controlId="receiver_id">
                            <Form.Control
                              type="hidden"
                              value={chatBox.receiver_id}
                              name="receiver_id"
                            />
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="message">
                            <Form.Control
                              as="textarea"
                              required
                              type="text"
                              placeholder=""
                              name="message"
                              onChange={(event) => {
                                
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
              ))}
              </Row>
            </Col>
          </Row>
        </Layout>
      )}
    </>
  );
}
