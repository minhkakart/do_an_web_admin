'use client';
import React, {use, useRef} from 'react';
import productService from "~/services/apis/productService";
import {apiRequest} from "~/services";
import {useQuery} from "@tanstack/react-query";
import {IProductDetailDto} from "~/app/(authenticated)/products/interfaces";
import Loading from "~/components/commons/Loading";
import Link from 'next/link';
import {IoArrowBackOutline} from 'react-icons/io5';
import DataWrapper from "~/components/commons/DataWrapper";
import lgShare from 'lightgallery/plugins/share';
import lgHash from 'lightgallery/plugins/hash';
import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
import Image from "next/image";
import {convertCoin} from "~/commons/funcs/convertCoin";
import {BooleanType, TypeDiscount} from "~/constants/config/enum";
import StateActive from "~/components/commons/StateActive";
import {Star1} from "iconsax-react";
import 'lightgallery/scss/lightgallery.scss';
import 'lightgallery/scss/lg-zoom.scss';

function DetailProduct({params}: {
    params: Promise<{ _idProduct: string }>
}) {
    const {_idProduct} = use(params);

    const refLightGallery = useRef<any>(null);

    const {data: detailProduct, isLoading} = useQuery<IProductDetailDto>({
        queryFn: () =>
            apiRequest({
                api: () => productService.detailProduct({
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
            <div className="main rounded-lg p-4 bg-white [&_+.main]:mt-5">
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
                <div className="_group flex flex-col">
                    <div className="_info_group grid grid-cols-2 gap-[120px] w-full text-[#535763]">
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-[180px_1fr] w-full font-semibold">
                                <div className="flex justify-between pr-2">
                                    <p>Tên sản phẩm</p>:
                                </div>
                                <span>{detailProduct?.name || '---'}</span>
                            </div>
                            <div className="grid grid-cols-[180px_1fr] w-full font-semibold">
                                <div className="flex justify-between pr-2">
                                    <p>Giá</p>:
                                </div>
                                <span>{convertCoin(detailProduct?.price ?? 0) + "VNĐ" || '---'}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-[180px_1fr] w-full font-semibold">
                                <div className="flex justify-between pr-2">
                                    <p>Trạng thái</p>:
                                </div>
                                <StateActive
                                    stateActive={detailProduct?.isAvailable ?? -1}
                                    listState={[
                                        {
                                            backgroundColor: 'rgba(29, 201, 77, 0.15)',
                                            state: BooleanType.True,
                                            text: 'Đang bán',
                                            textColor: '#1DC94D',
                                        },
                                        {
                                            backgroundColor: 'rgba(244, 97, 97, 0.15)',
                                            state: BooleanType.True,
                                            text: 'Ngưng bán',
                                            textColor: '#F46161',
                                        },
                                    ]}
                                />
                            </div>
                            <div className="grid grid-cols-[180px_1fr] w-full font-semibold">
                                <div className="flex justify-between pr-2">
                                    <p>Sao đánh giá</p>:
                                </div>
                                <span>
                                    {detailProduct?.starRate === 0 ? "Chưa có đánh giá" :
                                        <>
                                            {convertCoin(detailProduct?.starRate!)}
                                            <Star1 size="32" variant="Bold" color="#ffd149"/>
                                        </>
                                    }
                                </span>
                            </div>
                            <div className="grid grid-cols-[180px_1fr] w-full font-semibold">
                                <div className="flex justify-between pr-2">
                                    <p>Mô tả</p>:
                                </div>
                                <span>{detailProduct?.description || "---"}</span>
                            </div>
                        </div>
                    </div>
                    {(detailProduct?.imageUrls?.length ?? -1) > 0 && (
                        <div className="_images_group mt-3">
                            <p className="text-[#535763] font-semibold">Hình ảnh:</p>
                            <LightGallery
                                plugins={[lgZoom, lgShare, lgHash]}
                                selector={'.slick__slide'}
                                speed={500}
                                onInit={(detail: any) => {
                                    refLightGallery.current = detail.instance;
                                }}
                            >
                                <div className="flex items-center gap-3 flex-wrap">
                                    {detailProduct?.imageUrls?.map((v, index) => (
                                        <a key={index} className={'slick__slide'}
                                           data-src={`${process.env.NEXT_PUBLIC_API}/${v}`}>
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_API}/${v}`}
                                                alt='image slider'
                                                objectFit='cover'
                                                width={120}
                                                height={120}
                                                style={{borderRadius: '8px', cursor: 'pointer', userSelect: 'none'}}
                                            />
                                        </a>
                                    ))}
                                </div>
                            </LightGallery>
                        </div>
                    )}

                </div>

            </div>

            <div className="main rounded-lg p-4 bg-white [&_+.main]:mt-5 h-full">
                <p className="text-2xl font-bold">Danh sách bình luận</p>
                <div className="mt-4">
                    <TableComment/>
                </div>
            </div>
        </>
    );
}

export default DetailProduct;

function TableComment() {
    return (
        <>
            {/*<Loading loading={funcChangeStatus.isLoading} />*/}
            <DataWrapper loading={false} data={[]} note="Chưa có bình luận nào">
                <div></div>
                {/*<Table<IFactoryCompany>*/}
                {/*    activeHeader={true}*/}
                {/*    data={data?.items || []}*/}
                {/*    rowKey={(row) => row.uuid}*/}
                {/*    column={[*/}
                {/*        {*/}
                {/*            title: 'STT',*/}
                {/*            fixedLeft: true,*/}
                {/*            render: (_, index) => <>{index + 1}</>,*/}
                {/*        },*/}
                {/*        {*/}
                {/*            title: 'Mã xưởng',*/}
                {/*            render: (row, _) => <>{row.code}</>,*/}
                {/*        },*/}
                {/*        {*/}
                {/*            title: 'Tên xưởng',*/}
                {/*            render: (row, _) => <>{row?.name}</>,*/}
                {/*        },*/}
                {/*        {*/}
                {/*            title: 'Người đại diện',*/}
                {/*            render: (row, _) => <>{row?.director || '---'}</>,*/}
                {/*        },*/}
                {/*        {*/}
                {/*            title: 'Số điện thoại',*/}
                {/*            render: (row, _) => <>{row.phoneNumber || '---'}</>,*/}
                {/*        },*/}
                {/*        {*/}
                {/*            title: 'Email',*/}
                {/*            render: (row, _) => <>{row.email || '---'}</>,*/}
                {/*        },*/}
                {/*        {*/}
                {/*            title: 'Trạng thái',*/}
                {/*            render: (row, _) => (*/}
                {/*                <StateActive*/}
                {/*                    stateActive={row?.status}*/}
                {/*                    listState={[*/}
                {/*                        {*/}
                {/*                            backgroundColor: 'rgba(29, 201, 77, 0.15)',*/}
                {/*                            state: CONFIG_STATUS.ACTIVE,*/}
                {/*                            text: 'Hoạt động',*/}
                {/*                            textColor: '#1DC94D',*/}
                {/*                        },*/}
                {/*                        {*/}
                {/*                            backgroundColor: 'rgba(244, 97, 97, 0.15)',*/}
                {/*                            state: CONFIG_STATUS.LOCK,*/}
                {/*                            text: 'Bị khóa',*/}
                {/*                            textColor: '#F46161',*/}
                {/*                        },*/}
                {/*                    ]}*/}
                {/*                />*/}
                {/*            ),*/}
                {/*        },*/}
                {/*    ]}*/}
                {/*/>*/}
            </DataWrapper>
            {/*<Pagination*/}
            {/*    page={page}*/}
            {/*    onSetPage={setPage}*/}
            {/*    pageSize={pageSize}*/}
            {/*    onSetPageSize={setPageSize}*/}
            {/*    total={data?.pagination?.totalCount || 0}*/}
            {/*    dependencies={[pageSize, _uuid]}*/}
            {/*/>*/}

        </>
    );
}