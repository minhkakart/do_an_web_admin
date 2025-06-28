import React from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import {PropsDateOption} from './interfaces';

import styles from './DateOption.module.scss';
import clsx from 'clsx';
import {TYPE_DATE} from '~/constants/config/enum';
import {getDateRange} from '~/commons/funcs/selectData';
import {ListOptionFilterDate} from '~/constants/config';
import RangeDatePicker from '../RangeDatePicker';

function DateOption({showOptionAll, date, setDate, typeDate, setTypeDate, show, setShow}: PropsDateOption) {
	return (
		<TippyHeadless
			maxWidth={'100%'}
			interactive
			visible={Number(typeDate) == TYPE_DATE.LUA_CHON}
			placement='right-start'
			render={(attrs) => (
				<div className={styles.main_calender}>
					<RangeDatePicker
						value={date}
						onSetValue={setDate}
						onClose={() => setShow(false)}
						open={show && Number(typeDate) == TYPE_DATE.LUA_CHON}
					/>
				</div>
			)}
		>
			<div className={styles.mainOption}>
				{(showOptionAll ? ListOptionFilterDate : ListOptionFilterDate.filter((f) => f.value !== TYPE_DATE.ALL))?.map((v, i) => (
					<div
						key={i}
						className={clsx(styles.option, {
							[styles.option_active]: Number(typeDate) == v.value,
						})}
						onClick={() => {
							if (v.value != TYPE_DATE.LUA_CHON) {
								setDate(getDateRange(v.value));
								setShow(false);
							}
							setTypeDate(v.value);
						}}
					>
						<p>{v.name}</p>
					</div>
				))}
			</div>
		</TippyHeadless>
	);
}

export default DateOption;
