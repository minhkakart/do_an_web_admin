'use client'

import React, {useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {IPageResponse} from "~/commons/interfaces";
import {httpRequest} from "~/services";
import {BooleanType, QueryKey, TypeDiscount} from "~/constants/config/enum";
import {PageSize} from "~/constants/config";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import productService from "~/services/apis/productService";
import Form, {FormContext, Input} from "~/components/commons/Form";
import Loading from "~/components/commons/Loading";
import TextArea from "~/components/commons/Form/components/TextArea";
import Button from "~/components/commons/Button";
import {Edit, Eye, FolderOpen, Star1} from "iconsax-react";
import {IoClose} from "react-icons/io5";
import {
    ICreateProductRequest,
    IFormProductProps,
    IProductDetailDto,
    IProductListDto,
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
import {toastWarn} from "~/commons/funcs/toast";
import {convertCoin, price} from "~/commons/funcs/convertCoin";
import DataWrapper from "~/components/commons/DataWrapper";
import Table from "~/components/commons/Table";
import Moment from "react-moment";
import IconCustom from "~/components/commons/IconCustom";
import Pagination from "~/components/commons/Pagination";
import StateActive from "~/components/commons/StateActive";
import {HiOutlineLockClosed, HiOutlineLockOpen} from "react-icons/hi";

export default function Products() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const _action = searchParams.get('_action');
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(PageSize[0]);
    const [keyword, setKeyword] = useState<string>('');
    const [available, setAvailable] = useState<number | null>(null);
    const [discounting, setDiscounting] = useState<boolean | null>(null);

    const {data, isLoading} = useQuery<IPageResponse<IProductListDto>>({
        queryFn: () =>
            httpRequest({
                showLoading: false,
                http: async () => productService.getLisPageProduct({
                    page: page,
                    size: pageSize,
                    keyword: keyword,
                    available: available,
                    discounting: discounting
                }),
            }),
        select(data: IPageResponse<IProductListDto>) {
            return data;
        },
        queryKey: [QueryKey.tableProduct, keyword, page, pageSize, available, discounting],
    });

    return (
        <>
            <Loading loading={isLoading}/>
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
                            render: (row, _) => <>{row.name || '---'}</>,
                        },
                        {
                            title: 'Giá',
                            render: (row, _) => <>{convertCoin(row.price)}</>,
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
                            title: 'Số bình luận',
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
                                            // setDataChangeStatus(row)
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
        imageUrls: []
    });

    const {data: listCategory = [], isFetched} = useQuery<ICategoryDto[]>({
        queryFn: () => httpRequest({
            showLoading: false,
            http: async () => categoryService.getListAllCategory({}),
        }),
        select(data: ICategoryDto[]) {
            return data;
        },
        queryKey: [],
        enabled: true,
    });

    const funcCreateProduct = useMutation({
        mutationFn: (images: string[]) => httpRequest({
            showMessageFailed: true,
            showMessageSuccess: true,
            showLoading: false,
            msgSuccess: 'Thêm sản phẩm thành công!',
            http: async () => productService.createProduct({
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

            const dataImage = await httpRequest({
                showLoading: false,
                http: () => uploadFileService.uploadMultiFile(imgs),
            });

            console.log('uploaded image:', dataImage);
            if (dataImage !== null) {
                return funcCreateProduct.mutate(dataImage);
            } else {
                return toastWarn({msg: 'Upload ảnh thất bại!'});
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
        imageUrls: []
    })

    const {data: listCategory = []} = useQuery<ICategoryDto[]>({
        queryFn: () => httpRequest({
            showLoading: false,
            http: async () => categoryService.getListAllCategory({}),
        }),
        select(data: ICategoryDto[]) {
            return data;
        },
        queryKey: [],
        enabled: true,
    });


    const {data: detailProduct, isFetched: detailProductFetched} = useQuery<IProductDetailDto>({
        queryFn: () =>
            httpRequest({
                showLoading: false,
                http: async () => productService.detailProduct({
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
                imageUrls: detailProduct.imageUrls
            });
            setImages(detailProduct.imageUrls.map(x => {
                return {resource: x};
            }))
        }
    }, [detailProductFetched])


    const funcUpdateProduct = useMutation({
        mutationFn: (images: string[]) => httpRequest({
            showMessageFailed: true,
            showMessageSuccess: true,
            showLoading: false,
            msgSuccess: 'Thêm sản phẩm thành công!',
            http: async () => productService.updateProduct({
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

            const dataImage = await httpRequest({
                showLoading: false,
                http: () => uploadFileService.uploadMultiFile(imgs),
            });

            if (dataImage !== null) {
                return funcUpdateProduct.mutate([...remainingImages, ...dataImage]);
            } else {
                return toastWarn({msg: 'Upload ảnh thất bại!'});
            }
        } else {
            return funcUpdateProduct.mutate(remainingImages);
        }
    }

    return (
        <Form form={form} setForm={setForm} onSubmit={handleSubmit}>
            {/*<Loading loading={funcCreateProduct.isPending}/>*/}
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