import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import Layout from "../Layout/Admin/Layout.Component";
import Loader from "../Loader/Loader.component";

import Swal from "sweetalert2";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {Search, CSVExport} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Index() {
  const navigate = useNavigate();
  const [TITLE, setTitle] = useState("");
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);
  const [cr_amount, setCreditAmount] = useState("0");
  const [de_amount, setDebitAmount] = useState("0");

  let credit_amount = 0;
  let debit_amount = 0;
  const [list, setList] = useState([]);
  const columns = [
    {
      dataField: "sl.no",
      text: "#",
      csvExport: false,
      footer: "",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return rowIndex + 1;
      },
    },
    {
      dataField: "date",
      text: "Date",
      footer: "",
    },
    {
      dataField: "particulars",
      text: "Particulars",
      footer: "",
    },
    {
      text: "Credit",
      footer: cr_amount,
      formatter: (rowContent, row) => {
        add(row.entry, row.amount);
        return row.entry === "Credit" ? row.amount : "";
      },
      csvFormatter: (rowContent, row) => {
        add(row.entry, row.amount);
        return row.entry === "Credit" ? row.amount : "";
      },
    },
    {
      text: "Debit",
      footer: de_amount,
      formatter: (rowContent, row) => {
        return row.entry === "Debit" ? row.amount : "";
      },
      csvFormatter: (rowContent, row) => {
        return row.entry === "Debit" ? row.amount : "";
      },
    },
    {
      text: "Running",
      footer: "",
      csvExport: false,
      formatter: (rowContent, row) => {
        return credit_amount - debit_amount;
      },
      // csvFormatter: (rowContent, row) => {
      //   return credit_amount - debit_amount;
      // },
    },
    {
      dataField: "link",
      text: "ACTION",
      headerAlign: "center",
      csvExport: false,
      footer: "",
      formatter: (rowContent, row) => {
        return (
          <Dropdown className="buttons-dropdown">
            <Dropdown.Toggle
              variant="default"
              id="dropdown-basic"
              className="pt-0"
            >
              Action
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-action">
              <Dropdown.Item>
                <Link to={`/statements/${row.id}/edit`}>
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
                  onClick={() => destroy(row.id, row.entry, row.amount)}
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
  const { SearchBar, ClearSearchButton } = Search;
  const { ExportCSVButton } = CSVExport;

  useEffect(() => {
    index();
  }, []);

  const index = async () => {
    setLoading(true);
    await axios
      .get(`${process.env.REACT_APP_API_BASE_URL}statements`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        setList(data);
        console.log(data);
        setTitle("Statement List");
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

  const destroy = async (id, entry, amount) => {
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
      .delete(`${process.env.REACT_APP_API_BASE_URL}statements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        Swal.fire({
          text: data.message,
          icon: "success",
        });
        setList((list) => list.filter((item, i) => item.id !== id));
        if (entry === "Credit") {
          credit_amount -= amount;
          setCreditAmount(credit_amount.toString());
        } else {
          debit_amount -= amount;
          setDebitAmount(debit_amount.toString());
        }
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

  const add = async (entry, amount) => {
    if (entry === "Credit") {
      credit_amount += amount;
      setCreditAmount(credit_amount.toString());
    } else {
      debit_amount += amount;
      setDebitAmount(debit_amount.toString());
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Layout TITLE={TITLE}>
          <Row className="justify-content-center text-nowrap">
            <Col md={10} lg={8} xl={7}>
              <Card>
                <Card.Header>
                  <Row>
                    <Col>Statement List</Col>
                    <Col className="d-flex justify-content-end">
                      <Link to={`/Statements/create`}>
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          className="btn btn-block button"
                        >
                          Create
                        </Button>
                      </Link>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  {list.length ? (
                    <ToolkitProvider
                      keyField="Id"
                      data={list}
                      columns={columns}
                      search
                      bootstrap4
                      exportCSV={{
                        ignoreFooter: false,
                      }}
                    >
                      {(props) => (
                        <Row>
                          <Col>
                            <Row>
                              <Col>
                                <Card.Title>List of Statements</Card.Title>
                              </Col>
                              <Col>
                                <ExportCSVButton
                                  {...props.csvProps}
                                  className="btn-outline-secondary d-block d-sm-none csv-button"
                                >
                                  Export CSV
                                </ExportCSVButton>
                              </Col>
                            </Row>
                            <Row className="mt-1">
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
                                  className="btn-outline-secondary d-none d-sm-block csv-button"
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
                                  wrapperClasses="table-responsive"
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
    </>
  );
}
