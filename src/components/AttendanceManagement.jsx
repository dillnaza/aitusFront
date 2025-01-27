import { useEffect, useState } from "react";
import { fetchAttendanceDates, deleteAttendanceDate, addAttendanceDate } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./../styles/AttendanceManagement.css";
import "../index.css";

const AttendanceManagement = () => {
    const { teacherId, subjectId, groupId } = useParams();
    const [attendanceData, setAttendanceData] = useState(null);
    const [newDateTime, setNewDateTime] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadAttendanceDates = async () => {
        try {
            const data = await fetchAttendanceDates(teacherId, subjectId, groupId);
            setAttendanceData(data);
            setError(null);
        } catch (err) {
            setError("Failed to load attendance data");
        }
    };

    const handleAddDate = async () => {
        if (!newDateTime) return;
        try {
            const isoDate = newDateTime.toISOString();
            await addAttendanceDate(teacherId, subjectId, groupId, isoDate);
            await loadAttendanceDates();
            setNewDateTime(null);
        } catch (err) {
            setError("Failed to add attendance date");
        }
    };

    const handleDeleteDate = async (date) => {
        try {
            await deleteAttendanceDate(teacherId, subjectId, groupId, date);
            await loadAttendanceDates();
        } catch (err) {
            setError("Failed to delete attendance date");
        }
    };

    const handleViewDate = (date) => {
        navigate(`/teacher/${teacherId}/subject/${subjectId}/group/${groupId}/attendance/${encodeURIComponent(date)}`);
    };

    useEffect(() => {
        loadAttendanceDates();
    }, [teacherId, subjectId, groupId]);

    if (!attendanceData) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="teacher-info">
                <p><strong></strong> {attendanceData.teacherName} {attendanceData.teacherSurname}</p>
                <p><strong>Barcode:</strong> {attendanceData.teacherBarcode}</p>
            </div>
            <h1 className="subject-title">
                {attendanceData.subjectName} - {attendanceData.groupName}
            </h1>
            {error && <p className="error-message">{error}</p>}
            <ul className="dashboard-list">
                {attendanceData.attendanceDates.map((date, index) => (
                    <li
                        key={index}
                        className="dashboard-item"
                        onClick={() => handleViewDate(date)}
                        style={{ cursor: "pointer" }}>
                        <span>{new Date(date).toLocaleString()}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDate(date);}}
                            className="delete-button">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <div className="add-date-section">
                <DatePicker
                    selected={newDateTime}
                    onChange={(date) => setNewDateTime(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    className="date-picker"
                    placeholderText="Select date and time"/>
                <button onClick={handleAddDate} className="add-button">Add Date</button>
            </div>
        </div>
    );
};

export default AttendanceManagement;
