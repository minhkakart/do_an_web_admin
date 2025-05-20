export interface PropsButton {
	onClick?: (e?: any) => void;
	children?: React.ReactNode;
	href?: any;
	div?: boolean;
	icon?: React.ReactNode;
	[props: string]: any;
}
