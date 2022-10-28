import React, { useEffect, useState } from "react";
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
  const [bank_name, setBankName] = useState("");
  const [authError, setAuthError] = useState("");
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    getStatement();
  }, []);

  const getStatement = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/auth/account-profile", {headers: { Authorization: `Bearer ${token}`}})
      .then((response) => response.json())
      .then((data) => {
        setBankId(data.bank_id);
        setBankName(data.bank_name);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <>
      {loading ? (
        <div>...Data Loading.....</div>
      ) : (
        <div>
          <span>{bank_id}</span><br/>
          <span>{bank_name}</span>
        </div>
      )}
    </>
  );
}
