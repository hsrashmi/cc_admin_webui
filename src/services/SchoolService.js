import { getAxiosInstance } from "../components/Utilities/AxiosUtils/AxiosInstance";
import { apiRequest } from "../components/Utilities/UtilFuncs";
import { getConfig } from "../config";

export const fetchTeachers = (schoolId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(
      `${getConfig().API_BASE_URL}/teacher/${schoolId}`
    );
    return response.data;
  }, "Failed to fetch teachers");
};

export const updateClass = (classData) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const classId = classData.id;
    await axios.put(`${getConfig().API_BASE_URL}/schoolClass/${classId}`, {
      id: classData.id,
      school_id: classData.schoolId,
      grade: classData.grade,
      section: classData.section,
    });
    await axios.put(
      `${getConfig().API_BASE_URL}/assignTeacherToClass/${
        classData.teacher_assignment_id
      }`,
      {
        id: classData.teacher_assignment_id,
        class_id: classId,
        user_id: classData.teacher,
      }
    );
    return { type: "edit" };
  }, "Failed to save class");
};

export const saveClass = (classData) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const responseClass = await axios.post(
      `${getConfig().API_BASE_URL}/schoolClass`,
      {
        school_id: classData.schoolId,
        grade: classData.grade,
        section: classData.section,
      }
    );
    const classId = responseClass.data.id;
    await axios.post(`${getConfig().API_BASE_URL}/assignTeacherToClass`, {
      class_id: classId,
      user_id: classData.teacher,
    });
    return { type: "add" };
  }, "Failed to save class");
};

export const fetchClassStudents = (sectionId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(
      `${getConfig().API_BASE_URL}/schoolClassStudents/${sectionId}`
    );
    return response.data || [];
  }, "Failed to fetch class students");
};

export const fetchUnassignedStudents = (schoolId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(
      `${getConfig().API_BASE_URL}/unassignedSchoolStudents/${schoolId}`
    );
    return response.data || [];
  }, "Failed to fetch unassigned students");
};

export const updateSchoolStudents = (schoolId, studentIds) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.put(
      `${getConfig().API_BASE_URL}/unassignedSchoolStudents/${schoolId}`,
      {
        student_ids: studentIds,
      }
    );
    return response.data || [];
  }, "Failed to update school students");
};

export const updateClassStudents = (sectionId, studentIds) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.put(
      `${getConfig().API_BASE_URL}/schoolClassStudents/${sectionId}`,
      {
        student_ids: studentIds,
      }
    );
    return response.data || [];
  }, "Failed to update class students");
};

export const fetchStates = () => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(`${getConfig().API_BASE_URL}/state`);
    return response.data;
  }, "Failed to fetch states");
};

export const fetchOrganizations = () => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(
      `${getConfig().API_BASE_URL}/organization`
    );
    return response.data;
  }, "Failed to fetch organizations");
};

export const fetchSchoolById = (schoolId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(
      `${getConfig().API_BASE_URL}/schoolDetails/${schoolId}`
    );
    return response.data;
  }, "Failed to fetch school details");
};

export const fetchZonesByState = (stateId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.post(
      `${getConfig().API_BASE_URL}/getZonesByParams`,
      {
        filters: { state_id: { "==": stateId } },
      }
    );
    return response.data;
  }, "Failed to fetch zones");
};

export const fetchDistrictsByZone = (zoneId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.post(
      `${getConfig().API_BASE_URL}/getDistrictsByParams`,
      {
        filters: { zone_id: { "==": zoneId } },
      }
    );
    return response.data;
  }, "Failed to fetch districts");
};

export const fetchBlocksByDistrict = (districtId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.post(
      `${getConfig().API_BASE_URL}/getBlocksByParams`,
      {
        filters: { district_id: { "==": districtId } },
      }
    );
    return response.data;
  }, "Failed to fetch blocks");
};

export const fetchSchoolsByBlock = (blockId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.post(
      `${getConfig().API_BASE_URL}/getSchoolsByParams`,
      {
        filters: { block_id: { "==": blockId } },
      }
    );
    return response.data;
  }, "Failed to fetch schools");
};

export const createSchool = (schoolData) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.post(
      `${getConfig().API_BASE_URL}/school`,
      schoolData
    );
    return response.data;
  }, "Failed to create school");
};

export const updateSchool = (schoolId, schoolData) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.put(
      `${getConfig().API_BASE_URL}/school/${schoolId}`,
      schoolData
    );
    return response.data;
  }, "Failed to update school");
};

export const createSection = (sectionData) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.post(`${getConfig().API_BASE_URL}/sections`, {
      schoolId: sectionData.schoolId,
      section: sectionData.section,
      teacher: sectionData.teacher,
      students: sectionData.students,
    });
    return response.data;
  }, "Failed to create section");
};

export const fetchSchoolClasses = (schoolId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(
      `${getConfig().API_BASE_URL}/schoolClass/${schoolId}`
    );
    return response.data;
  }, "Failed to fetch school classes");
};

export const deleteSchoolClass = (classId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    await axios.delete(`${getConfig().API_BASE_URL}/schoolClass/${classId}`);
    return null;
  }, "Failed to delete class");
};

export const deleteUserRoleByField = (fieldName, fieldValue) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    await axios.delete(`${getConfig().API_BASE_URL}/userRoleByField/`, {
      params: {
        field_name: fieldName,
        field_value: fieldValue,
      },
    });
    return null;
  }, "Failed to delete user role");
};

export const fetchAllSchoolDetails = (params) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.post(
      `${getConfig().API_BASE_URL}/allSchoolDetails`,
      params
    );
    return response.data;
  }, "Failed to fetch school details");
};
