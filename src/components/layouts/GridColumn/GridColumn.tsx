'use client';
import clsx from 'clsx';
import styles from './GridColumn.module.scss';
import {useStyleClass} from '~/commons/hooks/useStyleClass';

function GridColumn({children, ...props}: any) {
	const styleClass = useStyleClass(props, styles);
	return <div className={clsx(styles.container, styleClass)}>{children}</div>;
}

export default GridColumn;
