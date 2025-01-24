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

    // Загрузка студентов группы
    const loadStudents = async () => {
        try {
            const data = await fetchGroupStudents(groupId);
            setStudents(data);

            // Инициализируем посещаемость для всех студентов
            const initialAttendance = data.map((student) => ({
                studentName: student.name,
                studentSurname: student.surname,
                status: "Present", // По умолчанию "Present"
            }));
            setAttendance(initialAttendance);
        } catch (err) {
            setError("Failed to load students");
        }
    };

    // Загрузка деталей предмета
    const loadSubjectDetails = async () => {
        try {
            const data = await fetchSubjectDetails(teacherId, subjectId);
            setSubjectDetails(data);
        } catch (err) {
            setError("Failed to load subject details");
        }
    };

    // Обновление статуса посещаемости для конкретного студента
    const handleAttendanceChange = (index, status) => {
        setAttendance((prevAttendance) =>
            prevAttendance.map((item, i) =>
                i === index ? { ...item, status } : item
            )
        );
    };

    // Сохранение посещаемости
    const handleSaveAttendance = async () => {
        try {
            console.log("Sending payload:", attendance); // Логируем перед отправкой
            await postAttendanceData(teacherId, subjectId, groupId, date, attendance);
            alert("Attendance saved successfully!");
        } catch (err) {
            console.error("Error saving attendance:", err);
            setError("Failed to save attendance");
        }
    };

    useEffect(() => {
        loadStudents(); // Загружаем список студентов
        loadSubjectDetails(); // Загружаем детали предмета
    }, [groupId, teacherId, subjectId]);

    if (students === null || subjectDetails === null) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            {/* Информация о предмете и преподавателе */}
            <div className="teacher-info">
                <p><strong></strong> {subjectDetails.teacherName} {subjectDetails.teacherSurname}</p>
            </div>

            {/* Название предмета и группы */}
            <h1 className="subject-title">
                {subjectDetails.subjectName} - {subjectDetails.groupName}
            </h1>

            {/* Дата посещаемости */}
            <h2 className="attendance-date">Attendance for {new Date(date).toLocaleDateString()}</h2>
            {error && <p className="error-message">{error}</p>}

            {/* Список студентов */}
            <ul className="dashboard-list">
                {students.map((student, index) => (
                    <li key={index} className="attendance-item">
                        <span>{student.name} {student.surname}</span>
                        <select
                            value={attendance[index]?.status || "Present"}
                            onChange={(e) => handleAttendanceChange(index, e.target.value)}
                            className="status-dropdown"
                        >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Excused">Excused</option>
                        </select>
                    </li>
                ))}
            </ul>

            {/* Кнопка сохранения */}
            <button onClick={handleSaveAttendance} className="save-button">
                Save Attendance
            </button>
        </div>
    );
};

export default DateAttendancePage;
