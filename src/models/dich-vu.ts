import { useState } from 'react';

export default () => {
	const [services, setServices] = useState<DichVu.Record[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [selectedRecord, setSelectedRecord] = useState<DichVu.Record>();
	const [loading, setLoading] = useState<boolean>(false);

	// Load data from localStorage
	const getServices = async () => {
		setLoading(true);
		const dataLocal: any = JSON.parse(localStorage.getItem('dich-vu') || '[]');
		setServices(dataLocal);
		setLoading(false);
	};

	// Add or Update service
	const saveService = (record: DichVu.Record) => {
		let newData = [...services];
		if (isEdit && selectedRecord?.id) {
			newData = newData.map((item) => (item.id === selectedRecord.id ? record : item));
		} else {
			record.id = Date.now().toString();
			newData.push(record);
		}
		setServices(newData);
		localStorage.setItem('dich-vu', JSON.stringify(newData));
		setVisible(false);
		setIsEdit(false);
		setSelectedRecord(undefined);
	};

	// Delete service
	const deleteService = (id: string) => {
		const newData = services.filter((item) => item.id !== id);
		setServices(newData);
		localStorage.setItem('dich-vu', JSON.stringify(newData));
	};

	return {
		services,
		setServices,
		visible,
		setVisible,
		isEdit,
		setIsEdit,
		selectedRecord,
		setSelectedRecord,
		loading,
		getServices,
		saveService,
		deleteService,
		setRow: setSelectedRecord,
	};
};
