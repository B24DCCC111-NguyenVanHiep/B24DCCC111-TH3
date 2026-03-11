import { Button, Modal, Space, Statistic, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormNhanVien from './Form';

const NhanVien = () => {
	const { employees, getEmployees, setRow, isEdit, setVisible, setIsEdit, visible, deleteEmployee } =
		useModel('nhan-vien');
	const { getServices } = useModel('dich-vu');
	const { getReviews, getAverageRating } = useModel('danh-gia');

	useEffect(() => {
		getEmployees();
		getServices();
		getReviews();
	}, []);

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
				Thêm nhân viên mới
			</Button>

			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginBottom: 24 }}>
				{employees.map((employee) => (
					<div
						key={employee.id}
						style={{
							border: '1px solid #ddd',
							borderRadius: '4px',
							padding: '16px',
							backgroundColor: '#fff',
						}}
					>
						<h3>{employee.ten}</h3>
						<p style={{ color: '#666', fontSize: '12px' }}>SĐT: {employee.sdt}</p>
						<p style={{ color: '#666', fontSize: '12px' }}>Email: {employee.email}</p>
						<p style={{ color: '#666', fontSize: '12px' }}>Chuyên môn: {employee.chuyenmon}</p>
						<p style={{ color: '#666', fontSize: '12px' }}>
							Ca làm: {employee.gioBatDau} - {employee.gioKetThuc}
						</p>
						<p style={{ color: '#666', fontSize: '12px' }}>Giới hạn khách/ngày: {employee.soKhachToiDa}</p>

						<div style={{ marginTop: 12 }}>
							<Statistic
								title='Đánh giá trung bình'
								value={getAverageRating(employee.id || '')}
								precision={1}
								suffix='/ 5'
								valueStyle={{ color: '#faad14', fontSize: '18px' }}
							/>
						</div>

						<Space style={{ marginTop: 12, width: '100%' }}>
							<Button
								size='small'
								block
								onClick={() => {
									setVisible(true);
									setRow(employee);
									setIsEdit(true);
								}}
							>
								Edit
							</Button>
							<Button
								size='small'
								block
								onClick={() => {
									Modal.confirm({
										title: 'Xác nhận xóa',
										content: 'Bạn có chắc muốn xóa nhân viên này?',
										okText: 'Xóa',
										cancelText: 'Hủy',
										onOk: () => {
											deleteEmployee(employee.id || '');
											message.success('Xóa nhân viên thành công');
										},
									});
								}}
								type='primary'
								danger
							>
								Delete
							</Button>
						</Space>
					</div>
				))}
			</div>

			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
				visible={visible}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<FormNhanVien
					onSuccess={() => {
						getEmployees();
						setVisible(false);
					}}
				/>
			</Modal>
		</div>
	);
};

export default NhanVien;
