import { Button, Input, Modal, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormDanhGia from './Form';

const DanhGia = () => {
	const { reviews, getReviews, setSelectedRecord, isEdit, setVisible, setIsEdit, visible, addReply } =
		useModel('danh-gia');
	const { employees, getEmployees } = useModel('nhan-vien');
	const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
	const [expandedReview, setExpandedReview] = useState<string>('');

	useEffect(() => {
		getReviews();
		getEmployees();
	}, []);

	const handleAddReply = (reviewId: string) => {
		if (!replyContent[reviewId]?.trim()) {
			message.error('Vui lòng nhập nội dung phản hồi');
			return;
		}

		const review = reviews.find((r) => r.id === reviewId);
		if (!review) return;

		const employee = employees.find((e) => e.id === review.nhanvienId);
		const reply: DanhGia.Reply = {
			id: Date.now().toString(),
			nhanvienId: review.nhanvienId,
			nhanvienTen: employee?.ten,
			noidung: replyContent[reviewId],
			createdAt: new Date().toISOString(),
		};

		addReply(reviewId, reply);
		setReplyContent({ ...replyContent, [reviewId]: '' });
		message.success('Phản hồi thành công');
	};

	const renderStars = (rating: number) => {
		return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
	};

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
				Thêm đánh giá mới
			</Button>

			<div style={{ marginBottom: 24 }}>
				{reviews.map((review) => (
					<div
						key={review.id}
						style={{
							border: '1px solid #ddd',
							borderRadius: '4px',
							marginBottom: 16,
							overflow: 'hidden',
						}}
					>
						<div
							onClick={() => setExpandedReview(expandedReview === review.id ? '' : review.id || '')}
							style={{
								backgroundColor: '#fafafa',
								padding: 12,
								cursor: 'pointer',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<div>
								<span style={{ fontWeight: 'bold' }}>{review.khachhangTen}</span>
								<span style={{ marginLeft: 16 }}>{renderStars(review.rating || 0)}</span>
								<span style={{ marginLeft: 16, color: '#999', fontSize: '12px' }}>
									{review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : ''}
								</span>
							</div>
							<span style={{ color: '#999' }}>{expandedReview === review.id ? '▼' : '▶'}</span>
						</div>

						{expandedReview === review.id && (
							<div style={{ padding: 12 }}>
								<div style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 4, marginBottom: 16 }}>
									<p style={{ margin: 0 }}>{review.noidung}</p>
									<p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
										Nhân viên: <strong>{review.nhanvienTen}</strong>
									</p>
								</div>

								<div style={{ marginBottom: 16 }}>
									<h4>Phản hồi từ nhân viên:</h4>
									{review.replies && review.replies.length > 0 ? (
										<div>
											{review.replies.map((reply: DanhGia.Reply) => (
												<div
													key={reply.id}
													style={{
														backgroundColor: '#e6f7ff',
														padding: 12,
														borderRadius: 4,
														marginBottom: 8,
														borderLeft: '3px solid #1890ff',
													}}
												>
													<p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#1890ff' }}>
														{reply.nhanvienTen}
													</p>
													<p style={{ margin: 0 }}>{reply.noidung}</p>
													<p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#999' }}>
														{reply.createdAt ? new Date(reply.createdAt).toLocaleDateString('vi-VN') : ''}
													</p>
												</div>
											))}
										</div>
									) : (
										<p style={{ color: '#999' }}>Chưa có phản hồi</p>
									)}
								</div>

								<div style={{ display: 'flex', gap: 8 }}>
									<Input
										placeholder='Nhập phản hồi'
										value={replyContent[review.id || ''] || ''}
										onChange={(e) => setReplyContent({ ...replyContent, [review.id || '']: e.target.value })}
									/>
									<Button type='primary' onClick={() => handleAddReply(review.id || '')}>
										Phản hồi
									</Button>
								</div>

								<Space style={{ marginTop: 12 }}>
									<Button
										size='small'
										onClick={() => {
											setVisible(true);
											setSelectedRecord(review);
											setIsEdit(true);
										}}
									>
										Edit
									</Button>
									<Button
										size='small'
										type='primary'
										danger
										onClick={() => {
											Modal.confirm({
												title: 'Xác nhận xóa',
												content: 'Bạn có chắc muốn xóa đánh giá này?',
												okText: 'Xóa',
												cancelText: 'Hủy',
											});
										}}
									>
										Delete
									</Button>
								</Space>
							</div>
						)}
					</div>
				))}
			</div>

			{reviews.length === 0 && (
				<div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
					Chưa có đánh giá nào. Hãy thêm đánh giá mới.
				</div>
			)}

			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Cập nhật đánh giá' : 'Thêm đánh giá mới'}
				visible={visible}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<FormDanhGia
					onSuccess={() => {
						getReviews();
						setVisible(false);
					}}
				/>
			</Modal>
		</div>
	);
};

export default DanhGia;
