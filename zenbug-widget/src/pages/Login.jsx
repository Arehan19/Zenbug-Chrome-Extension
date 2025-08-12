import React, { useState } from "react";


const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // Run login logic
    if (email === "admin@zenbug.com" && password === "admin123") {
      onLoginSuccess();
    } else {
      setError("Invalid email or password");
    }
  };

  const handleMouseDown = () => {
    setIsActive(true);
  };

  const handleMouseUp = () => {
    setIsActive(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsActive(false); // Reset active state when mouse leaves
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to access your dashboard</p>

        <div style={styles.fieldContainer}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldContainer1}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div
          style={styles.toggle}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide Password" : "Show Password"}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(isHovered && styles.buttonHover),
            ...(isActive && styles.buttonActive),
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          Login
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #050505, #0d0d2b, #1a2a4f, #1e3c72)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    width: "100%",
    maxWidth: "510px",
    minHeight: "510px",
    background: "rgba(12, 12, 35, 0.6)",
    backdropFilter: "blur(18px)",
    padding: "50px 40px",
    borderRadius: "20px",
    boxShadow: "0 0 30px rgba(0, 200, 255, 0.3)",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: "35px",
    color: "#ffffff",
    marginBottom: "5px",
    marginTop: "40px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#90c3ff",
    marginBottom: "25px",
  },
  fieldContainer: {
    width: "100%",
    marginBottom: "12px",
    marginTop: "10px",
  },
  fieldContainer1: {
    width: "100%",
    marginTop: "8px",
  },
  input: {
    width: "100%",
    padding: "14px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    color: "#fff",
    outline: "none",
    transition: "border 0.3s, box-shadow 0.3s",
    boxSizing: "border-box",
  },
  toggle: {
    color: "#90c3ff",
    fontSize: "14px",
    marginRight: "4px",
    cursor: "pointer",
    marginBottom: "10px",
    textAlign: "right",
    marginTop: "10px",
  },
  error: {
    color: "#ff6b6b",
    fontSize: "13px",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "14px",
    marginTop: "31px",
    background: "linear-gradient(90deg, #1a2a4f, #1e3c72)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    // boxShadow: "0 0 8px rgba(0, 150, 255, 0.3)",
  },
  buttonHover: {
    background: "linear-gradient(90deg, #2a4f9f, #3b6fcf)",
    boxShadow: "0 0 12px rgba(0, 150, 255, 0.7)",
    // transform: "translateY(-1px)",
  },
  buttonActive: {
    // transform: "scale(0.97) translateY(0px)",
    background: "linear-gradient(90deg, #181819ff, #0f1010ff)",
    boxShadow: "0 0 12px rgba(0, 150, 255, 0.7)",
    color: "#90c3ff",
  },
};

export default Login;
