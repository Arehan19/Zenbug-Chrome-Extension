import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import "./widget.css";

const FeedbackWidget = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    email: "",
    severity: "low",
  });

  const [hoveredButton, setHoveredButton] = useState(null);
  const [clickedButton, setClickedButton] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (
        event.data &&
        typeof event.data === "object" &&
        event.data.type === "SCREENSHOT_FROM_EXTENSION"
      ) {
        console.log("Received screenshot from extension");
        setScreenshot(event.data.screenshot); // base64 image from extension
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleOpen = () => {
    // Request a fresh screenshot from the extension
    requestScreenshotFromExtension();
    setOpen(true);
  };

  const requestScreenshotFromExtension = () => {
    // Send message to parent (popup) to request a new screenshot
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "REQUEST_SCREENSHOT" }, "*");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      email: form.email,
      screenshot, // base64 screenshot from extension
      severity: form.severity.toLowerCase() || "low",
      status: "open",
      url: window.location.href,
      browser: navigator.userAgent,
      timestamp: new Date().toISOString(),
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    };

    console.log("Submitting Feedback:", payload);

    try {
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      console.log("✅ Feedback submitted successfully");
      alert("✅ Feedback submitted successfully!");

      // Reset form and close modal
      setOpen(false);
      setScreenshot(null);
      setForm({ title: "", description: "", email: "", severity: "low" });

    } catch (err) {
      console.error("❌ Error:", err.message);
      alert("❌ Submission failed. Please try again.");
    }
  };

  const inputStyle = {
    width: "91.6%",
    padding: "14px 20px",
    marginBottom: 12,
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    fontSize: 15,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    color: "#fff",
    outline: "none",
    backdropFilter: "blur(4px)",
  };

  const inputStyle1 = {
    width: "99.4%",
    padding: "14px 20px",
    marginBottom: 12,
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    fontSize: 15,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    color: "#fff",
    outline: "none",
    backdropFilter: "blur(4px)",
    cursor: "pointer",
  };

  const buttonStyle = {
    flex: 1,
    padding: "16px 0",
    backgroundColor: "#4dabff",
    color: "#fff",
    fontWeight: 600,
    fontSize: "16px",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    transition: "background 0.3s",
  };

  return (
    <>
      {/* Full Landing Page */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          minHeight: "100vh",
          width: "100%",
          background: "linear-gradient(135deg, #050505, #0d0d2b, #1a2a4f, #1e3c72)",
          backgroundSize: "cover",
          color: "#fff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Hero Section */}
        <section style={{ textAlign: "center", padding: "80px 20px" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>
            Welcome to <span style={{ color: "#6bb4f5ff" }}>ZenBug Widget</span>
          </h1>
          <p style={{ fontSize: "1.2rem", maxWidth: "700px", margin: "25px auto", opacity: 0.9, lineHeight: "2" }}>
            ZenBug Widget is a smart feedback tool designed for modern web apps. Collect bug reports,
            feature requests, and user insights — all with screenshots and detailed context automatically included.
          </p>
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => onSubmit("__goToLogin__")}
              onMouseEnter={() => setHoveredButton("admin")}
              onMouseLeave={() => setHoveredButton(null)}
              onMouseDown={() => setClickedButton("admin")}
              onMouseUp={() => setClickedButton(null)}
              style={{
                background: "#4dabff",
                color: "#fff",
                fontSize: "16px",
                border: "none",
                padding: "15px 29px",
                borderRadius: "10px",
                marginRight: "20px",
                marginTop: "20px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                ...(hoveredButton === "admin" && {
                  background: "#3a92e8",
                  boxShadow: "0 0 10px rgba(77,171,255,0.6)",
                }),
                ...(clickedButton === "admin" && {
                  transform: "scale(0.96)",
                  background: "#337fd1",
                  boxShadow: "0 0 15px rgba(77,171,255,0.9)",
                }),
              }}
            >
              Admin Dashboard
            </button>

            <button
              style={{
                background: "transparent",
                color: "#fff",
                fontSize: "16px",
                border: "1px solid #4dabff",
                padding: "15px 29px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Learn More
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
            padding: "60px 20px",
            background: "rgba(255, 255, 255, 0.05)",
            lineHeight: "1.7",
          }}
        >
          {[
            {
              title: "One-Click Feedback",
              desc: "Users can submit bug reports or feedback instantly with a single click.",
            },
            {
              title: "Automatic Screenshots",
              desc: "ZenBug automatically captures a screenshot to give you full visual context.",
            },
            {
              title: "Context-Rich Reports",
              desc: "Browser, URL, and screen details are auto-collected with every submission.",
            },
            {
              title: "Customizable Severity",
              desc: "Categorize feedback as Low, Medium, or High priority to manage effectively.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                padding: "20px",
                borderRadius: "10px",
                width: "280px",
                textAlign: "center",
              }}
            >
              <h3 style={{ color: "#6bb4f5ff", marginBottom: "10px" }}>{feature.title}</h3>
              <p style={{ fontSize: "0.95rem", opacity: 0.9 }}>{feature.desc}</p>
            </div>
          ))}
        </section>

        {/* Extended Features Section */}
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
            padding: "60px 20px",
            lineHeight: "1.7",
          }}
        >
          {[
            {
              title: "Anonymous Feedback",
              desc: "Allow users to submit feedback without logging in.",
            },
            {
              title: "Mobile Responsive",
              desc: "Fully optimized for phones, tablets, and desktops.",
            },
            {
              title: "Easy Integration",
              desc: "Just plug & play with your existing React app.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                padding: "20px",
                borderRadius: "10px",
                width: "280px",
                textAlign: "center",
              }}
            >
              <h3 style={{ color: "#6bb4f5ff", marginBottom: "10px" }}>{feature.title}</h3>
              <p style={{ fontSize: "0.95rem", opacity: 0.9 }}>{feature.desc}</p>
            </div>
          ))}
        </section>

        {/* Testimonials Section */}
        <section
          style={{
            padding: "60px 20px",
            background: "rgba(255, 255, 255, 0.03)",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "2rem", marginBottom: "30px" }}>What Our Users Say</h2>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <blockquote style={{ fontStyle: "italic", fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "30px" }}>
              "ZenBug helped us catch bugs 3× faster during user testing. It's now an essential part of our workflow."
              <br />
              <span style={{ display: "block", marginTop: "10px", fontWeight: "bold", color: "#6bb4f5ff" }}>
                — Aakash, Product Manager
              </span>
            </blockquote>
            <blockquote style={{ fontStyle: "italic", fontSize: "1.1rem", lineHeight: "1.8" }}>
              "I love how simple it is to give feedback with screenshots — no tech knowledge required."
              <br />
              <span style={{ display: "block", marginTop: "10px", fontWeight: "bold", color: "#6bb4f5ff" }}>
                — Neha, Beta Tester
              </span>
            </blockquote>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            background: "#0f0f1f",
            padding: "40px 20px",
            color: "#aaa",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
            <a href="#" style={{ color: "#6bb4f5ff", textDecoration: "none" }}>About</a>
            <a href="#" style={{ color: "#6bb4f5ff", textDecoration: "none" }}>Contact</a>
            <a href="#" style={{ color: "#6bb4f5ff", textDecoration: "none" }}>Terms</a>
            <a href="#" style={{ color: "#6bb4f5ff", textDecoration: "none" }}>Privacy</a>
          </div>
          <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
            <span style={{ fontSize: "1.2rem", cursor: "pointer" }}>🐦</span>
            <span style={{ fontSize: "1.2rem", cursor: "pointer" }}>💼</span>
            <span style={{ fontSize: "1.2rem", cursor: "pointer" }}>🌐</span>
          </div>
          <div style={{ fontSize: "0.9rem" }}>
            &copy; {new Date().getFullYear()} ZenBug — Made with ❤️ for better user feedback
          </div>
        </footer>
      </div>

      {/* Floating Feedback Button */}
      <button
        onClick={handleOpen} 
        onMouseEnter={() => setHoveredButton("widget")}
        onMouseLeave={() => setHoveredButton(null)}
        onMouseDown={() => setClickedButton("widget")}
        onMouseUp={() => setClickedButton(null)}
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "#4dabff",
          color: "#fff",
          border: "none",
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 1000,
          transition: "all 0.2s ease",
          ...(hoveredButton === "widget" && {
            backgroundColor: "#3a92e8",
            boxShadow: "0 0 12px rgba(77,171,255,0.7)",
          }),
          ...(clickedButton === "widget" && {
            transform: "scale(0.95)",
            backgroundColor: "#337fd1",
            boxShadow: "0 0 16px rgba(77,171,255,0.9)",
          }),
        }}
        title="Give Feedback"
      >
        <MessageSquare size={24} />
      </button>

      {/* Feedback Modal */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              maxWidth: 610,
              margin: "60px auto",
              background: "#1a1a2e",
              color: "#fff",
              borderRadius: 16,
              padding: 29,
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              backdropFilter: "blur(6px)",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: 20, letterSpacing: "0.4px", color: "#a1cbf0ff" }}>Submit Feedback</h2>

            {screenshot && (
              <img
                src={screenshot}
                alt="Screenshot"
                style={{ width: "100%", borderRadius: 10, marginBottom: 16 }}
              />
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <textarea
                name="description"
                placeholder="Describe the issue..."
                value={form.description}
                onChange={handleChange}
                required
                style={{ ...inputStyle, minHeight: 130, resize: "vertical" }}
              />
              <input
                type="email"
                name="email"
                placeholder="Your email (optional)"
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
              />
              <label style={{ fontSize: 14, marginBottom: 6, display: "block", marginTop: 10 }}>
                Severity:
              </label>
              <select
                name="severity"
                value={form.severity}
                onChange={handleChange}
                style={{ ...inputStyle1, padding: "14px 20px" }}
              >
                <option value="low" style={{ color: "white", backgroundColor: "rgba(20, 20, 40, 0.9)" }}>Low</option>
                <option value="medium" style={{ color: "white", backgroundColor: "rgba(20, 20, 40, 0.9)" }}>Medium</option>
                <option value="high" style={{ color: "white", backgroundColor: "rgba(20, 20, 40, 0.9)" }}>High</option>
              </select>

              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button
                  type="submit"
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#4dabff",
                    ...(hoveredButton === "submit" && {
                      backgroundColor: "#3a92e8",
                      boxShadow: "0 0 12px rgba(77,171,255,0.7)",
                    }),
                    ...(clickedButton === "submit" && {
                      transform: "scale(0.96)",
                      backgroundColor: "#337fd1",
                      boxShadow: "0 0 18px rgba(77,171,255,0.9)",
                    }),
                  }}
                  onMouseEnter={() => setHoveredButton("submit")}
                  onMouseLeave={() => setHoveredButton(null)}
                  onMouseDown={() => setClickedButton("submit")}
                  onMouseUp={() => setClickedButton(null)}
                >
                  Submit
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#9ca3af",
                    color: "#000",
                    ...(hoveredButton === "cancel" && {
                      backgroundColor: "#b0b6bd",
                      boxShadow: "0 0 10px rgba(156,163,175,0.7)",
                    }),
                    ...(clickedButton === "cancel" && {
                      transform: "scale(0.96)",
                      backgroundColor: "#8b9299",
                      boxShadow: "0 0 15px rgba(156,163,175,0.9)",
                    }),
                  }}
                  onMouseEnter={() => setHoveredButton("cancel")}
                  onMouseLeave={() => setHoveredButton(null)}
                  onMouseDown={() => setClickedButton("cancel")}
                  onMouseUp={() => setClickedButton(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackWidget;