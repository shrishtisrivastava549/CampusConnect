const COURSES = {
  "B.Tech": {
    years: 4,
    departments: ["CSE", "IT", "ECE", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "AI & ML", "Data Science"]
  },
  MCA: { years: 2, departments: ["MCA"] },
  MBA: { years: 2, departments: ["MBA"] },
  BBA: { years: 3, departments: ["BBA"] },
  BCA: { years: 3, departments: ["BCA"] }
};

const YEAR_LABELS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const SEMESTER_LABELS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

function validateStudentAcademic({ Course, Department, AcademicYear, Semester }) {
  const course = COURSES[Course];
  if (!course) return "Please select a valid course.";
  if (!course.departments.includes(Department)) return "Department does not belong to the selected course.";
  const yearIndex = YEAR_LABELS.indexOf(AcademicYear);
  if (yearIndex < 0 || yearIndex >= course.years) return "Invalid academic year for the selected course.";
  const semesterIndex = SEMESTER_LABELS.indexOf(Semester);
  if (semesterIndex < yearIndex * 2 || semesterIndex > yearIndex * 2 + 1 || semesterIndex >= course.years * 2) {
    return "Semester does not belong to the selected academic year.";
  }
  return null;
}

module.exports = { COURSES, YEAR_LABELS, SEMESTER_LABELS, validateStudentAcademic };
