import React from "react";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";


export default function NotFound({notFound}) {
    return (
        <Col sm={6} className="justify-content-center">
            <Badge bg="light" text="dark" className="fs-3">
                {notFound}
            </Badge>
        </Col>
    );
  }