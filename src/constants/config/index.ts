import {
	ArchiveBook,
	Buildings2,
	Calendar,
	Data,
	DocumentForward,
	DocumentText1,
	ElementEqual, HomeTrendUp,
	Moneys,
	Note,
	Receipt21,
	ReceiptItem,
	TagUser,
	UserOctagon,
} from 'iconsax-react';
import {IMenu} from "~/commons/interfaces";

export const APP_NAME = 'ADMIN_EYD';

export const KEY_STORAGE_TOKEN = APP_NAME + '_TOKEN';

export const MAXIMUM_FILE = 10; //MB

export const allowFiles = [
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'image/jpeg',
	'image/jpg',
	'image/png',
];

export enum PATH {
	Home = '/',
	Overview = '/overview',
	Login = '/login',
	Orders = '/orders',
	Categories = '/categories',
	Products = '/products',
	Employees = '/employees',
}

export const Menu: IMenu[] = [
	{
		title: 'Tổng quan',
		path: PATH.Overview,
		pathActive: [PATH.Home, PATH.Overview],
		icon: HomeTrendUp,
	},
	{
		title: 'Đơn hàng',
		path: PATH.Orders,
		pathActive: [PATH.Orders],
		icon: ElementEqual,
	},
	{
		title: 'Danh mục',
		path: PATH.Categories,
		pathActive: [PATH.Categories],
		icon: ElementEqual,
	},
	{
		title: 'Sản phẩm',
		path: PATH.Products,
		pathActive: [PATH.Products],
		icon: ElementEqual,
	},
	{
		title: 'Nhân viên',
		path: PATH.Employees,
		pathActive: [PATH.Employees],
		icon: ElementEqual,
	},
];

export const PageSize = [10, 20, 50, 100];
