import { useState } from 'react';

export default () => {
	const [appointments, setAppointments] = useState<LichHen.Record[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [selectedRecord, setSelectedRecord] = useState<LichHen.Record>();
	const [loading, setLoading] = useState<boolean>(false);

	// Load data from localStorage
	const getAppointments = async () => {
		setLoading(true);
		const dataLocal: any = JSON.parse(localStorage.getItem('lich-hen') || '[]');
		setAppointments(dataLocal);
		setLoading(false);
	};

	// Add or Update appointment
	const saveAppointment = (record: LichHen.Record) => {
		let newData = [...appointments];
		if (isEdit && selectedRecord?.id) {
			newData = newData.map((item) => (item.id === selectedRecord.id ? record : item));
		} else {
			record.id = Date.now().toString();
			newData.push(record);
		}
		setAppointments(newData);
		localStorage.setItem('lich-hen', JSON.stringify(newData));
		setVisible(false);
		setIsEdit(false);
		setSelectedRecord(undefined);
	};

	// Delete appointment
	const deleteAppointment = (id: string) => {
		const newData = appointments.filter((item) => item.id !== id);
		setAppointments(newData);
		localStorage.setItem('lich-hen', JSON.stringify(newData));
	};

	// Check appointment conflict
	const checkConflict = (
		employeeId: string,
		appointmentDate: string,
		startTime: string,
		endTime: string,
		excludeId?: string
	): boolean => {
		return appointments.some((item) => {
			if (excludeId && item.id === excludeId) return false;
			if (item.nhanvienId !== employeeId) return false;
			if (item.ngayHen !== appointmentDate) return false;

			const itemStart = parseInt((item.gioHen || '0:00').split(':')[0]);
			const itemEnd = itemStart + (item.thoiLuongPhut || 0) / 60;
			const newStart = parseInt(startTime.split(':')[0]);
			const newEnd = parseInt(endTime.split(':')[0]);

			return (newStart < itemEnd && newEnd > itemStart);
		});
	};

	return {
		appointments,
		setAppointments,
		visible,
		setVisible,
		isEdit,
		setIsEdit,
		selectedRecord,
		setSelectedRecord,
		loading,
		getAppointments,
		saveAppointment,
		deleteAppointment,
		checkConflict,
		setRow: setSelectedRecord,
	};
};
