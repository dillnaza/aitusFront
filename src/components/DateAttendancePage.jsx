import { useEffect, useState } from "react";
import { fetchGroupStudents, fetchSubjectDetails, postAttendanceData } from "../services/api";
import { useParams } from "react-router-dom";
import "./../styles/DateAttendancePage.css";
import "../index.css";

const DateAttendancePage = () => {
    const { teacherId, subjectId, groupId, date } = useParams();
    const [students, setStudents] = useState(null);
    const [subjectDetails, setSubjectDetails] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [error, setError] = useState(null);

    const loadStudents = async () => {
        try {
            const data = await fetchGroupStudents(groupId);
            setStudents(data);
            const initialAttendance = data.map((student) => ({
                studentName: student.name,
                studentSurname: student.surname,
                status: "Absent",
            }));
            setAttendance(initialAttendance);
        } catch (err) {
            setError("Failed to load students");
        }
    };

    const loadSubjectDetails = async () => {
        try {
            const data = await fetchSubjectDetails(teacherId, subjectId);
            setSubjectDetails(data);
        } catch (err) {
            setError("Failed to load subject details");
        }
    };

    const handleAttendanceChange = (index, status) => {
        setAttendance((prevAttendance) =>
            prevAttendance.map((item, i) =>
                i === index ? { ...item, status } : item
            )
        );
    };
    const handleSaveAttendance = async () => {
        try {
            await postAttendanceData(teacherId, subjectId, groupId, date, attendance);
            alert("Attendance saved successfully!");
        } catch (err) {
            setError("Failed to save attendance");
        }
    };

    useEffect(() => {
        loadStudents();
        loadSubjectDetails();
    }, [groupId, teacherId, subjectId]);

    if (students === null || subjectDetails === null) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="teacher-info">
                <p><strong></strong> {subjectDetails.teacherName} {subjectDetails.teacherSurname}</p>
            </div>
            <h1 className="subject-title">
                {subjectDetails.subjectName} | {subjectDetails.groupName}
            </h1>
            <h2 className="attendance-date">Attendance for {new Date(date).toLocaleDateString()}</h2>
            {error && <p className="error-message">{error}</p>}
            <ul className="dashboard-list">
                {students.map((student, index) => (
                    <li key={index} className="attendance-item">
                        <span>{student.name} {student.surname}</span>
                        <select
                            value={attendance[index]?.status || "Present"}
                            onChange={(e) => handleAttendanceChange(index, e.target.value)}
                            className="status-dropdown">
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Excused">Excused</option>
                        </select>
                    </li>
                ))}
            </ul>
            <button onClick={handleSaveAttendance} className="save-button">
                Save Attendance
            </button>
        </div>
    );
};

export default DateAttendancePage;
