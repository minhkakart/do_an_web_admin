'use client'

import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {IPageResponse} from "~/commons/interfaces";
import {apiRequest} from "~/services";
import {BooleanType, ProductType, QueryKey, TypeDiscount} from "~/constants/config/enum";
import {PageSize} from "~/constants/config";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import productService from "~/services/apis/productService";
import Form, {FormContext, Input} from "~/components/commons/Form";
import Loading from "~/components/commons/Loading";
import TextArea from "~/components/commons/Form/components/TextArea";
import Button from "~/components/commons/Button";
import {Danger, Edit, Eye, FolderOpen, Star1, TickCircle, Trash} from "iconsax-react";
import {IoClose} from "react-icons/io5";
import {
    ICreateProductRequest,
    IFormProductProps,
    IProductDetailDto,
    IProductListDto, ISizeDto,
    IUpdateProductRequest
} from "~/app/(authenticated)/products/interfaces";
import Search from "~/components/commons/Search";
import Image from "next/image";
import icons from "~/constants/images/icons";
import PositionContainer from "~/components/commons/PositionContainer";
import SelectForm from "~/components/commons/SelectForm";
import SelectMany from "~/components/commons/SelectMany";
import categoryService from "~/services/apis/categoryService";
import {ICategoryDto} from "~/app/(authenticated)/categories/interfaces";
import UploadMultipleFile from "~/components/commons/UploadMultipleFile";
import uploadFileService from "~/services/apis/uploadFileService";
import {convertCoin, price} from "~/commons/funcs/convertCoin";
import DataWrapper from "~/components/commons/DataWrapper";
import Table from "~/components/commons/Table";
import Moment from "react-moment";
import IconCustom from "~/components/commons/IconCustom";
import Pagination from "~/components/commons/Pagination";
import StateActive from "~/components/commons/StateActive";
import {HiOutlineLockClosed, HiOutlineLockOpen} from "react-icons/hi";
import {toast} from "react-toastify";
import {ToastCustom} from "~/commons/funcs/toast";
import sizeService from "~/services/apis/sizeService";
import GridColumn from "~/components/layouts/GridColumn";
import TippyHeadless from '@tippyjs/react/headless';
import Tippy from "@tippyjs/react";
import clsx from "clsx";
import Dialog from "~/components/commons/Dialog";

