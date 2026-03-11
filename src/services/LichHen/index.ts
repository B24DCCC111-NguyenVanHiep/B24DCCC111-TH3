export const getLichHen = async () => {
	const data = JSON.parse(localStorage.getItem('lich-hen') || '[]');
	return { data };
};
