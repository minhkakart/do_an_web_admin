import React from 'react';

import {PropsBoxStatistical} from './interfaces';
import styles from './BoxStatistical.module.scss';
import clsx from 'clsx';

function BoxStatistical({text, value, icon, isReverse = false}: PropsBoxStatistical) {
    return (
        <div className="rounded-lg border border-[#e1e5ed] bg-white px-6 py-5 flex items-center justify-between gap-3">
            <div
                className={clsx("flex flex-col", {"[&>p:nth-child(1)]:order-2 [&>p:nth-child(2)]:order-1": isReverse})}>
                <p className="text-[#141416] text-[28px] font-bold">{value}</p>
                <p className="text-[#777e90] text-sm font-medium mt-1">{text}</p>
            </div>
            {icon}
        </div>
    );
}

export default BoxStatistical;
