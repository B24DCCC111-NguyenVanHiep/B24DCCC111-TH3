export const getReviews = async () => {
	const data = JSON.parse(localStorage.getItem('danh-gia') || '[]');
	return { data };
};
