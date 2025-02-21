import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AppMenu from "./pages/AppMenu";
import Login from "./pages/Login";
import Home from "./components/Home/Home";
import NewUserForm from "./components/User/NewUser";
// import School from "./pages/School";
// import Student from "./pages/Student";
// import Organization from "./pages/Organization";

function App() {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("authenticated")
  );

  return (
    <Router>
      <AppMenu />
      <Routes>
        {!authenticated ? (
          <Route
            path="/*"
            element={<Login setAuthenticated={setAuthenticated} />}
          />
        ) : (
          <>
            <Route
              path="/login"
              element={<Login setAuthenticated={setAuthenticated} />}
            />
            <Route path="/home" element={<Home />} />
            <Route path="/user" element={<NewUserForm />} />
            {/* <Route path="/student" element={<Student />} />
            <Route path="/organization" element={<Organization />} /> */}
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
