import { useState } from 'react';

export default () => {
	const [reviews, setReviews] = useState<DanhGia.Record[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [selectedRecord, setSelectedRecord] = useState<DanhGia.Record>();
	const [loading, setLoading] = useState<boolean>(false);

	// Load data from localStorage
	const getReviews = async () => {
		setLoading(true);
		const dataLocal: any = JSON.parse(localStorage.getItem('danh-gia') || '[]');
		setReviews(dataLocal);
		setLoading(false);
	};

	// Add or Update review
	const saveReview = (record: DanhGia.Record) => {
		let newData = [...reviews];
		if (isEdit && selectedRecord?.id) {
			newData = newData.map((item) => (item.id === selectedRecord.id ? record : item));
		} else {
			record.id = Date.now().toString();
			newData.push(record);
		}
		setReviews(newData);
		localStorage.setItem('danh-gia', JSON.stringify(newData));
		setVisible(false);
		setIsEdit(false);
		setSelectedRecord(undefined);
	};

	// Add reply to review
	const addReply = (reviewId: string, reply: DanhGia.Reply) => {
		const newData = reviews.map((item) => {
			if (item.id === reviewId) {
				return {
					...item,
					replies: [...(item.replies || []), reply],
				};
			}
			return item;
		});
		setReviews(newData);
		localStorage.setItem('danh-gia', JSON.stringify(newData));
	};

	// Get average rating for employee
	const getAverageRating = (employeeId: string): number => {
		const employeeReviews = reviews.filter((item) => item.nhanvienId === employeeId);
		if (employeeReviews.length === 0) return 0;
		const sum = employeeReviews.reduce((acc, item) => acc + (item.rating || 0), 0);
		return parseFloat((sum / employeeReviews.length).toFixed(2));
	};

	return {
		reviews,
		setReviews,
		visible,
		setVisible,
		isEdit,
		setIsEdit,
		selectedRecord,
		setSelectedRecord,
		loading,
		getReviews,
		saveReview,
		addReply,
		getAverageRating,
		setRow: setSelectedRecord,
	};
};
