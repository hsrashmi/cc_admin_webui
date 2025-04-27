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

export const fetchStates = async () => {
  const config = getConfig();
  try {
    const response = await axios.get(`${config.API_BASE_URL}/state`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch states"),
      details: error.message,
    };
  }
};

export const fetchOrganizations = async () => {
  const config = getConfig();
  try {
    const response = await axios.get(`${config.API_BASE_URL}/organization`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch organizations"),
      details: error.message,
    };
  }
};

export const fetchSchoolById = async (schoolId) => {
  const config = getConfig();
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/schoolDetails/${schoolId}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch school details"),
      details: error.message,
    };
  }
};

export const fetchZonesByState = async (stateId) => {
  const config = getConfig();
  try {
    const response = await axios.post(
      `${config.API_BASE_URL}/getZonesByParams`,
      {
        filters: { state_id: { "==": stateId } },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch zones"),
      details: error.message,
    };
  }
};

export const fetchDistrictsByZone = async (zoneId) => {
  const config = getConfig();
  try {
    const response = await axios.post(
      `${config.API_BASE_URL}/getDistrictsByParams`,
      {
        filters: { zone_id: { "==": zoneId } },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch districts"),
      details: error.message,
    };
  }
};

export const fetchBlocksByDistrict = async (districtId) => {
  const config = getConfig();
  try {
    const response = await axios.post(
      `${config.API_BASE_URL}/getBlocksByParams`,
      {
        filters: { district_id: { "==": districtId } },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch blocks"),
      details: error.message,
    };
  }
};

export const fetchSchoolsByBlock = async (blockId) => {
  const config = getConfig();
  try {
    const response = await axios.post(
      `${config.API_BASE_URL}/getSchoolsByParams`,
      {
        filters: { block_id: { "==": blockId } },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch schools"),
      details: error.message,
    };
  }
};

export const createSchool = async (schoolData) => {
  const config = getConfig();
  try {
    const response = await axios.post(
      `${config.API_BASE_URL}/school`,
      schoolData
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to create school"),
      details: error.message,
    };
  }
};

export const updateSchool = async (schoolId, schoolData) => {
  const config = getConfig();
  try {
    const response = await axios.put(
      `${config.API_BASE_URL}/school/${schoolId}`,
      schoolData
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to update school"),
      details: error.message,
    };
  }
};

export const createSection = async (sectionData) => {
  const config = getConfig();
  try {
    const response = await axios.post(`${config.API_BASE_URL}/sections`, {
      schoolId: sectionData.schoolId,
      section: sectionData.section,
      teacher: sectionData.teacher,
      students: sectionData.students,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to create section"),
      details: error.message,
    };
  }
};

export const fetchSchoolClasses = async (schoolId) => {
  const config = getConfig();
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/schoolClass/${schoolId}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch school classes"),
      details: error.message,
    };
  }
};

export const deleteSchoolClass = async (classId) => {
  const config = getConfig();
  try {
    await axios.delete(`${config.API_BASE_URL}/schoolClass/${classId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to delete class"),
      details: error.message,
    };
  }
};

export const deleteUserRoleByField = async (fieldName, fieldValue) => {
  const config = getConfig();
  try {
    await axios.delete(`${config.API_BASE_URL}/userRoleByField/`, {
      params: {
        field_name: fieldName,
        field_value: fieldValue,
      },
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to delete user role"),
      details: error.message,
    };
  }
};

export const fetchAllSchoolDetails = async (params) => {
  const config = getConfig();
  try {
    const response = await axios.post(
      `${config.API_BASE_URL}/allSchoolDetails`,
      params
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch school details"),
      details: error.message,
    };
  }
};
