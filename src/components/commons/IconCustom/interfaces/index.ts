export interface PropsIconCustom {
	icon: React.ReactNode;
	tooltip: string;
	onClick?: () => void;
	color?: string;
	background?: string;
	href?: string;
	disable?: boolean;
}
