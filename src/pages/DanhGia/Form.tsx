import { Button, Form, Input, InputNumber, Select, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormDanhGia = ({ onSuccess }: { onSuccess?: () => void }) => {
	const [form] = Form.useForm();
	const { isEdit, selectedRecord, saveReview } = useModel('danh-gia');
	const { appointments, getAppointments } = useModel('lich-hen');

	useEffect(() => {
		getAppointments();
	}, []);

	useEffect(() => {
		if (isEdit && selectedRecord) {
			form.setFieldsValue({
				lichhenId: selectedRecord.lichhenId,
				nhanvienId: selectedRecord.nhanvienId,
				khachhangTen: selectedRecord.khachhangTen,
				rating: selectedRecord.rating,
				noidung: selectedRecord.noidung,
			});
		} else {
			form.resetFields();
		}
	}, [isEdit, selectedRecord, form]);

	const handleSubmit = async (values: any) => {
		const appointment = appointments.find((a) => a.id === values.lichhenId);
		if (!appointment) {
			message.error('Lịch hẹn không hợp lệ');
			return;
		}

		const record: DanhGia.Record = {
			...selectedRecord,
			lichhenId: values.lichhenId,
			nhanvienId: appointment.nhanvienId,
			nhanvienTen: appointment.nhanvienTen,
			khachhangTen: appointment.khachhangTen,
			rating: values.rating,
			noidung: values.noidung,
			updatedAt: new Date().toISOString(),
		};

		saveReview(record);
		message.success(isEdit ? 'Cập nhật đánh giá thành công' : 'Tạo đánh giá thành công');
		onSuccess?.();
	};

	// Get completed appointments
	const completedAppointments = appointments.filter((a) => a.trangthai === 'completed');

	return (
		<Form form={form} layout='vertical' onFinish={handleSubmit}>
			<Form.Item label='Lịch hẹn' name='lichhenId' rules={[{ required: true }]}>
				<Select
					placeholder='Chọn lịch hẹn'
					options={completedAppointments.map((a) => ({
						label: `${a.khachhangTen} - ${a.nhanvienTen} - ${a.ngayHen}`,
						value: a.id,
					}))}
				/>
			</Form.Item>

			<Form.Item label='Đánh giá (1-5 sao)' name='rating' rules={[{ required: true }]}>
				<InputNumber min={1} max={5} placeholder='Nhập đánh giá' style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item label='Nội dung đánh giá' name='noidung' rules={[{ required: true }]}>
				<Input.TextArea rows={3} placeholder='Nhập nội dung đánh giá' />
			</Form.Item>

			<Form.Item>
				<Button type='primary' htmlType='submit' block>
					{isEdit ? 'Cập nhật' : 'Tạo mới'}
				</Button>
			</Form.Item>
		</Form>
	);
};

export default FormDanhGia;
