import { Card, DatePicker, Row, Col, Statistic, Table, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ThongKe = () => {
	const { appointments, getAppointments } = useModel('lich-hen');
	const { employees, getEmployees } = useModel('nhan-vien');
	const { getServices } = useModel('dich-vu');
	const { getAverageRating } = useModel('danh-gia');

	const [startDate, setStartDate] = useState<any>(dayjs().startOf('month'));
	const [endDate, setEndDate] = useState<any>(dayjs().endOf('month'));
	const [selectedEmployee, setSelectedEmployee] = useState<string>('');

	useEffect(() => {
		getAppointments();
		getEmployees();
		getServices();
	}, []);

	// Filter data by date range
	const filteredAppointments = appointments.filter((a) => {
		const date = dayjs(a.ngayHen);
		return date.isAfter(startDate.subtract(1, 'day')) && date.isBefore(endDate.add(1, 'day'));
	});

	// Filter by employee if selected
	const appointmentsByEmployee = selectedEmployee
		? filteredAppointments.filter((a) => a.nhanvienId === selectedEmployee)
		: filteredAppointments;

	// Calculate statistics
	const totalAppointments = appointmentsByEmployee.length;
	const completedAppointments = appointmentsByEmployee.filter((a) => a.trangthai === 'completed').length;
	const totalRevenue = appointmentsByEmployee
		.filter((a) => a.trangthai === 'completed')
		.reduce((sum, a) => sum + (a.dichvuGia || 0), 0);

	// Group appointments by day
	const appointmentsByDay = appointmentsByEmployee.reduce((acc: Record<string, number>, a) => {
		const day = a.ngayHen || '';
		acc[day] = (acc[day] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	// Group revenue by service
	const revenueByService = appointmentsByEmployee
		.filter((a) => a.trangthai === 'completed')
		.reduce((acc: any, a) => {
			const service = a.dichvuTen || 'Unknown';
			if (!acc[service]) {
				acc[service] = { count: 0, revenue: 0, serviceId: a.dichvuId };
			}
			acc[service].count += 1;
			acc[service].revenue += a.dichvuGia || 0;
			return acc;
		}, {});

	// Group appointments by employee
	const appointmentsByEmployeeData = filteredAppointments.reduce((acc: Record<string, any>, a) => {
		const empId = a.nhanvienId || '';
		if (!acc[empId]) {
			acc[empId] = { count: 0, revenue: 0, completed: 0, employeeName: a.nhanvienTen };
		}
		acc[empId].count += 1;
		if (a.trangthai === 'completed') {
			acc[empId].completed += 1;
			acc[empId].revenue += a.dichvuGia || 0;
		}
		return acc;
	}, {} as Record<string, any>);

	const dayColumns = [
		{
			title: 'Ngày',
			dataIndex: 'day',
			key: 'day',
		},
		{
			title: 'Số lượng lịch hẹn',
			dataIndex: 'count',
			key: 'count',
			sorter: (a: any, b: any) => b.count - a.count,
		},
	];

	const serviceColumns = [
		{
			title: 'Dịch vụ',
			dataIndex: 'service',
			key: 'service',
		},
		{
			title: 'Số lượng',
			dataIndex: 'count',
			key: 'count',
		},
		{
			title: 'Doanh thu',
			dataIndex: 'revenue',
			key: 'revenue',
			render: (revenue: number) => revenue.toLocaleString() + ' ₫',
		},
	];

	const employeeColumns = [
		{
			title: 'Nhân viên',
			dataIndex: 'employeeName',
			key: 'employeeName',
		},
		{
			title: 'Tổng lịch hẹn',
			dataIndex: 'count',
			key: 'count',
		},
		{
			title: 'Hoàn thành',
			dataIndex: 'completed',
			key: 'completed',
		},
		{
			title: 'Doanh thu',
			dataIndex: 'revenue',
			key: 'revenue',
			render: (revenue: number) => revenue.toLocaleString() + ' ₫',
		},
		{
			title: 'Đánh giá TB',
			key: 'rating',
			render: (_: any, record: any) => {
				const empId = Object.keys(appointmentsByEmployeeData).find(
					(key) => appointmentsByEmployeeData[key].employeeName === record.employeeName
				);
				return empId ? getAverageRating(empId).toFixed(1) + '⭐' : 'N/A';
			},
		},
	];

	return (
		<div>
			<Card style={{ marginBottom: 24 }}>
				<h2>Bộ lọc</h2>
				<Row gutter={16}>
					<Col span={8}>
						<label>Từ ngày:</label>
						<DatePicker
							value={startDate}
							onChange={(date) => setStartDate(date)}
							style={{ width: '100%', marginTop: 8 }}
						/>
					</Col>
					<Col span={8}>
						<label>Đến ngày:</label>
						<DatePicker
							value={endDate}
							onChange={(date) => setEndDate(date)}
							style={{ width: '100%', marginTop: 8 }}
						/>
					</Col>
					<Col span={8}>
						<label>Nhân viên:</label>
						<Select
							allowClear
							placeholder='Chọn nhân viên'
							value={selectedEmployee}
							onChange={(value) => setSelectedEmployee(value || '')}
							options={employees.map((e) => ({ label: e.ten, value: e.id }))}
							style={{ width: '100%', marginTop: 8 }}
						/>
					</Col>
				</Row>
			</Card>

			<Row gutter={16} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Tổng lịch hẹn'
							value={totalAppointments}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Hoàn thành'
							value={completedAppointments}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Doanh thu'
							value={totalRevenue}
							suffix='₫'
							valueStyle={{ color: '#faad14' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Tỉ lệ hoàn thành'
							value={totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(1) : 0}
							suffix='%'
							valueStyle={{ color: '#ff7a45' }}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={16} style={{ marginBottom: 24 }}>
				<Col xs={24} lg={12}>
					<Card title='Lịch hẹn theo ngày'>
						<Table
							columns={dayColumns}
							dataSource={Object.entries(appointmentsByDay).map(([day, count]) => ({
								key: day,
								day,
								count,
							}))}
							pagination={false}
							size='small'
						/>
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title='Doanh thu theo dịch vụ'>
						<Table
							columns={serviceColumns}
							dataSource={Object.entries(revenueByService).map(([service, data]: any) => ({
								key: service,
								service,
								count: data.count,
								revenue: data.revenue,
							}))}
							pagination={false}
							size='small'
						/>
					</Card>
				</Col>
			</Row>

			<Card title='Thống kê theo nhân viên'>
				<Table
					columns={employeeColumns as any}
					dataSource={Object.entries(appointmentsByEmployeeData).map(([empId, data]: any) => ({
						...data,
						key: empId,
					}))}
					pagination={false}
					size='small'
				/>
			</Card>
		</div>
	);
};

export default ThongKe;
