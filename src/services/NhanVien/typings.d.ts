declare module NhanVien {
	export interface Record {
		id?: string;
		ten?: string;
		sdt?: string;
		email?: string;
		chuyenmon?: string;
		soKhachToiDa?: number;
		gioBatDau?: string;
		gioKetThuc?: string;
		ngayNghi?: string[];
		dichvuIds?: string[];
		rating?: number;
		soLuongDanhGia?: number;
		createdAt?: string;
		updatedAt?: string;
	}
}
