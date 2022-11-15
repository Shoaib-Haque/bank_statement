import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../Layout/Admin/Layout.Component";
import Css from "./Index.css";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {Search, CSVExport} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Loader from "../Loader/Loader.component";

export default function Index() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const { SearchBar, ClearSearchButton } = Search;
  const { ExportCSVButton } = CSVExport;
  const columns = [
    {
      dataField: "sl.no",
      text: "#",
      csvExport: false,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return rowIndex + 1;
      },
    },
    {
      dataField: "bank_id",
      text: "Bank ID",
      sort: true,
    },
    {
      dataField: "bank_name",
      text: "Bank Name",
      sort: true,
    },
    {
      dataField: "link",
      text: "ACTION",
      csvExport: false,
      formatter: (rowContent, row) => {
        return (
          <Dropdown className="buttons_dropdown">
            <Dropdown.Toggle
              variant="default"
              id="dropdown-basic"
              className="pt-0"
            >
              Action
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-action">
              <Dropdown.Item>
                <Link to={`/accounts/${row.id}/edit`}>
                  <Button
                    type="button"
                    variant="success"
                    size="sm"
                    className="btn btn-block button"
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
                  className="btn btn-block button"
                  onClick={() => destroy(row.id)}
                >
                  Delete
                </Button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      },
    },
  ];

  const index = async () => {
    setLoading(true);
    await axios
      .get(`${process.env.REACT_APP_API_BASE_URL}accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        setList(data);
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

  useEffect(() => {
    index();
  }, []);

  const destroy = async (id) => {
    const isConfirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      return result.isConfirmed;
    });

    if (!isConfirm) {
      return;
    }

    await axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}accounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        Swal.fire({
          text: data.message,
          icon: "success",
        });
        setList((list) => list.filter((item, i) => item.id !== id));
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

  return (
    <Container fluid className="p-0">
      {loading ? (
        <Loader />
      ) : (
        <Layout>
          <Row className="justify-content-md-center">
            <Col md={8}>
              <Card>
                <Card.Header>Account List</Card.Header>
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
                            <Row>
                              <Col>
                                <Card.Title>List of Accounts</Card.Title>
                              </Col>
                              <Col>
                                <ExportCSVButton
                                  {...props.csvProps}
                                  className="btn-outline-secondary csv-button d-block d-md-none"
                                >
                                  Export CSV
                                </ExportCSVButton>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <SearchBar
                                  {...props.searchProps}
                                  srText=""
                                  placeholder="Search..."
                                  className="search-bar"
                                />
                                <ClearSearchButton
                                  {...props.searchProps}
                                  className="btn-outline-secondary"
                                />
                                <ExportCSVButton
                                  {...props.csvProps}
                                  className="btn-outline-secondary csv-button d-none d-md-block"
                                >
                                  Export CSV
                                </ExportCSVButton>
                              </Col>
                            </Row>
                            <Row className="mt-2 scroll-div">
                              <Col>
                                <BootstrapTable
                                  bootstrap4
                                  width="100vw;"
                                  striped
                                  hover
                                  condensed
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
        </Layout>
      )}
    </Container>
  );
}
