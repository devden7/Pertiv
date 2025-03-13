export const getStaffs = async () => {
  try {
    const response = await fetch('http://localhost:3001/admin/staffs');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error from getStaffs action ', error);
  }
};
