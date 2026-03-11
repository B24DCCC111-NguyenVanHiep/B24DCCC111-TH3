import { Button, Form, Input, InputNumber, Select, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormNhanVien = ({ onSuccess }: { onSuccess?: () => void }) => {
	const [form] = Form.useForm();
	const { isEdit, selectedRecord, saveEmployee } = useModel('nhan-vien');
	const { services } = useModel('dich-vu');

	useEffect(() => {
		if (isEdit && selectedRecord) {
			form.setFieldsValue({
				ten: selectedRecord.ten,
				sdt: selectedRecord.sdt,
				email: selectedRecord.email,
				chuyenmon: selectedRecord.chuyenmon,
				soKhachToiDa: selectedRecord.soKhachToiDa,
				gioBatDau: selectedRecord.gioBatDau ? dayjs(selectedRecord.gioBatDau, 'HH:mm') : undefined,
				gioKetThuc: selectedRecord.gioKetThuc ? dayjs(selectedRecord.gioKetThuc, 'HH:mm') : undefined,
				dichvuIds: selectedRecord.dichvuIds,
			});
		} else {
			form.resetFields();
		}
	}, [isEdit, selectedRecord, form]);

	const handleSubmit = async (values: any) => {
		const record: NhanVien.Record = {
			...selectedRecord,
			ten: values.ten,
			sdt: values.sdt,
			email: values.email,
			chuyenmon: values.chuyenmon,
			soKhachToiDa: values.soKhachToiDa || 5,
			gioBatDau: values.gioBatDau?.format('HH:mm'),
			gioKetThuc: values.gioKetThuc?.format('HH:mm'),
			dichvuIds: values.dichvuIds,
			updatedAt: new Date().toISOString(),
		};

		saveEmployee(record);
		message.success(isEdit ? 'Cập nhật nhân viên thành công' : 'Tạo nhân viên thành công');
		onSuccess?.();
	};

	return (
		<Form form={form} layout='vertical' onFinish={handleSubmit}>
			<Form.Item label='Tên nhân viên' name='ten' rules={[{ required: true }]}>
				<Input placeholder='Nhập tên nhân viên' />
			</Form.Item>

			<Form.Item label='Số điện thoại' name='sdt' rules={[{ required: true }]}>
				<Input placeholder='Nhập số điện thoại' />
			</Form.Item>

			<Form.Item label='Email' name='email'>
				<Input type='email' placeholder='Nhập email' />
			</Form.Item>

			<Form.Item label='Chuyên môn' name='chuyenmon'>
				<Input placeholder='Nhập chuyên môn' />
			</Form.Item>

			<Form.Item label='Số khách giới hạn/ngày' name='soKhachToiDa'>
				<InputNumber min={1} max={20} placeholder='Nhập số khách tối đa' style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item label='Giờ bắt đầu làm việc' name='gioBatDau'>
				<TimePicker format='HH:mm' style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item label='Giờ kết thúc làm việc' name='gioKetThuc'>
				<TimePicker format='HH:mm' style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item label='Dịch vụ phục vụ' name='dichvuIds'>
				<Select
					mode='multiple'
					placeholder='Chọn dịch vụ'
					options={services.map((s) => ({ label: s.ten, value: s.id }))}
				/>
			</Form.Item>

			<Form.Item>
				<Button type='primary' htmlType='submit' block>
					{isEdit ? 'Cập nhật' : 'Tạo mới'}
				</Button>
			</Form.Item>
		</Form>
	);
};

export default FormNhanVien;
