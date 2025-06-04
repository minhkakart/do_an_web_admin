'use client';
import React, {useRef} from 'react';
import Image from "next/image";
import {AddSquare} from "iconsax-react";

export interface IPropsUploadSingleFile {
    file: any;
    setFile: (file: any) => void;
}

function UploadSingleFile({file, setFile}: IPropsUploadSingleFile) {
    const fileInputRef = useRef<any>(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event: any) => {
        const selectedFile = event.target.files[0];
        const url = URL.createObjectURL(selectedFile);
        setFile({url, file: selectedFile});

    };

    console.log('file', file);

    return (
        <div className="flex flex-col w-full h-fit gap-3">
            <div
                className="relative w-full h-[200px] rounded-md overflow-hidden select-none flex-auto">
                {(file && file !== '') ?
                    <Image
                        src={file?.url || file?.path || (file?.resource && (process.env.NEXT_PUBLIC_IMAGE + file?.resource)) || (process.env.NEXT_PUBLIC_IMAGE + file)}
                        alt='image' objectFit='cover' layout='fill'/> :
                    <div className="flex items-center justify-center w-full h-full bg-[rgba(153,162,179,0.3)] hover:cursor-pointer"
                    onClick={handleClick}
                    >
                        <AddSquare size="100" color="#FFF"/>
                    </div>
                }
            </div>
            <div className="flex items-center justify-center w-full bg-blue-900 text-white rounded-md cursor-pointer py-3"
                 onClick={handleClick}
            >
                Đổi ảnh
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}

export default UploadSingleFile;