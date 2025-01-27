import React, { useEffect, useState } from "react";
import { fetchSubjectDetails } from "../services/api";
import { useParams } from "react-router-dom";
import "./../styles/SubjectDetails.css";
import "../index.css";

const SubjectDetails = () => {
    const { studentId, subjectId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchSubjectDetails(studentId, subjectId);
                setData(result);
            } catch (err) {
                setError("Failed to load subject details");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId, subjectId]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-container">
            <div className="student-info">
                <p>{data.studentName} {data.studentSurname}</p>
                <p>Barcode: {data.studentBarcode}</p>
            </div>
            <h1 className="subject-title">{data.subjectName}</h1>
            <p className="subject-teacher">Teacher: {data.teacherName} {data.teacherSurname}</p>
            <div className="subject-info">
                <p>Group: {data.groupName}</p>
                <p>Attendance Percentage: {data.attendancePercent}%</p>
            </div>
            <ul className="dashboard-list">
                {data.attendances.map((attendance, index) => (
                    <li
                        key={index}
                        className={`dashboard-item ${
                            attendance.status === "Absent"
                                ? "status-red"
                                : attendance.status === "Present"
                                    ? "status-green"
                                    : attendance.status === "Late"
                                        ? "status-yellow"
                                        : ""}`}>
                        <span>Date: {new Date(attendance.date).toLocaleDateString()}</span>
                        <span>Status: {attendance.status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubjectDetails;
