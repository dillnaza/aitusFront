import React, { useEffect, useState } from "react";
import { fetchStudentSubjects } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "./../styles/StudentDashboard.css";
import "../index.css";

const StudentDashboard = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchStudentSubjects(studentId);
                setData(result);
            } catch (err) {
                setError("Failed to load student data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-container">
            <header className="student-header">
                <div className="student-info">
                    <h1>{data.studentName} {data.studentSurname}</h1>
                    <p>Barcode: {data.studentBarcode} <br/> Group: {data.groupName}</p>
                </div>
            </header>

            <div className="subject-list">
                {data.subjectTeacher && data.subjectTeacher.map((subject, index) => (
                    <div
                        key={index}
                        className="subject-card"
                        onClick={() => navigate(`/student/${studentId}/subject/${index + 1}`)}
                    >
                        <div className="subject-details">
                            <h3>{subject.subjectName}</h3>
                            <p>{subject.teacherName}</p>
                        </div>
                        <br/>
                        <div className={`attendance-status ${subject.attendancePercent >= 70 ? "green" : "red"}`}>
                            66,66{subject.attendancePercent}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;
