import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      axios.get(`http://localhost:9090/api/payments/confirm?token=${token}`)
        .then(() => setStatus("success"))
        .catch(() => setStatus("error"));
    } else {
      setStatus("error");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-[#f9f9f9] rounded-lg shadow p-8 text-center">
        {status === "pending" && <div className="text-[#00df9a] text-xl font-bold">Confirming payment...</div>}
        {status === "success" && (
          <>
            <div className="text-green-600 text-2xl font-bold mb-4">Payment Confirmed!</div>
            <button
              className="bg-[#00df9a] text-black px-4 py-2 rounded hover:bg-[#00c97a] font-medium"
              onClick={() => navigate("/search")}
            >
              Return to Search
            </button>
          </>
        )}
        {status === "error" && <div className="text-red-600 text-xl font-bold">Invalid or expired confirmation link.</div>}
      </div>
    </div>
  );
};

export default PaymentConfirm;