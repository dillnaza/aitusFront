import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentPage from "./pages/StudentPage";
import TeacherPage from "./pages/TeacherPage";
import SubjectDetails from "./components/SubjectDetails";
import AttendanceManagement from "./components/AttendanceManagement";
import DateAttendancePage from "./components/DateAttendancePage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/student/:studentId" element={<StudentPage />} />
                <Route path="/student/:studentId/subject/:subjectId" element={<SubjectDetails />} />
                <Route path="/teacher/:teacherId" element={<TeacherPage />} />
                <Route
                    path="/teacher/:teacherId/subject/:subjectId/group/:groupId/attendance-management"
                    element={<AttendanceManagement />}/>
                <Route
                    path="/teacher/:teacherId/subject/:subjectId/group/:groupId/attendance/:date"
                    element={<DateAttendancePage />}/>
            </Routes>
        </Router>
    );
};

export default App;
