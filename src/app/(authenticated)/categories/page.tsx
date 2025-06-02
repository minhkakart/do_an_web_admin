'use client';
import React, {useEffect, useState} from "react";
import Image from 'next/image';
import icons from "~/constants/images/icons";
import Button from "~/components/commons/Button";
import PositionContainer from "~/components/commons/PositionContainer";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {QueryKey} from "~/constants/config/enum";
import Form, {FormContext, Input} from "~/components/commons/Form";
import {Edit, FolderOpen} from "iconsax-react";
import {IoClose} from "react-icons/io5";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import TextArea from "~/components/commons/Form/components/TextArea";
import {httpRequest} from "~/services";
import categoryService from "~/services/apis/categoryService";
import Loading from "~/components/commons/Loading";
import {
    IFormCreateCategory,
    IFormCategoryProps, IFormUpdateCategory,
    ITableCategory, ICategoryDto
} from "~/app/(authenticated)/categories/interfaces";
import {IPageResponse} from "~/commons/interfaces";
import Pagination from "~/components/commons/Pagination";
import {PageSize} from "~/constants/config";
import DataWrapper from "~/components/commons/DataWrapper";
import Table from "~/components/commons/Table";
import Moment from "react-moment";
import IconCustom from "~/components/commons/IconCustom";
import Search from "~/components/commons/Search";

export default function Categories() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const _action = searchParams.get('_action');
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(PageSize[0]);
    const [keyword, setKeyword] = useState<string>('');

    const {data, isLoading} = useQuery<IPageResponse<ITableCategory>>({
        queryFn: () =>
            httpRequest({
                showLoading: false,
                http: async () => categoryService.getListPageCategory({
                    page: page,
                    size: pageSize,
                    keyword: keyword,
                }),
            }),
        select(data: IPageResponse<ITableCategory>) {
            return data;
        },
        queryKey: [QueryKey.tableCategory, keyword, page, pageSize],
    });

    return (
        <>
            <Loading loading={isLoading} />
            <div className="flex justify-between items-center gap-3 flex-wrap mb-3">
                <div className="flex gap-3 flex-wrap">
                    <div className="min-w-[400px]">
                        <Search placeholder='Nhập từ khóa tìm kiếm' keyword={keyword} setKeyword={setKeyword}/>
                    </div>
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
                        Thêm danh mục
                    </Button>
                </div>
            </div>

            <DataWrapper
                loading={isLoading}
                data={data?.items || []}
                title='Danh sách danh mục'

            >
                <Table<ITableCategory>
                    data={data?.items || []}
                    rowKey={(row) => row.id}
                    column={[
                        {
                            title: 'STT',
                            render: (_, index) => <>{index + 1}</>,
                        },
                        {
                            title: 'Tên danh mục',
                            render: (row, _) => <>{row.name || '---'}</>,
                        },
                        {
                            title: 'Số lượng sản phẩm',
                            render: (row, _) => <>{row.numProduct}</>,
                        },
                        {
                            title: 'Mô tả',
                            render: (row, _) => <>{row.description || '---'}</>,
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
                            title: 'Tác vụ',
                            fixedRight: true,
                            render: (row, _) => (
                                <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
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
                <FormCreateCategory
                    queryKeys={[QueryKey.tableCategory]}
                    onClose={async () => router.replace(pathname)}
                />
            </PositionContainer>
            <PositionContainer
                open={_action == 'update'}
                onClose={async () => router.replace(pathname)}
            >
                <FormUpdateCategory
                    queryKeys={[QueryKey.tableCategory]}
                    onClose={async () => router.replace(pathname)}
                />
            </PositionContainer>
        </>

    );
}

function FormCreateCategory({queryKeys, onClose}: IFormCategoryProps) {
    const queryClient = useQueryClient();

    const [form, setForm] = React.useState<IFormCreateCategory>({
        name: '',
        description: '',
    })

    const funcCreateCategory = useMutation({
        mutationFn: () => httpRequest({
            showMessageFailed: true,
            showMessageSuccess: true,
            showLoading: false,
            msgSuccess: 'Thêm danh mục thành công!',
            http: async () => categoryService.createCategory({
                name: form.name,
                description: form.description,
            })
        }),
        onSuccess: () => {
            onClose && onClose();
            // @ts-ignore
            queryKeys?.map((key) => queryClient.invalidateQueries([key]));
        },
        onError: (error) => {
            console.error('Error creating category:', error);
        }
    });

    const handleSubmit = () => {
        return funcCreateCategory.mutate();
    }

    return (
        <Form
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
        >
            <Loading loading={funcCreateCategory.isPending}/>
            <div className="relative w-[540px] h-screen bg-white flex flex-col">
                <h4 className="text-[#2f3d50] text-xl font-semibold p-6">Thêm danh mục</h4>
                <div className="flex-1 overflow-auto bg-[#f4f5f6] rounded-2xl p-6">
                    <Input
                        placeholder='Nhập tên danh mục'
                        name='name'
                        type='text'
                        isRequired
                        label={
                            <span>
								Tên danh mục <span style={{color: 'red'}}>*</span>
							</span>
                        }
                    />
                    <div className="mt-4">
                        <TextArea name='description' placeholder='Nhập mô tả' label='Mô tả'/>
                    </div>
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

function FormUpdateCategory({queryKeys, onClose}: IFormCategoryProps) {
    const queryClient = useQueryClient()
    const searchParams = useSearchParams();
    const [_id] = useState(searchParams.get('_id'));

    const [form, setForm] = React.useState<IFormUpdateCategory>({
        id: 0,
        name: '',
        description: '',
    })
    const {data, isFetched} = useQuery<ICategoryDto | null>({
        queryFn: () =>
            httpRequest({
                showLoading: false,
                http: async () => categoryService.detailCategory({
                    id: Number(_id),
                }),
            }),
        select(data: ICategoryDto | null) {
            return data;
        },
        enabled: _id !== null,
        queryKey: [_id],
    });

    useEffect(() => {
        if (!!data){
            setForm(data!);
        }
    },[isFetched])

    const funcUpdateCategory = useMutation({
        mutationFn: () => httpRequest({
            showMessageFailed: true,
            showMessageSuccess: true,
            showLoading: false,
            msgSuccess: 'Chỉnh sửa danh mục thành công!',
            http: async () => categoryService.updateCategory({
                id: form?.id ?? 0,
                name: form?.name ?? "",
                description: form?.description ?? "",
            }),
        }),
        onSuccess: () => {
            onClose && onClose();
            // @ts-ignore
            queryKeys?.map((key) => queryClient.invalidateQueries([key]));
        },
        onError: (error) => {
            console.error('Error updating category:', error);
        }
    });

    const handleSubmit = () => {
        return funcUpdateCategory.mutate();
    }

    return (
        <Form
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
        >
            <Loading loading={funcUpdateCategory.isPending}/>
            <div className="relative w-[540px] h-screen bg-white flex flex-col">
                <h4 className="text-[#2f3d50] text-xl font-semibold p-6">Cập nhật danh mục</h4>
                <div className="flex-1 overflow-auto bg-[#f4f5f6] rounded-2xl p-6">
                    <Input
                        placeholder='Nhập tên danh mục'
                        name='name'
                        type='text'
                        isRequired
                        label={
                            <span>
								Tên danh mục <span style={{color: 'red'}}>*</span>
							</span>
                        }
                    />
                    <div className="mt-4">
                        <TextArea name='description' placeholder='Nhập mô tả' label='Mô tả'/>
                    </div>
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
                                <Button disable={!isDone && isFetched} p_12_20 blue rounded_6
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