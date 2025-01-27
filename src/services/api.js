import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5032/api",
});

export const login = async (email, password) => {
    try {
        const response = await API.post("/login", { email, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const fetchStudentSubjects = async (studentId) => {
    try {
        const response = await API.get(`/StudentMain/${studentId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const fetchTeacherSubjects = async (teacherId) => {
    try {
        const response = await API.get(`/TeacherMain/${teacherId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const fetchSubjectDetails = async (studentId, subjectId) => {
    try {
        const response = await API.get(`/StudentMain/student/${studentId}/subject/${subjectId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const fetchAttendanceDates = async (teacherId, subjectId, groupId) => {
    try {
        const response = await API.get(`/TeacherMain/${teacherId}/subject/${subjectId}/group/${groupId}/attendance-dates`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const addAttendanceDate = async (teacherId, subjectId, groupId, date) => {
    try {
        const formattedDate = `"${date}"`; // Добавляем кавычки вокруг даты
        const response = await API.post(
            `/TeacherMain/${teacherId}/subject/${subjectId}/group/${groupId}/attendance-dates`,
            formattedDate,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteAttendanceDate = async (teacherId, subjectId, groupId, date) => {
    try {
        const response = await API.delete(`/TeacherMain/${teacherId}/subject/${subjectId}/group/${groupId}/attendance-dates/${date}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const fetchDateAttendance = async (teacherId, subjectId, groupId, date) => {
    try {
        const response = await API.get(
            `/TeacherMain/${teacherId}/subject/${subjectId}/group/${groupId}/attendances/${date}`
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const postAttendanceData = async (teacherId, subjectId, groupId, date, attendance) => {
    try {
        const response = await API.post(
            `/TeacherMain/${teacherId}/subject/${subjectId}/group/${groupId}/attendance/${encodeURIComponent(date)}`,
            attendance
        );
        return response.data;
    } catch (error) {
        console.error("Error posting attendance data:", error.response || error.message);
        throw error.response?.data || error.message;
    }
};


export const fetchGroupStudents = async (groupId) => {
    try {
        const response = await API.get(`/group/${groupId}/students`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};



