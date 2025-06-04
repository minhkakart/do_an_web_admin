import React from 'react';

import {PropsBoxStatistical} from './interfaces';
import styles from './BoxStatistical.module.scss';
import clsx from 'clsx';

function BoxStatistical({text, value, icon, isReverse = false}: PropsBoxStatistical) {
	return (
		<div className={styles.container}>
			<div className={clsx(styles.statistical, {[styles.isReverse]: isReverse})}>
				<p>{value}</p>
				<p>{text}</p>
			</div>
			{icon}
		</div>
	);
}

export default BoxStatistical;
