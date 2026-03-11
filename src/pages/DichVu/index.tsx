import { Button, Modal, Space, Tag, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormDichVu from './Form';

const DichVu = () => {
	const { services, getServices, isEdit, setVisible, setIsEdit, visible, deleteService, setSelectedRecord } =
		useModel('dich-vu');
	const { employees, getEmployees } = useModel('nhan-vien');

	useEffect(() => {
		getServices();
		getEmployees();
	}, []);

	return (
		<div>
			<Button
				type='primary'
				style={{ marginBottom: 16 }}
				onClick={() => {
					setVisible(true);
					setIsEdit(false);
					setSelectedRecord(undefined);
				}}
			>
				Thêm dịch vụ mới
			</Button>

			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
				{services.map((service) => (
					<div
						key={service.id}
						style={{
							border: '1px solid #ddd',
							borderRadius: '4px',
							padding: '16px',
							backgroundColor: '#fff',
						}}
					>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
							<h3 style={{ margin: 0 }}>{service.ten}</h3>
							<Tag color={service.trangthai === 'active' ? 'green' : 'red'}>
								{service.trangthai === 'active' ? 'Hoạt động' : 'Không hoạt động'}
							</Tag>
						</div>

						<p style={{ color: '#666', fontSize: '12px', marginTop: 8 }}>{service.moTa}</p>

						<div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
							<div style={{ backgroundColor: '#f5f5f5', padding: 8, borderRadius: 4 }}>
								<span style={{ fontSize: '12px', color: '#999' }}>Giá:</span>
								<p style={{ fontSize: '16px', fontWeight: 'bold', margin: '4px 0' }}>
									{service.gia?.toLocaleString()} ₫
								</p>
							</div>
							<div style={{ backgroundColor: '#f5f5f5', padding: 8, borderRadius: 4 }}>
								<span style={{ fontSize: '12px', color: '#999' }}>Thời lượng:</span>
								<p style={{ fontSize: '16px', fontWeight: 'bold', margin: '4px 0' }}>
									{service.thoiLuongPhut} phút
								</p>
							</div>
						</div>

						{service.nhanvienIds && service.nhanvienIds.length > 0 && (
							<div style={{ marginTop: 12 }}>
								<span style={{ fontSize: '12px', color: '#999' }}>Nhân viên phục vụ:</span>
								<div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
									{service.nhanvienIds.map((empId) => {
										const emp = employees.find((e) => e.id === empId);
										return (
											<Tag key={empId} color='blue'>
												{emp?.ten}
											</Tag>
										);
									})}
								</div>
							</div>
						)}

						<Space style={{ marginTop: 12, width: '100%' }}>
							<Button
								size='small'
								block
								onClick={() => {
									setVisible(true);
									setSelectedRecord(service);
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
										content: 'Bạn có chắc muốn xóa dịch vụ này?',
										okText: 'Xóa',
										cancelText: 'Hủy',
										onOk: () => {
											deleteService(service.id || '');
											message.success('Xóa dịch vụ thành công');
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

			{services.length === 0 && (
				<div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
					Chưa có dịch vụ nào. Hãy thêm dịch vụ mới.
				</div>
			)}

			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}
				visible={visible}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<FormDichVu
					onSuccess={() => {
						getServices();
						setVisible(false);
					}}
				/>
			</Modal>
		</div>
	);
};

export default DichVu;
