import type { IColumn } from '@/components/Table/typing';
import { Button, Modal, Space, Tag, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormLichHen from './Form';

const LichHen = () => {
	const { appointments, getAppointments, setRow, isEdit, setVisible, setIsEdit, visible, deleteAppointment } =
		useModel('lich-hen');
	const { getEmployees } = useModel('nhan-vien');
	const { getServices } = useModel('dich-vu');

	useEffect(() => {
		getAppointments();
		getEmployees();
		getServices();
	}, []);

	const renderStatus = (status: string) => {
		const colors: { [key: string]: string } = {
			pending: 'orange',
			confirmed: 'blue',
			completed: 'green',
			cancelled: 'red',
		};
		const labels: { [key: string]: string } = {
			pending: 'Chờ duyệt',
			confirmed: 'Xác nhận',
			completed: 'Hoàn thành',
			cancelled: 'Hủy',
		};
		return <Tag color={colors[status]}>{labels[status]}</Tag>;
	};

	const columns: IColumn<LichHen.Record>[] = [
		{
			title: 'Khách hàng',
			dataIndex: 'khachhangTen',
			key: 'khachhangTen',
			width: 150,
		},
		{
			title: 'SĐT',
			dataIndex: 'khachhangSDT',
			key: 'khachhangSDT',
			width: 120,
		},
		{
			title: 'Nhân viên',
			dataIndex: 'nhanvienTen',
			key: 'nhanvienTen',
			width: 120,
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'dichvuTen',
			key: 'dichvuTen',
			width: 120,
		},
		{
			title: 'Ngày hẹn',
			dataIndex: 'ngayHen',
			key: 'ngayHen',
			width: 120,
			sorter: (a, b) => new Date(a.ngayHen || '').getTime() - new Date(b.ngayHen || '').getTime(),
		},
		{
			title: 'Giờ hẹn',
			dataIndex: 'gioHen',
			key: 'gioHen',
			width: 100,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangthai',
			key: 'trangthai',
			width: 120,
			render: (trangthai) => renderStatus(trangthai),
		},
		{
			title: 'Action',
			width: 180,
			align: 'center',
			render: (record) => {
				return (
					<Space size='small'>
						<Button
							size='small'
							onClick={() => {
								setVisible(true);
								setRow(record);
								setIsEdit(true);
							}}
						>
							Edit
						</Button>
						<Button
							size='small'
							onClick={() => {
								Modal.confirm({
									title: 'Xác nhận xóa',
									content: 'Bạn có chắc muốn xóa lịch hẹn này?',
									okText: 'Xóa',
									cancelText: 'Hủy',
									onOk: () => {
										deleteAppointment(record.id || '');
										message.success('Xóa lịch hẹn thành công');
									},
								});
							}}
							type='primary'
							danger
						>
							Delete
						</Button>
					</Space>
				);
			},
		},
	];

	return (
		<div>
			<Button
				type='primary'
				style={{ marginBottom: 16 }}
				onClick={() => {
					setVisible(true);
					setIsEdit(false);
					setRow(undefined);
				}}
			>
				Đặt lịch hẹn mới
			</Button>

			<div style={{ overflowX: 'auto' }}>
				<table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
					<thead>
						<tr style={{ backgroundColor: '#fafafa' }}>
							{columns.map((col) => (
								<th key={col.key as string} style={{ padding: '12px', textAlign: (col.align as any) || 'left', borderBottom: '1px solid #ddd' }}>
									{col.title}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{appointments.map((record) => (
							<tr key={record.id} style={{ borderBottom: '1px solid #ddd' }}>
								<td style={{ padding: '12px', textAlign: 'left' }}>{record.khachhangTen}</td>
								<td style={{ padding: '12px', textAlign: 'left' }}>{record.khachhangSDT}</td>
								<td style={{ padding: '12px', textAlign: 'left' }}>{record.nhanvienTen}</td>
								<td style={{ padding: '12px', textAlign: 'left' }}>{record.dichvuTen}</td>
								<td style={{ padding: '12px', textAlign: 'left' }}>{record.ngayHen}</td>
								<td style={{ padding: '12px', textAlign: 'left' }}>{record.gioHen}</td>
								<td style={{ padding: '12px', textAlign: 'left' }}>{renderStatus(record.trangthai || 'pending')}</td>
								<td style={{ padding: '12px', textAlign: 'center' }}>
									<Space size='small'>
										<Button
											size='small'
											onClick={() => {
												setVisible(true);
												setRow(record);
												setIsEdit(true);
											}}
										>
											Edit
										</Button>
										<Button
											size='small'
											onClick={() => {
												Modal.confirm({
													title: 'Xác nhận xóa',
													content: 'Bạn có chắc muốn xóa lịch hẹn này?',
													okText: 'Xóa',
													cancelText: 'Hủy',
													onOk: () => {
														deleteAppointment(record.id || '');
														message.success('Xóa lịch hẹn thành công');
													},
												});
											}}
											type='primary'
											danger
										>
											Delete
										</Button>
									</Space>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Cập nhật lịch hẹn' : 'Đặt lịch hẹn mới'}
				visible={visible}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<FormLichHen
					onSuccess={() => {
						getAppointments();
						setVisible(false);
					}}
				/>
			</Modal>
		</div>
	);
};

export default LichHen;
