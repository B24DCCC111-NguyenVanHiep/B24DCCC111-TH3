export const getServices = async () => {
	const data = JSON.parse(localStorage.getItem('dich-vu') || '[]');
	return { data };
};
