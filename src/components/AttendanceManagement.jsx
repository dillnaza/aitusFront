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
    const [newDateTime, setNewDateTime] = useState(null); // Для выбора даты и времени
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Загружаем данные о датах посещаемости
    const loadAttendanceDates = async () => {
        try {
            const data = await fetchAttendanceDates(teacherId, subjectId, groupId);
            setAttendanceData(data);
            setError(null); // Сбрасываем ошибку
        } catch (err) {
            setError("Failed to load attendance data");
        }
    };

    // Добавляем новую дату
    const handleAddDate = async () => {
        if (!newDateTime) return;
        try {
            const isoDate = newDateTime.toISOString(); // Преобразуем дату и время в ISO-формат
            await addAttendanceDate(teacherId, subjectId, groupId, isoDate);
            loadAttendanceDates(); // Перезагружаем данные
            setNewDateTime(null); // Очищаем поле ввода
        } catch (err) {
            setError("Failed to add attendance date");
        }
    };

    // Удаляем дату
    const handleDeleteDate = async (date) => {
        try {
            await deleteAttendanceDate(teacherId, subjectId, groupId, date);
            loadAttendanceDates(); // Перезагружаем данные
        } catch (err) {
            setError("Failed to delete attendance date");
        }
    };

    // Обработка клика на дату для перехода
    const handleViewDate = (date) => {
        navigate(`/teacher/${teacherId}/subject/${subjectId}/group/${groupId}/attendance/${encodeURIComponent(date)}`);
    };

    useEffect(() => {
        loadAttendanceDates();
    }, [teacherId, subjectId, groupId]);

    if (!attendanceData) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            {/* Информация о преподавателе */}
            <div className="teacher-info">
                <p><strong>Name:</strong> {attendanceData.teacherName} {attendanceData.teacherSurname}</p>
                <p><strong>Barcode:</strong> {attendanceData.teacherBarcode}</p>
            </div>

            {/* Название предмета и группы */}
            <h1 className="subject-title">
                {attendanceData.subjectName} - {attendanceData.groupName}
            </h1>

            {error && <p className="error-message">{error}</p>}
            <ul className="dashboard-list">
                {attendanceData.attendanceDates.map((date, index) => (
                    <li
                        key={index}
                        className="dashboard-item"
                        onClick={() => handleViewDate(date)} // Переход при клике
                        style={{ cursor: "pointer" }} // Указываем курсор для интерактивности
                    >
                        <span>{new Date(date).toLocaleString()}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Предотвращаем срабатывание клика на элемент списка
                                handleDeleteDate(date);
                            }}
                            className="delete-button"
                        >
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
                    dateFormat="Pp" // Формат даты и времени
                    className="date-picker"
                    placeholderText="Select date and time"
                />
                <button onClick={handleAddDate} className="add-button">Add Date</button>
            </div>
        </div>
    );
};

export default AttendanceManagement;
