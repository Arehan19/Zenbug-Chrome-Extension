// components/FeedbackModal.jsx
import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import getDeviceInfo from "../utils/data";

const FeedbackModal = ({ onClose, onSubmit }) => {
  const [screenshot, setScreenshot] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [email, setEmail] = useState("");
  const [severity, setSeverity] = useState("low");
  const [info, setInfo] = useState({});

  useEffect(() => {
    setInfo(getDeviceInfo());
    html2canvas(document.body).then(canvas => {
      setScreenshot(canvas.toDataURL("image/png"));
    });
  }, []);

  const handleSubmit = () => {
    const feedback = {
      title,
      desc,
      email,
      severity,
      screenshot,
      ...info,
    };

    fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit feedback");
        return res.json();
      })
      .then((data) => {
        console.log("Feedback submitted:", data);
        onClose();       // close modal
        onSubmit(data);  // notify App.jsx to show success
      })
      .catch((err) => {
        console.error("Error submitting feedback:", err);
        alert("❌ Failed to submit feedback. Please try again.");
      });
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>Submit Feedback</h2>
        {screenshot && <img src={screenshot} alt="screenshot" style={{ maxWidth: "100%", maxHeight: "150px" }} />}
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <input placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} />
        <select value={severity} onChange={e => setSeverity(e.target.value)}>
          <option>low</option>
          <option>medium</option>
          <option>high</option>
        </select>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose} style={{ marginLeft: "10px" }}>Cancel</button>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center",
  },
  modal: {
    background: "#fff", padding: 20, borderRadius: 8, width: "400px", maxHeight: "90%", overflowY: "auto",
  }
};

export default FeedbackModal;