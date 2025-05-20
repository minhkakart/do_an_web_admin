// noinspection SpellCheckingInspection

import {FaCheckCircle} from 'react-icons/fa';
import clsx from 'clsx';
import {MdOutlineVerified} from 'react-icons/md';
import {PiWarningCircle} from 'react-icons/pi';
import {PropsIconToastifyCustom} from './interfaces';

function IconToastifyCustom({type}: PropsIconToastifyCustom) {
    return (
        <div
            className={clsx(
                {
                    "bg-[#06d7a0] text-[#06d7a0]": type == 'success',
                    "bg-[#4bc9f0] text-[#4bc9f0]": type == 'info',
                    "bg-[#ffd167] text-[#ffd167]": type == 'warn',
                    "bg-[#ee464c] text-[#ee464c]": type == 'error',
                },
                "w-\[50px] h-\[50px] flex items-center justify-center rounded-full"
            )}
        >
            {type == 'success' && (
                <div>
                    <FaCheckCircle size='20' color='#fff'/>
                </div>
            )}
            {type == 'info' && (
                <div>
                    <FaCheckCircle size='20' color='#fff'/>
                </div>
            )}
            {type == 'warn' && (
                <div>
                    <PiWarningCircle size='20' color='#fff'/>
                </div>
            )}
            {type == 'error' && (
                <div>
                    <MdOutlineVerified size='20' color='#fff'/>
                </div>
            )}
        </div>
    );
}

export default IconToastifyCustom;
