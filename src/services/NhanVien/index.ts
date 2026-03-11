export const getEmployees = async () => {
	const data = JSON.parse(localStorage.getItem('nhan-vien') || '[]');
	return { data };
};
