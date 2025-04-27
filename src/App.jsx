import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AppMenu from "./components/Common/AppMenu";
import Login from "./components/Login/Login";
import Dashboard from "./components/Home/Home";
import UserMain from "./components/User/UserMain";
import AddEditUser from "./components/User/AddEditUser";
import SchoolMain from "./components/School/SchoolMain";
import ManageSchool from "./components/School/ManageSchool";
import AddEditSchoolPage from "./components/School/AddEditSchool";
import RegionMain from "./components/Region/RegionMain";
import PageNotFound from "./components/Common/PageNotFound";

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
            <Route path="/home" element={<Dashboard />} />
            <Route path="/users" element={<UserMain />} />
            <Route path="/user/add" element={<AddEditUser />} />
            <Route path="/user/edit/:username" element={<AddEditUser />} />
            <Route path="/schools" element={<SchoolMain />} />
            <Route path="/school/add" element={<AddEditSchoolPage />} />
            <Route
              path="/school/edit/:schoolname"
              element={<AddEditSchoolPage />}
            />
            <Route
              path="/school/manage/:schoolname"
              element={<ManageSchool />}
            />
            <Route path="/regions" element={<RegionMain />} />
            <Route path="/" element={<Dashboard />} />
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
