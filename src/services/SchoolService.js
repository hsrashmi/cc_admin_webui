import axios from "axios";
import { getConfig } from "../config";
import { extractErrorMessage } from "../components/Utilities/UtilFuncs";

export const fetchTeachers = async (schoolId) => {
  const config = getConfig();
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/teacher/${schoolId}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch teachers"),
      details: error.message,
    };
  }
};

export const updateClass = async (classData) => {
  const config = getConfig();
  try {
    let classId = classData.id;
    await axios.put(`${config.API_BASE_URL}/schoolClass/${classId}`, {
      id: classData.id,
      school_id: classData.schoolId,
      grade: classData.grade,
      section: classData.section,
    });
    await axios.put(
      `${config.API_BASE_URL}/assignTeacherToClass/${classData.teacher_assignment_id}`,
      {
        id: classData.teacher_assignment_id,
        class_id: classId,
        user_id: classData.teacher,
      }
    );
    return { success: true, data: { type: "edit" } };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to save class"),
      details: error.message,
    };
  }
};

export const saveClass = async (classData) => {
  const config = getConfig();
  try {
    const responseClass = await axios.post(
      `${config.API_BASE_URL}/schoolClass`,
      {
        school_id: classData.schoolId,
        grade: classData.grade,
        section: classData.section,
      }
    );
    const classId = responseClass.data.id;
    await axios.post(`${config.API_BASE_URL}/assignTeacherToClass`, {
      class_id: classId,
      user_id: classData.teacher,
    });
    return { success: true, data: { type: "add" } };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to save class"),
      details: error.message,
    };
  }
};

export const fetchClassStudents = async (sectionId) => {
  const config = getConfig();
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/schoolClassStudents/${sectionId}`
    );
    return { success: true, data: response.data || [] };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch class students"),
      details: error.message,
    };
  }
};

export const fetchUnassignedStudents = async (schoolId) => {
  const config = getConfig();
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/unassignedSchoolStudents/${schoolId}`
    );
    return { success: true, data: response.data || [] };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch unassigned students"),
      details: error.message,
    };
  }
};

export const updateSchoolStudents = async (schoolId, studentIds) => {
  const config = getConfig();
  try {
    const response = await axios.put(
      `${config.API_BASE_URL}/unassignedSchoolStudents/${schoolId}`,
      { student_ids: studentIds }
    );
    return { success: true, data: response.data || [] };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to update school students"),
      details: error.message,
    };
  }
};

export const updateClassStudents = async (sectionId, studentIds) => {
  const config = getConfig();
  try {
    const response = await axios.put(
      `${config.API_BASE_URL}/schoolClassStudents/${sectionId}`,
      { student_ids: studentIds }
    );
    return { success: true, data: response.data || [] };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to update class students"),
      details: error.message,
    };
  }
};
