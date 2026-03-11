declare module LichHen {
	export interface Record {
		id?: string;
		khachhangTen?: string;
		khachhangSDT?: string;
		khachhangEmail?: string;
		nhanvienId?: string;
		nhanvienTen?: string;
		dichvuId?: string;
		dichvuTen?: string;
		dichvuGia?: number;
		thoiLuongPhut?: number;
		ngayHen?: string;
		gioHen?: string;
		gioKetThuc?: string;
		trangthai?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
		ghichu?: string;
		createdAt?: string;
		updatedAt?: string;
	}
}
