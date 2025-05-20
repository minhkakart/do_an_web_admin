import React, {Fragment} from 'react';

import {PropsDataWrapper} from './interfaces';
import styles from './DataWrapper.module.scss';
import Image from 'next/image';
import icons from '~/constants/images/icons';

function DataWrapper({title = 'Dữ liệu trống', note = 'Hiện tại dữ liệu đang trống!', data, loading, button, children}: PropsDataWrapper) {
	return (
		<Fragment>
			{loading && (
				<div className={styles.container}>
					<div className={styles.ldsSpinner}>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
					<h3>Đang tải . . .</h3>
					<p>Vui lòng chờ, đang tải dữ liệu!</p>
				</div>
			)}

			{!loading && data?.length <= 0 && (
				<div className={styles.container}>
					<Image alt='Ảnh dữ liệu trống' src={icons.emptyTable} width={180} height={180} />
					<h3>{title}</h3>
					<p>{note}</p>
					<div className={styles.btn}>{button}</div>
				</div>
			)}

			{!loading && data?.length > 0 && <>{children}</>}
		</Fragment>
	);
}

export default DataWrapper;
