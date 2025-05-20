import React from "react";

export interface ColumnType<T> {
	title: string;
	render: (row: T, index: number, currentIndexPath?: number[]) => React.ReactNode;
	className?: string;
	checkBox?: boolean;
	fixedLeft?: boolean;
	fixedRight?: boolean;
}

export interface PropsTable<T> {
	data: T[];
	column: ColumnType<T>[];
	fixedHeader?: boolean;
	activeHeader?: boolean;
	handleCheckedAll?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isCheckedAll?: boolean;
	handleCheckedRow?: (e: React.ChangeEvent<HTMLInputElement>, row: T) => void;
	handleIsCheckedRow?: (row: T) => boolean;
	rowKey: (row: T) => React.Key;
	getChildren?: (row: T) => T[] | undefined;
	useIndexPathAsKey?: boolean;
}
