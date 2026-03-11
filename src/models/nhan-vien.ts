import { useState } from 'react';

export default () => {
	const [employees, setEmployees] = useState<NhanVien.Record[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [selectedRecord, setSelectedRecord] = useState<NhanVien.Record>();
	const [loading, setLoading] = useState<boolean>(false);

	// Load data from localStorage
	const getEmployees = async () => {
		setLoading(true);
		const dataLocal: any = JSON.parse(localStorage.getItem('nhan-vien') || '[]');
		setEmployees(dataLocal);
		setLoading(false);
	};

	// Add or Update employee
	const saveEmployee = (record: NhanVien.Record) => {
		let newData = [...employees];
		if (isEdit && selectedRecord?.id) {
			newData = newData.map((item) => (item.id === selectedRecord.id ? record : item));
		} else {
			record.id = Date.now().toString();
			newData.push(record);
		}
		setEmployees(newData);
		localStorage.setItem('nhan-vien', JSON.stringify(newData));
		setVisible(false);
		setIsEdit(false);
		setSelectedRecord(undefined);
	};

	// Delete employee
	const deleteEmployee = (id: string) => {
		const newData = employees.filter((item) => item.id !== id);
		setEmployees(newData);
		localStorage.setItem('nhan-vien', JSON.stringify(newData));
	};

	return {
		employees,
		setEmployees,
		visible,
		setVisible,
		isEdit,
		setIsEdit,
		selectedRecord,
		setSelectedRecord,
		loading,
		getEmployees,
		saveEmployee,
		deleteEmployee,
		setRow: setSelectedRecord,
	};
};