export default function Products() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const _action = searchParams.get('_action');
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(PageSize[0]);
    const [keyword, setKeyword] = useState<string>('');
    const [available, setAvailable] = useState<{ id: number, name: string, isAvailable: number } | null>(null);
    const [sizePricesIndex, setSizePricesIndex] = useState<number | null>(null);

    const {data, isLoading} = useQuery<IPageResponse<IProductListDto>>({
        queryFn: () =>
            apiRequest({
                api: async () => productService.getLisPageProduct({
                    page: page,
                    size: pageSize,
                    keyword: keyword,
                    available: null,
                    discounting: null
                }),
            }),
        select(data: IPageResponse<IProductListDto>) {
            return data;
        },
        queryKey: [QueryKey.tableProduct, keyword, page, pageSize],
    });

    const funcChangeAvailable = useMutation({
        mutationFn: (body: { id: number, isAvailable: number }) => apiRequest({
            api: async () => productService.changeAvailableProduct(body),
            msgSuccess: "Cập nhật trạng thái sản phẩm thành công!",
            showMessageSuccess: true,
            showMessageFailed: true,
        }),
        async onSuccess() {
            setAvailable(null);
            await queryClient.invalidateQueries({queryKey: [QueryKey.tableProduct]});
        }
    });

    return (
        <>
            <div className="flex justify-between items-center gap-3 flex-wrap mb-3">
                <div className="flex gap-3 flex-wrap">
                    <div className="min-w-[400px]">
                        <Search placeholder='Nhập từ khóa tìm kiếm' keyword={keyword} setKeyword={setKeyword}/>
                    </div>
                    <div>
                        <Button
                            icon={<Image alt='Icon add' src={icons.addButton} width={20} height={20}/>}
                            w_fit
                            p_10_24
                            blue
                            rounded_8
                            className="text-white"
                            onClick={() => {
                                const currentParams = new URLSearchParams(searchParams.toString());
                                currentParams.set('_action', 'create');
                                router.replace(`?${currentParams.toString()}`);
                            }
                            }
                        >
                            Thêm sản phẩm
                        </Button>
                    </div>
                </div>
            </div>


            <DataWrapper
                loading={isLoading}
                data={data?.items || []}
                title='Danh sách sản phẩm trống'

            >
                <Table<IProductListDto>
                    data={data?.items || []}
                    rowKey={(row) => row.id}
                    column={[
                        {
                            title: 'STT',
                            render: (_, index) => <>{index + 1}</>,
                        },
                        {
                            title: 'Tên sản phẩm',
                            render: (row, _) => (
                                <div className="flex flex-col items-start justify-center">
                                    <div>
                                        {row.name}
                                    </div>
                                    <div className="flex mt-0.5 gap-1">
                                        {row.bestSell == BooleanType.True && (<div
                                            className="text-[12px] font-normal px-0.5 rounded-xs bg-yellow-300">Bestseller</div>)}
                                        {row.remarked == BooleanType.True && (<div
                                            className="text-[12px] font-normal px-0.5 rounded-xs bg-green-300">Nổi
                                            bật</div>)}
                                    </div>
                                </div>
                            ),
                        },
                        {
                            title: 'Giá',
                            render: (row, idx) =>
                                <div className="cursor-pointer">
                                    <TippyHeadless
                                        maxWidth={'100%'}
                                        interactive
                                        onClickOutside={() => setSizePricesIndex(null)}
                                        visible={sizePricesIndex == idx}
                                        placement='bottom'
                                        render={(attrs) => (
                                            <div
                                                className="min-w-[240px] rounded px-4 py-4 bg-white shadow-[0_0_5px_0_rgba(0,0,0,0.1),_0_0_1px_0_rgba(0,0,0,0.1)]">
                                                <div>
                                                    {row?.sizePrices?.map((v, i) => (
                                                        <div key={i}
                                                             className="text-[#2d74ff] text-sm font-medium flex items-center gap-[6px] [&+&]:mt-[6px]">
                                                            <div
                                                                className="w-[6px] h-[6px] rounded-full bg-[#2d74ff]"></div>
                                                            <p>
                                                                {v?.size.name} : {" " + v?.price}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    >
                                        <Tippy content='Xem giá'>
                                            <p
                                                onClick={() => {
                                                    if (row?.sizePrices?.length == 0) {
                                                        return;
                                                    } else {
                                                        setSizePricesIndex(sizePricesIndex ? null : idx);
                                                    }
                                                }}
                                                className={clsx("w-fit cursor-pointer select-none font-semibold transition duration-300 hover:text-[#2d74ff]", {"text-[#2d74ff]": sizePricesIndex == idx})}
                                            >
                                                {row?.price || 0}
                                            </p>
                                        </Tippy>
                                    </TippyHeadless>
                                </div>,
                        },
                        {
                            title: 'Giảm giá',
                            render: (row, _) =>
                                <>
                                    {convertCoin(row.discount)}{row.discountType === TypeDiscount.Percent ? "%" : "VNĐ"}
                                </>,
                        },
                        {
                            title: 'Đánh giá',
                            className: "flex flex-row justify-start items-center gap-2",
                            render: (row, _) =>
                                <>
                                    {row.starRate === 0 ? "Chưa có đánh giá" :
                                        <>{convertCoin(row.starRate)}</>}
                                    <Star1 size="32" variant="Bold" color="#ffd149"/>
                                </>,
                        },
                        {
                            title: 'Bình luận',
                            render: (row, _) => <>{convertCoin(row.numComment) || '---'}</>,
                        },
                        {
                            title: 'Ngày tạo',
                            render: (row, _) => (
                                <>
                                    {row?.createdAt ? (
                                        <Moment date={row?.createdAt} format='DD/MM/YYYY'/>
                                    ) : (
                                        '---'
                                    )}
                                </>
                            ),
                        },
                        {
                            title: 'Loại sản phẩm',
                            render: (row, _) =>
                                <StateActive
                                    stateActive={row?.type}
                                    listState={[
                                        {
                                            backgroundColor: '#1DC94D26',
                                            state: ProductType.Main,
                                            text: 'Sản phẩm chính',
                                            textColor: '#1DC94D',
                                        },
                                        {
                                            backgroundColor: '#F18E0B26',
                                            state: ProductType.Topping,
                                            text: 'Topping',
                                            textColor: '#F18E0B',
                                        },
                                    ]}
                                />
                        },
                        {
                            title: 'Trạng thái',
                            render: (row, _) =>
                                <StateActive
                                    stateActive={row?.isAvailable}
                                    listState={[
                                        {
                                            backgroundColor: 'rgba(29, 201, 77, 0.15)',
                                            state: BooleanType.True,
                                            text: 'Đang bán',
                                            textColor: '#1DC94D',
                                        },
                                        {
                                            backgroundColor: 'rgba(244, 97, 97, 0.15)',
                                            state: BooleanType.False,
                                            text: 'Ngưng bán',
                                            textColor: '#F46161',
                                        },
                                    ]}
                                />
                        },
                        {
                            title: 'Tác vụ',
                            fixedRight: true,
                            render: (row, _) => (
                                <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                    <IconCustom
                                        icon={<Eye size='32' color='#6170E3'/>}
                                        tooltip='Xem chi tiết'
                                        background='rgba(97, 112, 227, 0.10)'
                                        onClick={
                                            () => {
                                                router.push(pathname + `/${row.id}`);
                                            }
                                        }
                                    />
                                    <IconCustom
                                        icon={<Edit color='#3772FF' size={24}/>}
                                        tooltip='Chỉnh sửa'
                                        background='rgba(55, 114, 255, 0.10)'
                                        onClick={() => {
                                            const currentParams = new URLSearchParams(searchParams.toString());
                                            currentParams.set('_action', 'update');
                                            currentParams.set('_id', row.id.toString());
                                            router.replace(`?${currentParams.toString()}`);
                                        }
                                        }
                                    />
                                    <IconCustom
                                        icon={
                                            row?.isAvailable == BooleanType.True ? (
                                                <HiOutlineLockClosed color='#F46161' size={24}/>
                                            ) : (
                                                <HiOutlineLockOpen color='#4ECB71' size={24}/>
                                            )
                                        }
                                        tooltip={row?.isAvailable == BooleanType.True ? 'Ngừng bán' : 'Mở bán'}
                                        background={
                                            row?.isAvailable == BooleanType.True ? 'rgba(244, 97, 97, 0.1)' : 'rgba(78, 203, 113, 0.1)'
                                        }
                                        onClick={() => {
                                            setAvailable({id: row.id, name: row.name, isAvailable: row.isAvailable});
                                        }}
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </DataWrapper>

            <Pagination
                page={page}
                onSetPage={setPage}
                pageSize={pageSize}
                onSetPageSize={setPageSize}
                total={data?.pagination?.totalCount || 0}
                dependencies={[pageSize, keyword]}
            />

            <Dialog
                type={available?.isAvailable === BooleanType.True ? "warning" : "primary"}
                open={!!available}
                onClose={() => setAvailable(null)}
                title={available?.isAvailable === BooleanType.True ? "Ngừng bán sản phẩm?" : "Mở bán sản phẩm?"}
                note={available?.isAvailable === BooleanType.True ? `Xác nhận ngừng bán sản phẩm ${available?.name}?` : `Xác nhận mở bán sản phẩm ${available?.name}?`}
                icon={
                    available?.isAvailable === BooleanType.True ?
                        <Danger size='76' color='#F46161' variant='Bold'/> :
                        <TickCircle size='76' color='#1dc94d' variant='Bold'/>
                }
                onSubmit={() => funcChangeAvailable.mutate({
                    id: available!.id,
                    isAvailable: 1 - available!.isAvailable
                })}
            />

            <PositionContainer
                open={_action == 'create'}
                onClose={async () => router.replace(pathname)}
            >
                <FormCreateProduct
                    queryKeys={[QueryKey.tableProduct]}
                    onClose={async () => router.replace(pathname)}
                />
            </PositionContainer>
            <PositionContainer
                open={_action == 'update'}
                onClose={async () => router.replace(pathname)}
            >
                <FormUpdateProduct
                    queryKeys={[QueryKey.tableProduct]}
                    onClose={async () => router.replace(pathname)}
                />
            </PositionContainer>
        </>
    );
}


function FormCreateProduct({queryKeys, onClose}: IFormProductProps) {
    const queryClient = useQueryClient();

    const [images, setImages] = React.useState<string[]>([]);

    const [form, setForm] = React.useState<ICreateProductRequest>({
        name: '',
        description: '',
        price: 0,
        discount: 0,
        discountType: TypeDiscount.Percent,
        categoryIds: [],
        sizePrices: [],
        bestSell: BooleanType.False,
        remarked: BooleanType.False,
        type: ProductType.Main,
        imageUrls: []
    });

    const {data: listCategory = []} = useQuery<ICategoryDto[]>({
        queryFn: () => apiRequest({
            api: async () => categoryService.getListAllCategory({}),
        }),
        select(data: ICategoryDto[]) {
            return data;
        },
        queryKey: [QueryKey.listCategory],
    });

    const {data: listSize = []} = useQuery<ISizeDto[]>({
        queryFn: () => apiRequest({
            api: async () => sizeService.getListSize(),
        }),
        select(data: ISizeDto[]) {
            return data;
        },
        queryKey: [QueryKey.listSize],
    });

    const funcCreateProduct = useMutation({
        mutationFn: (images: string[]) => apiRequest({
            showMessageFailed: true,
            showMessageSuccess: true,
            msgSuccess: 'Thêm sản phẩm thành công!',
            api: async () => productService.createProduct({
                ...form,
                price: price(form.price),
                discount: price(form.discount ?? 0),
                imageUrls: images,
            })
        }),
        onSuccess: () => {
            onClose();
            // @ts-ignore
            queryKeys?.map((key) => queryClient.invalidateQueries([key]));
        },
        onError: (error) => {
            console.error('Error creating product:', error);
        }
    });

    const handleSubmit = async () => {
        if (images.length > 0) {
            const imgs = images?.map((v: any) => v?.file);

            const dataImage = await apiRequest({
                api: () => uploadFileService.uploadMultiFile(imgs),
            });

            console.log('uploaded image:', dataImage);
            if (dataImage !== null) {
                return funcCreateProduct.mutate(dataImage);
            } else {
                return toast.warn('Upload ảnh thất bại!', ToastCustom.toastWarn);
            }
        } else {
            return funcCreateProduct.mutate([]);
        }
    }

    return (
        <Form form={form} setForm={setForm} onSubmit={handleSubmit}>
            <Loading loading={funcCreateProduct.isPending}/>
            <div className="relative w-[540px] h-screen bg-white flex flex-col">
                <h4 className="text-[#2f3d50] text-xl font-semibold p-6">Thêm sản phẩm</h4>
                <div className="flex-1 overflow-auto bg-[#f4f5f6] rounded-2xl p-6 flex flex-col gap-4">
                    <Input
                        placeholder='Nhập tên sản phẩm'
                        name='name'
                        type='text'
                        isRequired
                        label={
                            <span>
								Tên sản phẩm <span style={{color: 'red'}}>*</span>
							</span>
                        }
                    />
                    <div className="flex w-fit items-center justify-center gap-2">
                        <div
                            className={clsx("cursor-pointer border border-gray-300 rounded-md p-2",
                                {'border-red-400 bg-red-400 text-white': form.type === ProductType.Main})
                            }
                            onClick={() => setForm({
                                ...form,
                                type: ProductType.Main
                            })}
                        >
                            Sản phẩm chính
                        </div>
                        <div
                            className={clsx("cursor-pointer border border-gray-300 rounded-md p-2",
                                {'border-red-400 bg-red-400 text-white': form.type === ProductType.Topping})
                            }
                            onClick={() => setForm({
                                ...form,
                                type: ProductType.Topping,
                                sizePrices: [], // Reset size prices when switching to Topping
                                remarked: BooleanType.False,
                                bestSell: BooleanType.False,
                                discount: 0,
                                categoryIds: [],
                                discountType: TypeDiscount.Percent,
                            })}
                        >
                            Topping
                        </div>
                    </div>
                    <Input
                        placeholder='Nhập giá sản phẩm'
                        name='price'
                        type='text'
                        isRequired
                        isMoney
                        label={
                            <span>
								Giá sản phẩm <span style={{color: 'red'}}>*</span>
							</span>
                        }
                    />
                    {form.type === ProductType.Main && (
                        <>
                            <SelectMany
                                text={"Danh mục"}
                                label='Danh mục'
                                placeholder='Chọn danh mục'
                                selectedItems={form.categoryIds}
                                options={listCategory}
                                setSelectedItems={(list) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        categoryIds: list as number[],
                                    }))
                                }
                                onRemove={(item) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        categoryIds: prev.categoryIds.filter((v) => v !== item)
                                    }))
                                }
                                getOptionLabel={(item) => item.name}
                                getOptionValue={(item) => item.id}
                            />
                            <div>
                                <span className="font-[500] text-[16px] mb-2 block">Giá theo size</span>
                                {form.sizePrices.map((_, index) =>
                                    <SizePrice
                                        index={index}
                                        form={form}
                                        setForm={setForm}
                                        listSize={listSize}/>
                                )}
                                {form.sizePrices.length < listSize.length &&
                                    <p
                                        className="cursor-pointer text-blue-600"
                                        onClick={() => setForm((prev) => {
                                            if (prev.sizePrices.length === listSize.length) return prev;
                                            return {
                                                ...prev,
                                                sizePrices: [
                                                    ...prev.sizePrices,
                                                    {
                                                        sizeId: 0,
                                                        price: 0,
                                                    },
                                                ],
                                            };
                                        })}>
                                        Thêm size
                                    </p>
                                }
                            </div>
                            <div className="flex gap-4 flex-row">
                                <Input
                                    placeholder='Giảm giá'
                                    name='discount'
                                    type='text'
                                    isMoney
                                    min={0}
                                    max={form.discountType == TypeDiscount.Percent ? 100 : form.price}
                                    label={
                                        <span>
								Giảm giá
							</span>
                                    }
                                    className={"flex-1"}
                                />
                                <SelectForm
                                    placeholder='Lựa chọn'
                                    label={
                                        <span>
									Loại giảm giá
								</span>
                                    }
                                    isSearch={false}
                                    value={form.discountType}
                                    options={[
                                        {
                                            label: '%',
                                            value: TypeDiscount.Percent,
                                        },
                                        {
                                            label: 'VNĐ',
                                            value: TypeDiscount.Absolute,
                                        }
                                    ]}
                                    getOptionLabel={(opt) => opt.label}
                                    getOptionValue={(opt) => opt.value}
                                    onSelect={(opt) => {
                                        setForm((prev) => ({
                                            ...prev,
                                            discountType: opt.value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-4 justify-start">
                                <div className="flex items-center justify-start gap-[10px]">
                                    <input type="checkbox" id="remarked" className="w-6 h-6"
                                           checked={form.remarked == BooleanType.True}
                                           onChange={(e) => {
                                               setForm((prev) => ({
                                                   ...prev,
                                                   remarked: e.target.checked ? BooleanType.True : BooleanType.False,
                                               }));
                                           }}
                                    />
                                    <label htmlFor="remarked" className="text-[16px] font-[500] block mb-0!">Nổi bật</label>
                                </div>
                                <div className="flex items-center justify-start gap-[10px]">
                                    <input type="checkbox" id="bestSell" className="w-6 h-6"
                                           checked={form.bestSell == BooleanType.True}
                                           onChange={(e) => {
                                               setForm((prev) => ({
                                                   ...prev,
                                                   bestSell: e.target.checked ? BooleanType.True : BooleanType.False,
                                               }));
                                           }}
                                    />
                                    <label htmlFor="bestSell" className="text-[16px] font-[500] block mb-0!">Best
                                        seller</label>
                                </div>
                            </div>
                        </>
                    )}

                    <TextArea name='description' placeholder='Nhập mô tả' label='Mô tả'/>
                    <UploadMultipleFile images={images} setImages={setImages}/>
                </div>
                <div className="flex items-center justify-end gap-[10px] p-6">
                    <div>
                        <Button p_12_20 grey rounded_6 onClick={onClose}>
                            Hủy bỏ
                        </Button>
                    </div>
                    <FormContext.Consumer>
                        {({isDone}) => (
                            <div className="">
                                <Button disable={!isDone} p_12_20 blue rounded_6
                                        icon={<FolderOpen size={18} color='#fff'/>}>
                                    Lưu lại
                                </Button>
                            </div>
                        )}
                    </FormContext.Consumer>
                </div>
                <div className="cursor-pointer select-none absolute top-5 right-5 transition active:scale-90"
                     onClick={onClose}>
                    <IoClose size={28} color='#8492A6'/>
                </div>
            </div>
        </Form>
    )
        ;
}

interface ISizePriceProp {
    index: number;
    form: ICreateProductRequest;
    setForm: Dispatch<SetStateAction<any>>;
    listSize: ISizeDto[];
}

function SizePrice({
                       index,
                       form,
                       setForm,
                       listSize,
                   }: ISizePriceProp) {
    const selectedSizeIds = new Set(form.sizePrices.filter((_, i) => i !== index).map((item) => item.sizeId));
    const filteredListSize = listSize.filter((f) => !selectedSizeIds.has(f.id));

    const handleSelectSize = (index: number, value: number) => {
        setForm((prev: any) => {
            const updatedList = [...prev.sizePrices];
            updatedList[index] = {
                ...updatedList[index],
                sizeId: value,
            };
            return {...prev, sizePrices: updatedList};
        });
    };

    const handleDeleteSizePrice = (index: number) => {
        setForm((prev: any) => ({
            ...prev,
            sizePrices: prev.sizePrices.filter((_: any, i: any) => i !== index)
        }));
    };

    return (
        <div className="[&+&]:mt-3">
            <GridColumn col_2>
                <SelectForm
                    placeholder='Chọn size'
                    value={form.sizePrices?.[index]?.sizeId}
                    options={filteredListSize}
                    getOptionLabel={(opt) => opt.name}
                    getOptionValue={(opt) => opt.id}
                    onSelect={(val) => handleSelectSize(index, val.id)}
                />
                <div className="flex items-end gap-3">
                    <div className="flex-1">
                        <Input
                            placeholder='Nhập giá'
                            name={`sizePrice-${index}`}
                            isMoney
                            type="text"
                            unit="VNĐ"
                            value={form?.sizePrices?.[index]?.price ?? 0}
                            onChange={(e: any) => {
                                const value = e.target.value;
                                console.log('value:', value);
                                setForm((prev: any) => {
                                    const updatedList = [...prev.sizePrices];
                                    updatedList[index] = {
                                        ...updatedList[index],
                                        price: value ? parseInt(value, 10) : 0,
                                    };
                                    return {...prev, sizePrices: updatedList};
                                });
                            }}
                        />
                    </div>
                    <div
                        className="cursor-pointer w-12 h-12 flex justify-center items-center rounded-lg bg-[rgba(244,97,97,0.2)] transition duration-300 hover:bg-[rgba(244,97,97,0.5)] active:scale-95"
                        onClick={() => handleDeleteSizePrice(index)}>
                        <Trash color='#F46161' size={24}/>
                    </div>
                </div>
            </GridColumn>
        </div>
    );
}

function FormUpdateProduct({queryKeys, onClose}: IFormProductProps) {
    const queryClient = useQueryClient()
    const searchParams = useSearchParams();
    const [_id] = useState(searchParams.get('_id'));
    const [images, setImages] = React.useState<any[]>([]);

    const [form, setForm] = React.useState<IUpdateProductRequest>({
        id: 0,
        name: '',
        description: '',
        price: 0,
        discount: 0,
        discountType: TypeDiscount.Percent,
        categoryIds: [],
        sizePrices: [],
        bestSell: BooleanType.False,
        remarked: BooleanType.False,
        type: ProductType.Main,
        imageUrls: []
    })

    const {data: listCategory = []} = useQuery<ICategoryDto[]>({
        queryFn: () => apiRequest({
            api: async () => categoryService.getListAllCategory({}),
        }),
        select(data: ICategoryDto[]) {
            return data;
        },
        queryKey: [],
        enabled: true,
    });

    const {data: listSize = []} = useQuery<ISizeDto[]>({
        queryFn: () => apiRequest({
            api: async () => sizeService.getListSize(),
        }),
        select(data: ISizeDto[]) {
            return data;
        },
        queryKey: [QueryKey.listSize],
    });


    const {data: detailProduct, isFetched: detailProductFetched} = useQuery<IProductDetailDto>({
        queryFn: () =>
            apiRequest({
                api: async () => productService.detailProduct({
                    id: Number(_id),
                }),
            }),
        select(data: IProductDetailDto) {
            return data;
        },
        enabled: _id !== null,
        queryKey: [_id],
    });

    useEffect(() => {
        if (!!detailProduct) {
            setForm({
                id: detailProduct.id,
                name: detailProduct.name,
                description: detailProduct.description,
                price: detailProduct.price,
                discount: detailProduct.discount,
                discountType: detailProduct.discountType,
                categoryIds: detailProduct.categories.map(c => c.id),
                imageUrls: detailProduct.imageUrls,
                sizePrices: detailProduct.sizePrices.map(s => ({sizeId: s.size.id, price: s.price})),
                remarked: detailProduct.remarked,
                bestSell: detailProduct.bestSell,
                type: detailProduct.type,
            });
            setImages(detailProduct.imageUrls.map(x => {
                return {resource: x};
            }))
        }
    }, [detailProductFetched])


    const funcUpdateProduct = useMutation({
        mutationFn: (images: string[]) => apiRequest({
            showMessageFailed: true,
            showMessageSuccess: true,
            msgSuccess: 'Thêm sản phẩm thành công!',
            api: async () => productService.updateProduct({
                ...form,
                price: price(form.price),
                discount: price(form.discount ?? 0),
                imageUrls: images,
            })
        }),
        onSuccess: () => {
            onClose();
            // @ts-ignore
            queryKeys?.map((key) => queryClient.invalidateQueries([key]));
        },
        onError: (error) => {
            console.error('Error creating product:', error);
        }
    });

    const handleSubmit = async () => {
        const remainingImages = images.filter((v: any) => v?.resource !== undefined).map(x => x.resource);
        const newImages = images.filter((v: any) => v?.file !== undefined);

        if (newImages.length > 0) {
            const imgs = newImages?.map((v: any) => v?.file);

            const dataImage = await apiRequest({
                api: () => uploadFileService.uploadMultiFile(imgs),
            });

            if (dataImage !== null) {
                return funcUpdateProduct.mutate([...remainingImages, ...dataImage]);
            } else {
                return toast.error('Upload ảnh thất bại!', ToastCustom.toastError);
            }
        } else {
            return funcUpdateProduct.mutate(remainingImages);
        }
    }

    return (
        <Form form={form} setForm={setForm} onSubmit={handleSubmit}>
            <Loading loading={funcUpdateProduct.isPending}/>
            <div className="relative w-[540px] h-screen bg-white flex flex-col">
                <h4 className="text-[#2f3d50] text-xl font-semibold p-6">Chỉnh sửa sản phẩm</h4>
                <div className="flex-1 overflow-auto bg-[#f4f5f6] rounded-2xl p-6 flex flex-col gap-4">
                    <Input
                        placeholder='Nhập tên sản phẩm'
                        name='name'
                        type='text'
                        isRequired
                        label={
                            <span>
								Tên sản phẩm <span style={{color: 'red'}}>*</span>
							</span>
                        }
                    />
                    <div className="flex w-fit items-center justify-center gap-2">
                        <div className={clsx("cursor-pointer border border-gray-300 rounded-md p-2 border-red-400 bg-red-400 text-white")}>
                            {form.type === ProductType.Main ? 'Sản phẩm chính' : 'Topping'}
                        </div>
                    </div>

                    <Input
                        placeholder='Nhập giá sản phẩm'
                        name='price'
                        type='text'
                        isRequired
                        isMoney
                        label={
                            <span>
								Giá sản phẩm <span style={{color: 'red'}}>*</span>
							</span>
                        }
                    />
                    <SelectMany
                    text={"danh mục"}
                    label='Chọn danh mục'
                    placeholder='Chọn danh mục'
                    selectedItems={form.categoryIds}
                    options={listCategory}
                    setSelectedItems={(list) =>
                        setForm((prev) => ({
                            ...prev,
                            categoryIds: list as number[],
                        }))
                    }
                    onRemove={(item) =>
                        setForm((prev) => ({
                            ...prev,
                            categoryIds: prev.categoryIds.filter((v) => v !== item)
                        }))
                    }
                    getOptionLabel={(item) => item.name}
                    getOptionValue={(item) => item.id}
                />
                    <div>
                        <span className="font-[500] text-[16px] mb-2 block">Giá theo size</span>
                        {form.sizePrices.map((_, index) =>
                            <SizePrice
                                index={index}
                                form={form}
                                setForm={setForm}
                                listSize={listSize}/>
                        )}
                        {form.sizePrices.length < listSize.length &&
                            <p
                                className="cursor-pointer text-blue-600"
                                onClick={() => setForm((prev) => {
                                    if (prev.sizePrices.length === listSize.length) return prev;
                                    return {
                                        ...prev,
                                        sizePrices: [
                                            ...prev.sizePrices,
                                            {
                                                sizeId: 0,
                                                price: 0,
                                            },
                                        ],
                                    };
                                })}>
                                Thêm size
                            </p>
                        }
                    </div>
                    <div className="flex gap-4 flex-row">
                        <Input
                            placeholder='Giảm giá'
                            name='discount'
                            type='text'
                            isMoney
                            min={0}
                            max={form.discountType == TypeDiscount.Percent ? 100 : form.price}
                            label={
                                <span>
								Giảm giá
							</span>
                            }
                            className={"flex-1"}
                        />
                        <SelectForm
                            placeholder='Lựa chọn'
                            label={
                                <span>
									Loại giảm giá
								</span>
                            }
                            isSearch={false}
                            value={form.discountType}
                            options={[
                                {
                                    label: '%',
                                    value: TypeDiscount.Percent,
                                },
                                {
                                    label: 'VNĐ',
                                    value: TypeDiscount.Absolute,
                                }
                            ]}
                            getOptionLabel={(opt) => opt.label}
                            getOptionValue={(opt) => opt.value}
                            onSelect={(opt) => {
                                setForm((prev) => ({
                                    ...prev,
                                    discountType: opt.value,
                                }));
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-4 justify-start">
                        <div className="flex items-center justify-start gap-[10px]">
                            <input type="checkbox" id="remarked" className="w-6 h-6"
                                   checked={form.remarked == BooleanType.True}
                                   onChange={(e) => {
                                       setForm((prev) => ({
                                           ...prev,
                                           remarked: e.target.checked ? BooleanType.True : BooleanType.False,
                                       }));
                                   }}
                            />
                            <label htmlFor="remarked" className="text-[16px] font-[500] block mb-0!">Nổi bật</label>
                        </div>
                        <div className="flex items-center justify-start gap-[10px]">
                            <input type="checkbox" id="bestSell" className="w-6 h-6"
                                   checked={form.bestSell == BooleanType.True}
                                   onChange={(e) => {
                                       setForm((prev) => ({
                                           ...prev,
                                           bestSell: e.target.checked ? BooleanType.True : BooleanType.False,
                                       }));
                                   }}
                            />
                            <label htmlFor="bestSell" className="text-[16px] font-[500] block mb-0!">Best
                                seller</label>
                        </div>
                    </div>
                    <TextArea name='description' placeholder='Nhập mô tả' label='Mô tả'/>
                    <UploadMultipleFile images={images} setImages={setImages}/>
                </div>
                <div className="flex items-center justify-end gap-[10px] p-6">
                    <div>
                        <Button p_12_20 grey rounded_6 onClick={onClose}>
                            Hủy bỏ
                        </Button>
                    </div>
                    <FormContext.Consumer>
                        {({isDone}) => (
                            <div className="">
                                <Button disable={!isDone} p_12_20 blue rounded_6
                                        icon={<FolderOpen size={18} color='#fff'/>}>
                                    Lưu lại
                                </Button>
                            </div>
                        )}
                    </FormContext.Consumer>
                </div>
                <div className="cursor-pointer select-none absolute top-5 right-5 transition active:scale-90"
                     onClick={onClose}>
                    <IoClose size={28} color='#8492A6'/>
                </div>
            </div>
        </Form>
    );
}