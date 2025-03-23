import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AppMenu from "./pages/AppMenu";
import Login from "./pages/Login";
import Home from "./components/Home/Home";
import NewUserForm from "./components/User/NewUser";
import SchoolMain from "./components/School/SchoolMain";
import ManageSchool from "./components/School/ManageSchool";
import AddSchool from "./components/School/AddSchool";
import PageNotFound from "./pages/PageNotFound";

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
            <Route path="/user/ilp" element={<NewUserForm />} />
            <Route path="/school/school" element={<SchoolMain />} />
            <Route path="/school/add" element={<AddSchool />} />
            <Route path="/school/:id/manage" element={<ManageSchool />} />
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<PageNotFound />} />
            {/* <Route path="/student" element={<Student />} />
            <Route path="/organization" element={<Organization />} /> */}
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
