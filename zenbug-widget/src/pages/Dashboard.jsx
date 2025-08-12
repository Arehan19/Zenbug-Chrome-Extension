import React, { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedSeverity, setSelectedSeverity] = useState("All Severity");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/feedback")
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch((err) => console.error("Error fetching feedbacks:", err));
  }, []);

  const updateStatus = async (id, newStatus) => {
  try {
    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb._id === id ? { ...fb, status: newStatus, updating: true } : fb
      )
    );

    if (selectedFeedback && selectedFeedback._id === id) {
      setSelectedFeedback((prev) => ({ ...prev, status: newStatus }));
    }

    const res = await fetch(`http://localhost:5000/api/feedback/feedback/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ status: newStatus }),
});


    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const updatedFeedback = await res.json(); // ✅ only once

    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb._id === id ? { ...updatedFeedback, updating: false } : fb
      )
    );

    if (selectedFeedback && selectedFeedback._id === id) {
      setSelectedFeedback(updatedFeedback); // ✅ sync modal state too
    }
  } catch (err) {
    console.error("Update failed:", err);
  }
};


  // const updateStatus = async (id, newStatus) => {
  //   try {
  //     setFeedbacks((prev) =>
  //       prev.map((fb) =>
  //         fb._id === id ? { ...fb, status: newStatus, updating: true } : fb
  //       )
  //     );

  //     if (selectedFeedback && selectedFeedback._id === id) {
  //       setSelectedFeedback((prev) => ({ ...prev, status: newStatus }));
  //     }

  //     const res = await fetch(`http://localhost:5000/api/feedback/${id}`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ status: newStatus }),
  //     });

  //     const data = await res.json();
  //     console.log("PATCH response:", data);

  //     if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  //     const updatedFeedback = await res.json();



  //     setFeedbacks((prev) =>
  //       prev.map((fb) =>
  //         fb._id === id ? { ...updatedFeedback, updating: false } : fb
  //       )
  //     );
  //     if (selectedFeedback && selectedFeedback._id === id) {
  //       setSelectedFeedback(updatedFeedback); // ✅ sync modal state too
  //     }
  //   } catch (err) {
  //     console.error("Update failed:", err);
  //   }

  //   // } catch (err) {
  //   //   console.error("Update failed:", err);
  //   //   setFeedbacks((prev) =>
  //   //     prev.map((fb) => (fb._id === id ? { ...fb, updating: false } : fb))
  //   //   );
  //   // }
  // };

  const totalFeedback = feedbacks.length;
  const newFeedback = feedbacks.filter((f) => f.status?.toLowerCase() === "open").length;
  const inProgressFeedback = feedbacks.filter((f) => f.status?.toLowerCase() === "in-progress").length;
  const resolvedFeedback = feedbacks.filter((f) => f.status?.toLowerCase() === "resolved").length;
  const highPriorityFeedback = feedbacks.filter((f) => f.severity?.toLowerCase() === "high").length;

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const statusMatch =
      selectedStatus === "All Status" || feedback.status === selectedStatus;
    const severityMatch =
      selectedSeverity === "All Severity" ||
      feedback.severity?.toLowerCase() === selectedSeverity.toLowerCase();
    return statusMatch && severityMatch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 style={{ color: "#a1cbf0ff" }}>Admin Dashboard</h1>
        <div className="total-feedback">{totalFeedback} total feedback</div>
      </div>

      {/* Metrics Section */}
      <div className="metrics-container">
        <div className="metric-card">
          <div className="metric-value">{totalFeedback}</div>
          <div className="metric-label">Total Feedback</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{newFeedback}</div>
          <div className="metric-label">New</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{inProgressFeedback}</div>
          <div className="metric-label">In Progress</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{resolvedFeedback}</div>
          <div className="metric-label">Resolved</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{highPriorityFeedback}</div>
          <div className="metric-label">High Priority</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <label>Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="open">New</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Severity</label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
          >
            <option value="All Severity">All Severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="feedback-list">
        {filteredFeedbacks.length === 0 ? (
          <p className="no-feedback">No feedbacks available</p>
        ) : (
          filteredFeedbacks.map((item) => (
            <div
              className="feedback-item"
              key={item._id}
              onClick={() => {
                setSelectedFeedback(item);
                setShowModal(true);
              }}
            >
              <div className="feedback-header">
                <span className="feedback-author">{item.title || "No Title"}</span>
                <span className={`feedback-severity ${item.severity?.toLowerCase()}`}>
                  {item.severity?.toUpperCase() || "MEDIUM"}
                </span>
                <span className={`feedback-status ${item.status}`}>
                  {item.status === "open"
                    ? "NEW"
                    : item.status === "in-progress"
                      ? "IN PROGRESS"
                      : "RESOLVED"}
                </span>
              </div>
              <div className="feedback-content">
                <p className="feedback-description">{item.description}</p>
                <div className="feedback-footer">
                  <select
                    value={item.status}
                    onChange={(e) => updateStatus(item._id, e.target.value)}
                    className="status-select"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="open">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <span className="feedback-date">
                    {formatDate(item.submittedAt || item.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for feedback details */}
      {/* Modal for feedback details */}
      {showModal && selectedFeedback && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>

            <div className="modal-body">
              {/* LEFT SIDE */}
              <div className="details">
                <div className="tags">
                  <span className={`feedback-severity ${selectedFeedback.severity?.toLowerCase()}`}>
                    {selectedFeedback.severity === "low"
                      ? "Low Priority"
                      : selectedFeedback.severity === "medium"
                        ? "Medium Priority"
                        : selectedFeedback.severity === "high"
                          ? "High Priority"
                          : "Unknown Priority"}
                  </span>
                  <span className={`feedback-status ${selectedFeedback.status}`}>
                    {selectedFeedback.status === "open"
                      ? "NEW"
                      : selectedFeedback.status === "in-progress"
                        ? "IN PROGRESS"
                        : "RESOLVED"}
                  </span>
                </div>

                <h3 style={{ marginTop: "35px", marginBottom: "0px", marginLeft: "10px", fontSize: "20px", fontWeight: "600", color: "#a1cbf0ff" }}>Description</h3>
                <p className="description">{selectedFeedback.description}</p>

                <div className="meta">
                  <p>
                    <i className="fas fa-calendar-alt icon"></i>
                    {formatDate(selectedFeedback.submittedAt || selectedFeedback.createdAt)}
                  </p>

                  {selectedFeedback.metadata?.url && (
                    <p>
                      <i className="fas fa-link icon"></i>
                      <a href={selectedFeedback.metadata.url} target="_blank" rel="noreferrer">
                        {selectedFeedback.metadata.url}
                      </a>
                    </p>
                  )}
                  {selectedFeedback.metadata?.viewport && (
                    <p>
                      <i className="fas fa-expand-arrows-alt icon"></i>  {selectedFeedback.metadata.viewport}
                    </p>
                  )}
                  {selectedFeedback.metadata?.browser && (
                    <p>
                      <i className="fas fa-desktop icon"></i> {selectedFeedback.metadata.browser}
                    </p>
                  )}

                </div>


                <div className="modal-footer">
                  <label>Update Status:</label>
                  <select
                    value={selectedFeedback.status}
                    onChange={async (e) => { // <-- Add async here
                      await updateStatus(selectedFeedback._id, e.target.value);
                      const res = await fetch("http://localhost:5000/api/feedback");
                      const freshData = await res.json();
                      setFeedbacks(freshData);
                    }}
                  >
                    <option value="open">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* RIGHT SIDE */}
              {selectedFeedback.screenshot && (
                <div className="screenshot">
                  <h3>Screenshot</h3>
                  <div className="screenshot-container">
                    <img
                      src={selectedFeedback.screenshot}
                      alt="Feedback screenshot"
                    />
                  </div>
                </div>
              )}
            </div> {/* End of modal-body */}
          </div> {/* End of modal-content */}
        </div>
      )}
    </div>
  );
}

export default Dashboard;