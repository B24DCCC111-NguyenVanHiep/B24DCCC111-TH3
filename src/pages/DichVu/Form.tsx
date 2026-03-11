import { Button, Form, Input, InputNumber, Select, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormDichVu = ({ onSuccess }: { onSuccess?: () => void }) => {
	const [form] = Form.useForm();
	const { isEdit, selectedRecord, saveService } = useModel('dich-vu');
	const { employees } = useModel('nhan-vien');

	useEffect(() => {
		if (isEdit && selectedRecord) {
			form.setFieldsValue({
				ten: selectedRecord.ten,
				moTa: selectedRecord.moTa,
				gia: selectedRecord.gia,
				thoiLuongPhut: selectedRecord.thoiLuongPhut,
				nhanvienIds: selectedRecord.nhanvienIds,
				trangthai: selectedRecord.trangthai,
			});
		} else {
			form.resetFields();
		}
	}, [isEdit, selectedRecord, form]);

	const handleSubmit = async (values: any) => {
		const record: DichVu.Record = {
			...selectedRecord,
			ten: values.ten,
			moTa: values.moTa,
			gia: values.gia,
			thoiLuongPhut: values.thoiLuongPhut,
			nhanvienIds: values.nhanvienIds,
			trangthai: values.trangthai || 'active',
			updatedAt: new Date().toISOString(),
		};

		saveService(record);
		message.success(isEdit ? 'Cập nhật dịch vụ thành công' : 'Tạo dịch vụ thành công');
		onSuccess?.();
	};

	return (
		<Form form={form} layout='vertical' onFinish={handleSubmit}>
			<Form.Item label='Tên dịch vụ' name='ten' rules={[{ required: true }]}>
				<Input placeholder='Nhập tên dịch vụ' />
			</Form.Item>

			<Form.Item label='Mô tả' name='moTa'>
				<Input.TextArea rows={3} placeholder='Mô tả điều đặc biệt về dịch vụ' />
			</Form.Item>

			<Form.Item label='Giá (VND)' name='gia' rules={[{ required: true }]}>
				<InputNumber min={0} placeholder='Nhập giá' style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item label='Thời lượng (phút)' name='thoiLuongPhut' rules={[{ required: true }]}>
				<InputNumber min={15} step={15} placeholder='Nhập thời lượng' style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item label='Nhân viên phục vụ' name='nhanvienIds'>
				<Select
					mode='multiple'
					placeholder='Chọn nhân viên'
					options={employees.map((e) => ({ label: e.ten, value: e.id }))}
				/>
			</Form.Item>

			<Form.Item label='Trạng thái' name='trangthai'>
				<Select
					placeholder='Chọn trạng thái'
					options={[
						{ label: 'Hoạt động', value: 'active' },
						{ label: 'Không hoạt động', value: 'inactive' },
					]}
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

export default FormDichVu;
