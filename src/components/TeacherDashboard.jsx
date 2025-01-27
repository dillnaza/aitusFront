import { useEffect, useState } from "react";
import { fetchTeacherSubjects } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "./../styles/TeacherDashboard.css";
import "../index.css";

const TeacherDashboard = () => {
    const { teacherId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchTeacherSubjects(teacherId);
                setData(result);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [teacherId]);

    if (!data) return <div className="loading">Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="teacher-header">
                <h1 className="teacher-info">{data.teacherName} {data.teacherSurname}</h1>
                <p className="teacher-barcode">Barcode: {data.teacherBarcode}</p>
            </div>
            <div className="subject-list">
                {data.subjectGroup.map((sg, index) => (
                    <div
                        key={index}
                        className="subject-card"
                        onClick={() =>
                            navigate(`/teacher/${teacherId}/subject/${sg.subjectId}/group/${sg.groupId}/attendance-management`)
                        }>
                        <div className="subject-details">
                            <h3>{sg.subjectName}</h3>
                            <p>{sg.groupName}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherDashboard;
