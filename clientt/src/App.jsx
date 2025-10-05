import { Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateCourse from "./pages/CreateCourse";
import MyCourses from "./pages/MyCourses";
import AddLessons from "./pages/AddLessons";
import CourseDetails from "./pages/CourseDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Home />} />
      <Route path="/courses" element={<Home />} />
      <Route path="/my-courses" element={<Home />} />
      <Route path="/manage-courses" element={<Home />} />
      <Route path="/manage-users" element={<Home />} />
      <Route path="/analytics" element={<Home />} />
      
      {/* Separate pages */}
      <Route path="/create-course" element={<CreateCourse />} />
      <Route path="/course/:courseId/add-lesson" element={<AddLessons />} />
      <Route path="/course/:courseId/details" element={<CourseDetails />} />
      <Route path="/course/admin-preview/:courseId" element={<CourseDetails />} /> {/* Admin preview */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Fallback route */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;