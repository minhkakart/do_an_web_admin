'use client'
import React, {useEffect, useRef, useState} from 'react';

import {PropsSearch} from './interfaces';
import styles from './Search.module.scss';
import clsx from 'clsx';
import {GrSearch} from 'react-icons/gr';

function Search({keyword, setKeyword, placeholder = 'Nhập từ khóa tìm kiếm'}: PropsSearch) {
	const inputSearchRef = useRef<HTMLInputElement>(null);

	const [isFocus, setIsfocus] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState(keyword);

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			setKeyword(searchTerm.trim());
		}, 600);

		return () => clearTimeout(delayDebounce);
	}, [searchTerm, setKeyword]);

	const handleSelectClick = () => {
		if (inputSearchRef.current) {
			setTimeout(() => {
				inputSearchRef.current?.focus();
			}, 0);
		}
	};

	return (
		<div className={clsx(styles.container, {[styles.focus]: isFocus})} onClick={handleSelectClick}>
			<div className={styles.icon}>
				<GrSearch color='#005994' size={20} />
			</div>
			<input
				ref={inputSearchRef}
				placeholder={placeholder}
				onFocus={() => setIsfocus(true)}
				onBlur={() => setIsfocus(false)}
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value.trimStart())}
			/>
		</div>
	);
}

export default Search;
