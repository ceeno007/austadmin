export const getCurrentAcademicSession = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
  
  // If current month is August or later, it's the start of a new academic year
  if (currentMonth >= 8) {
    return `${currentYear}/${currentYear + 1}`;
  }
  // If current month is before August, it's still the previous academic year
  return `${currentYear - 1}/${currentYear}`;
}; 