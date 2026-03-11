declare module DanhGia {
	export interface Reply {
		id?: string;
		nhanvienId?: string;
		nhanvienTen?: string;
		noidung?: string;
		createdAt?: string;
	}

	export interface Record {
		id?: string;
		lichhenId?: string;
		nhanvienId?: string;
		nhanvienTen?: string;
		khachhangTen?: string;
		rating?: number;
		noidung?: string;
		replies?: Reply[];
		createdAt?: string;
		updatedAt?: string;
	}
}
