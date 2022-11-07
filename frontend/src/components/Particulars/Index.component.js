import React, {useEffect, useState} from "react";

export default function Particulars() {
    let [particulars, setParticulars] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        getParticulars();
    }, []);

    const getParticulars = () => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}admin/particulars`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((response) => response.json())
          .then((data) => {
            setParticulars(data.particulars);
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
          <tbody>
          <tr>
            <th>Particulars</th>
          </tr>
            {particulars.map((item, i) => (
                <tr key={i}>
                <td>{item.particulars}</td>
                </tr>
            ))}
        </tbody>
        </div>
      )}
    </>
    )
}
