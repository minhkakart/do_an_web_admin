import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import TippyHeadless from '@tippyjs/react/headless';

import {PropsFilterDateRange} from './interfaces';
import styles from './FilterDateRange.module.scss';
import Moment from 'react-moment';
import {TYPE_DATE} from '~/constants/config/enum';
import {getDateRange} from '~/commons/funcs/selectData';
import {ListOptionFilterDate} from '~/constants/config';
import {IoIosArrowDown} from 'react-icons/io';
import DateOption from './components/DateOption';

function FilterDateRange({
	styleRounded = false,
	showOptionAll = false,
	date,
	setDate,
	typeDate,
	setTypeDate,
	title = 'Thời gian',
}: PropsFilterDateRange) {
	const [openDate, setOpenDate] = useState<boolean>(false);

	useEffect(() => {
		if (typeDate != TYPE_DATE.LUA_CHON) {
			setDate(getDateRange(typeDate));
		} else {
			if (!!date?.from && !!date.to) {
				setDate({
					from: date?.from,
					to: date.to,
				});
			}
		}
	}, [typeDate]);

	return (
		<TippyHeadless
			maxWidth={'100%'}
			interactive
			visible={openDate}
			onClickOutside={() => setOpenDate(false)}
			placement='bottom-start'
			render={() => (
				<DateOption
					showOptionAll={showOptionAll}
					date={date}
					setDate={setDate}
					typeDate={typeDate}
					setTypeDate={setTypeDate}
					show={openDate}
					setShow={setOpenDate}
				/>
			)}
		>
			<div
				className={clsx(styles.container, {[styles.styleRounded]: styleRounded, [styles.active]: openDate})}
				onClick={() => setOpenDate(!openDate)}
			>
				<div className={styles.value}>
					<p className={styles.name}>{title}:</p>
					<p className={styles.text}>
						{typeDate == TYPE_DATE.LUA_CHON ? (
							<span>
								<Moment date={date?.from!} format='DD/MM/YYYY' /> - <Moment date={date?.to!} format='DD/MM/YYYY' />
							</span>
						) : (
							<span>{ListOptionFilterDate.find((v) => v.value == typeDate)?.name}</span>
						)}
					</p>
				</div>
				<div className={styles.icon_arrow}>
					<IoIosArrowDown size={16} />
				</div>
			</div>
		</TippyHeadless>
	);
}

export default FilterDateRange;
