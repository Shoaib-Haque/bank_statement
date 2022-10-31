import React, { useEffect, useState } from "react";
import Layout from "../Layout/Account/Layout.Component";

export default function Login() {
  const [bank_id, setBankId] = useState("");
  const [bank_name, setBankName] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    getStatement();
  }, []);

  const getStatement = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/account/account-profile", {headers: { Authorization: `Bearer ${token}`}})
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
    <Layout>
      {loading ? (
        <div>...Data Loading.....</div>
      ) : (
        <div>
          <span>{bank_id}</span>
          <br />
          <span>{bank_name}</span>
        </div>
      )}
    </Layout>
  );
}
