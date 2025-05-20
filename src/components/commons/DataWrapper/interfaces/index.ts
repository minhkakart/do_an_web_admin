export interface PropsDataWrapper {
	title?: string;
	note?: string;
	loading: boolean;
	data: any[];
	children: React.ReactNode;
	button?: React.ReactNode;
}
