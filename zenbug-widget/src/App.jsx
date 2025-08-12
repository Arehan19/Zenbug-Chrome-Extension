import React from "react";
import FeedbackWidget from "./components/FeedbackButton";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  const [page, setPage] = React.useState("home");

  const handleFeedbackSubmit = (data) => {
    if (data === "__goToLogin__") {
      setPage("login");
    } else {
      alert("✅ Feedback submitted successfully!");
    }
  };

  return (
    <>
      {page === "home" && <FeedbackWidget onSubmit={handleFeedbackSubmit} />}
      {page === "login" && <Login onLoginSuccess={() => setPage("dashboard")} />}
      {page === "dashboard" && <Dashboard />}
    </>
  );
}

// function App() {
//   const [page, setPage] = React.useState("home");

//   const handleFeedbackSubmit = (data) => {
//     console.log("Feedback stored:", data);
//     // Here you can store in backend/localStorage or redirect
//     // Example: send to backend, then go to login/dashboard
//     setPage("login");
//   };

//   return (
//     <>
//       {page === "home" && <FeedbackWidget onSubmit={handleFeedbackSubmit} />}
//       {page === "login" && <Login onLoginSuccess={() => setPage("dashboard")} />}
//       {page === "dashboard" && <Dashboard />}
//     </>
//   );
// }

export default App;
