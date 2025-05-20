'use client';
import React, {use} from 'react';
import productService from "~/services/apis/productService";
import {httpRequest} from "~/services";
import {useQuery} from "@tanstack/react-query";
import {IProductDetailDto} from "~/app/(authenticated)/products/interfaces";
import Loading from "~/components/commons/Loading";
import Link from 'next/link';
import {IoArrowBackOutline} from 'react-icons/io5';

function DetailProduct({params}: {
    params: Promise<{ _idProduct: string }>
}) {
    const {_idProduct} = use(params);

    const {data: detailProduct, isLoading} = useQuery<IProductDetailDto>({
        queryFn: () =>
            httpRequest({
                showLoading: false,
                http: () => productService.detailProduct({
                    id: Number(_idProduct),
                }),
            }),
        select(data: IProductDetailDto) {
            return data;
        },
        enabled: !!_idProduct,
        queryKey: [_idProduct]
    });

    return (
        <>
            <Loading loading={isLoading}/>
            <div className="rounded-lg p-4 bg-white [&_+.main]:mt-5">
                <div className="flex items-center justify-between">
                    <Link
                        href='#'
                        onClick={(e) => {
                            e.preventDefault();
                            window.history.back();
                        }}
                        className="flex items-center gap-3"
                    >
                        <IoArrowBackOutline fontSize={20} fontWeight={600}/>
                        <p className="text-[#2f3d50] text-[20px] font-semibold">Chi tiết sản phẩm</p>
                    </Link>

                </div>
                <div className="w-full h-px bg-[#e0e0e0] my-4"></div>
                <div className="_group">
                    <div className="_info_group">

                    </div>
                    <div className="_images_group">

                    </div>

                </div>

            </div>
        </>
    );
}

export default DetailProduct;