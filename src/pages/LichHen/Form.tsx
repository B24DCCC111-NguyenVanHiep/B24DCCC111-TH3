import { Button, DatePicker, Form, Input, Select, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormLichHen = ({ onSuccess }: { onSuccess?: () => void }) => {
	const [form] = Form.useForm();
	const { isEdit, selectedRecord, saveAppointment, checkConflict } = useModel('lich-hen');
	const { employees } = useModel('nhan-vien');
	const { services } = useModel('dich-vu');

	useEffect(() => {
		if (isEdit && selectedRecord) {
			form.setFieldsValue({
				khachhangTen: selectedRecord.khachhangTen,
				khachhangSDT: selectedRecord.khachhangSDT,
				khachhangEmail: selectedRecord.khachhangEmail,
				nhanvienId: selectedRecord.nhanvienId,
				dichvuId: selectedRecord.dichvuId,
				ngayHen: selectedRecord.ngayHen ? dayjs(selectedRecord.ngayHen) : undefined,
				gioHen: selectedRecord.gioHen,
				trangthai: selectedRecord.trangthai,
				ghichu: selectedRecord.ghichu,
			});
		} else {
			form.resetFields();
		}
	}, [isEdit, selectedRecord, form]);

	const handleSubmit = async (values: any) => {
		// Validate appointment date is not in the past
		if (dayjs(values.ngayHen).isBefore(dayjs().startOf('day'))) {
			message.error('Ngày hẹn không được là ngày trong quá khứ');
			return;
		}

		const selectedService = services.find((s) => s.id === values.dichvuId);
		if (!selectedService) {
			message.error('Vui lòng chọn dịch vụ');
			return;
		}

		const endTime = parseInt(values.gioHen.split(':')[0]) + (selectedService.thoiLuongPhut || 0) / 60;
		const endTimeStr = `${Math.floor(endTime)}:00`;

		// Check for conflicts
		if (
			checkConflict(
				values.nhanvienId,
				values.ngayHen.format('YYYY-MM-DD'),
				values.gioHen,
				endTimeStr,
				selectedRecord?.id
			)
		) {
			message.error('Nhân viên đã có lịch hẹn trong thời gian này');
			return;
		}

		const record: LichHen.Record = {
			...selectedRecord,
			khachhangTen: values.khachhangTen,
			khachhangSDT: values.khachhangSDT,
			khachhangEmail: values.khachhangEmail,
			nhanvienId: values.nhanvienId,
			nhanvienTen: employees.find((e) => e.id === values.nhanvienId)?.ten,
			dichvuId: values.dichvuId,
			dichvuTen: selectedService.ten,
			dichvuGia: selectedService.gia,
			thoiLuongPhut: selectedService.thoiLuongPhut,
			ngayHen: values.ngayHen.format('YYYY-MM-DD'),
			gioHen: values.gioHen,
			gioKetThuc: endTimeStr,
			trangthai: values.trangthai || 'pending',
			ghichu: values.ghichu,
			updatedAt: new Date().toISOString(),
		};

		saveAppointment(record);
		message.success(isEdit ? 'Cập nhật lịch hẹn thành công' : 'Tạo lịch hẹn thành công');
		onSuccess?.();
	};

	const hoursOptions = Array.from({ length: 24 }, (_, i) => ({
		label: `${i.toString().padStart(2, '0')}:00`,
		value: `${i.toString().padStart(2, '0')}:00`,
	}));

	return (
		<Form form={form} layout='vertical' onFinish={handleSubmit}>
			<Form.Item label='Tên khách hàng' name='khachhangTen' rules={[{ required: true }]}>
				<Input placeholder='Nhập tên khách hàng' />
			</Form.Item>

			<Form.Item label='Số điện thoại' name='khachhangSDT' rules={[{ required: true }]}>
				<Input placeholder='Nhập số điện thoại' />
			</Form.Item>

			<Form.Item label='Email' name='khachhangEmail'>
				<Input type='email' placeholder='Nhập email' />
			</Form.Item>

			<Form.Item label='Nhân viên' name='nhanvienId' rules={[{ required: true }]}>
				<Select placeholder='Chọn nhân viên' options={employees.map((e) => ({ label: e.ten, value: e.id }))} />
			</Form.Item>

			<Form.Item label='Dịch vụ' name='dichvuId' rules={[{ required: true }]}>
				<Select placeholder='Chọn dịch vụ' options={services.map((s) => ({ label: s.ten, value: s.id }))} />
			</Form.Item>

			<Form.Item label='Ngày hẹn' name='ngayHen' rules={[{ required: true }]}>
				<DatePicker style={{ width: '100%' }} disabledDate={(current) => current && current < dayjs().startOf('day')} />
			</Form.Item>

			<Form.Item label='Giờ hẹn' name='gioHen' rules={[{ required: true }]}>
				<Select placeholder='Chọn giờ' options={hoursOptions} />
			</Form.Item>

			<Form.Item label='Trạng thái' name='trangthai'>
				<Select
					placeholder='Chọn trạng thái'
					options={[
						{ label: 'Chờ duyệt', value: 'pending' },
						{ label: 'Xác nhận', value: 'confirmed' },
						{ label: 'Hoàn thành', value: 'completed' },
						{ label: 'Hủy', value: 'cancelled' },
					]}
				/>
			</Form.Item>

			<Form.Item label='Ghi chú' name='ghichu'>
				<Input.TextArea rows={3} placeholder='Ghi chú thêm' />
			</Form.Item>

			<Form.Item>
				<Button type='primary' htmlType='submit' block>
					{isEdit ? 'Cập nhật' : 'Tạo mới'}
				</Button>
			</Form.Item>
		</Form>
	);
};

export default FormLichHen;
