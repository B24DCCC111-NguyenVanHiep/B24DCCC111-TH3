declare module DichVu {
	export interface Record {
		id?: string;
		ten?: string;
		moTa?: string;
		gia?: number;
		thoiLuongPhut?: number;
		nhanvienIds?: string[];
		trangthai?: 'active' | 'inactive';
		createdAt?: string;
		updatedAt?: string;
	}
}
