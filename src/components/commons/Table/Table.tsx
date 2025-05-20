'use client'

import {Fragment, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import styles from './Table.module.scss';
import {PropsTable} from './interfaces';
import {IoIosArrowUp} from 'react-icons/io';

const Table = <T,>({
	data,
	column,
	fixedHeader = false,
	activeHeader = false,
	handleCheckedAll,
	isCheckedAll,
	handleCheckedRow,
	handleIsCheckedRow,
	rowKey,
	getChildren,
	useIndexPathAsKey = false,
}: PropsTable<T>) => {
	const tableRef = useRef<HTMLDivElement>(null);
	const thRefs = useRef<(HTMLTableHeaderCellElement | null)[]>([]);

	const [isShowScroll, setIsShowScroll] = useState(false);
	const [expandedRows, setExpandedRows] = useState<React.Key[]>([]);
	const [columnWidths, setColumnWidths] = useState<number[]>([]);

	useEffect(() => {
		const element = tableRef.current;
		if (!element) return;

		const observer = new ResizeObserver(() => {
			setIsShowScroll(element.scrollWidth > element.clientWidth);
		});

		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	//fixed
	useEffect(() => {
		const updateColumnWidths = () => {
			if (thRefs.current.length > 0) {
				const widths = thRefs.current.map((th) => th?.offsetWidth || 0);
				setColumnWidths(widths);
			}
		};

		updateColumnWidths();
		window.addEventListener('resize', updateColumnWidths);
		return () => {
			window.removeEventListener('resize', updateColumnWidths);
		};
	}, [data]);

	const fixedLeftPositions = useMemo(() => {
		let left = 0;
		return column.map((col, index) => {
			if (col.fixedLeft) {
				const position = left;
				left += columnWidths[index] || 0;
				return position;
			}
			return null;
		});
	}, [column, columnWidths]);

	const fixedRightPositions = useMemo(() => {
		let right = 0;
		return column
			.slice()
			.reverse()
			.map((col, index) => {
				if (col.fixedRight) {
					const position = right;
					right += columnWidths[column.length - 1 - index] || 0;
					return position;
				}
				return null;
			})
			.reverse();
	}, [column, columnWidths]);

	const toggleExpandRow = (key: string | number) => {
		setExpandedRows((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
	};

	const renderRows = (rows: T[], level = 0, indexPath: number[]): React.ReactNode => {
		return rows.map((row, i) => {
			const currentIndexPath = [...indexPath, i];
			const pathKey = currentIndexPath.join('.');
			const uniqueKey = String(useIndexPathAsKey ? pathKey : rowKey(row)); // Nếu có useIndexPathAsKey thì lấy pathKey theo index không thì vẫn lấy key qua rowKey

			const children = getChildren?.(row);
			const isExpanded = expandedRows.includes(uniqueKey);

			return (
				<Fragment key={uniqueKey}>
					<tr className={styles.tr_data}>
						{getChildren && (
							<td style={{width: 60, padding: '0 16px'}}>
								{!!children?.length && (
									<div
										className={clsx(styles.arrow, {[styles.expanded]: isExpanded})}
										onClick={() => toggleExpandRow(uniqueKey)}
									>
										<IoIosArrowUp className={styles.icon} size={20} />
									</div>
								)}
							</td>
						)}
						{column.map((col, j) => (
							<td
								key={j}
								className={clsx({
									[styles.fixedLeft]: col.fixedLeft && isShowScroll,
									[styles.fixedRight]: col.fixedRight && isShowScroll,
								}, col.className)}
								style={{
									left: fixedLeftPositions[j] || 0,
									right: fixedRightPositions[j] || 0,
								}}
							>
								<div
									className={clsx(col.className, {
										[styles.checkBox]: col.checkBox,
									})}
								>
									{col.checkBox && (
										<input
											className={styles.checkbox}
											type='checkbox'
											onChange={(e) => handleCheckedRow?.(e, row)}
											checked={handleIsCheckedRow?.(row) ?? false}
										/>
									)}
									{col.render(row, i, currentIndexPath)}
								</div>
							</td>
						))}
					</tr>
					{isExpanded && children && renderRows(children, level + 1, currentIndexPath)}
				</Fragment>
			);
		});
	};

	return (
		<div
			ref={tableRef}
			className={clsx(styles.container, {
				[styles.fixedHeader]: fixedHeader,
				[styles.activeHeader]: activeHeader,
			})}
		>
			<table>
				<thead>
					<tr>
						{getChildren && <th style={{width: 60}} />}
						{column.map((col, i) => (
							<th
								key={i}
								ref={(el) => {
									thRefs.current[i] = el;
								}}
								style={{
									left: fixedLeftPositions[i] || 0,
									right: fixedRightPositions[i] || 0,
								}}
								className={clsx({
									[styles.checkBox]: col.checkBox,
									[styles.fixedLeft]: col.fixedLeft && isShowScroll,
									[styles.fixedRight]: col.fixedRight && isShowScroll,
								})}
							>
								{col.checkBox && (
									<input
										className={clsx(styles.checkbox, styles.checkbox_head)}
										type='checkbox'
										onChange={handleCheckedAll}
										checked={isCheckedAll}
									/>
								)}
								{col.title}
							</th>
						))}
					</tr>
				</thead>
				<tbody>{renderRows(data, 0, [])}</tbody>
			</table>
		</div>
	);
};

export default Table;
