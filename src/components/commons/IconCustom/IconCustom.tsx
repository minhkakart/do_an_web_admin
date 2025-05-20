import React from 'react';

import {PropsIconCustom} from './interfaces';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import Link from 'next/link';

function IconCustom({icon, tooltip, onClick, color, href, disable = false, background = 'rgba(78, 203, 113, 0.1)'}: PropsIconCustom) {
	return (
		<Tippy
			content={tooltip}
			className="bg-gray-900 opacity-80 py-2 px-3 text-white rounded-md"
		>
			{href ? (
				<Link
					href={href}
					style={{color: color, background: background}}
					className={clsx({"pointer-events-none opacity-30": disable}, "cursor-pointer select-none p-[6px] w-8 h-8 flex justify-center items-center rounded-md transition duration-200 hover:opacity-60")}
				>
					<div className="">{icon}</div>
				</Link>
			) : (
				<div
					style={{color: color, background: background}}
					className={clsx({"pointer-events-none opacity-30": disable}, "cursor-pointer select-none p-[6px] w-8 h-8 flex justify-center items-center rounded-md transition duration-200 hover:opacity-60")}
					onClick={onClick}
				>
					<div className="">{icon}</div>
				</div>
			)}
		</Tippy>
	);
}

export default IconCustom;
