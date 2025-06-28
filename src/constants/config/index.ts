import {ArchiveBook, Award, BackwardItem, ElementEqual, HomeTrendUp, UserOctagon,} from 'iconsax-react';
import {IMenu} from "~/commons/interfaces";
import {TYPE_DATE} from "~/constants/config/enum";

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
	Banners = '/banners',
	Login = '/login',
	Orders = '/orders',
	Vouchers = '/vouchers',
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
		title: 'Banners',
		path: PATH.Banners,
		pathActive: [PATH.Banners],
		icon: Award,
	},
	{
		title: 'Vouchers',
		path: PATH.Vouchers,
		pathActive: [PATH.Vouchers],
		icon: Award,
	},
	{
		title: 'Đơn hàng',
		path: PATH.Orders,
		pathActive: [PATH.Orders],
		icon: ArchiveBook,
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
		icon: BackwardItem,
	},
	{
		title: 'Nhân viên',
		path: PATH.Employees,
		pathActive: [PATH.Employees],
		icon: UserOctagon,
	},
];

export const PageSize = [10, 20, 50, 100];

export const ListOptionFilterDate: {
	name: string;
	value: number;
}[] = [
	{
		name: 'Tất cả',
		value: TYPE_DATE.ALL,
	},
	{
		name: 'Hôm nay',
		value: TYPE_DATE.TODAY,
	},
	// {
	// 	name: 'Hôm qua',
	// 	value: TYPE_DATE.YESTERDAY,
	// },
	{
		name: 'Tuần này',
		value: TYPE_DATE.THIS_WEEK,
	},
	// {
	// 	name: 'Tuần trước',
	// 	value: TYPE_DATE.LAST_WEEK,
	// },
	// {
	// 	name: '7 ngày trước',
	// 	value: TYPE_DATE.LAST_7_DAYS,
	// },
	{
		name: 'Tháng này',
		value: TYPE_DATE.THIS_MONTH,
	},
	// {
	// 	name: 'Tháng trước',
	// 	value: TYPE_DATE.LAST_MONTH,
	// },
	{
		name: 'Năm này',
		value: TYPE_DATE.THIS_YEAR,
	},
	{
		name: 'Lựa chọn',
		value: TYPE_DATE.LUA_CHON,
	},
];