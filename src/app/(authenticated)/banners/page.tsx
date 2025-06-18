'use client';
import React, {useRef, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {PageSize} from "~/constants/config";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {IFormProps, IPageResponse} from "~/commons/interfaces";
import {apiRequest} from "~/services";
import {BooleanType, QueryKey} from "~/constants/config/enum";
import Button from "~/components/commons/Button";
import Image from "next/image";
import icons from "~/constants/images/icons";
import DataWrapper from "~/components/commons/DataWrapper";
import Table from "~/components/commons/Table";
import Moment from "react-moment";
import IconCustom from "~/components/commons/IconCustom";
import {Danger, Edit, FolderOpen, Trash} from "iconsax-react";
import Pagination from "~/components/commons/Pagination";
import {IBannerDto, IFormUpdateBanner, IUpsertBannerRequest} from "~/app/(authenticated)/banners/interfaces";
import lgZoom from "lightgallery/plugins/zoom";
import lgShare from "lightgallery/plugins/share";
import lgHash from "lightgallery/plugins/hash";
import LightGallery from "lightgallery/react";
import StateActive from "~/components/commons/StateActive";
import PositionContainer from "~/components/commons/PositionContainer";
import Form, {FormContext, Input} from "~/components/commons/Form";
import bannerService from "~/services/apis/bannerService";
import UploadSingleFile from "~/components/commons/UploadSingleFile/UploadSingleFile";
import uploadFileService from "~/services/apis/uploadFileService";
import Dialog from "~/components/commons/Dialog";
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-share.css';
import {toast} from "react-toastify";
import {ToastCustom} from "~/commons/funcs/toast";

function Page() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const _action = searchParams.get('_action');
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(PageSize[0]);

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [updateData, setUpdateData] = useState<IBannerDto | null>(null);

    const refLightGallery = useRef<any>(null);

    const {data: listBanner, isLoading: loadingBanner} = useQuery<IPageResponse<IBannerDto>>({
        queryFn: () =>
            apiRequest({
                api: async () => bannerService.getListPageBanner({
                    page: page,
                    size: pageSize,
                }),
            }),
        select(data: IPageResponse<IBannerDto>) {
            return data;
        },
        queryKey: [QueryKey.tableBanner, page, pageSize],
    });

    const funcDeleteBanner = useMutation({
        mutationFn: () => apiRequest({
            showMessageFailed: true,
            showMessageSuccess: true,
            msgSuccess: 'Chỉnh sửa danh mục thành công!',
            api: async () => bannerService.deleteBanner({
                id: deleteId!,
            }),
        }),
        async onSuccess() {
            setDeleteId(null);
            await queryClient.invalidateQueries({queryKey: [QueryKey.tableBanner]});
        },
    })

    return (
        <>
            <div className="flex justify-between items-center gap-3 flex-wrap mb-3">
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
                        Thêm banner
                    </Button>
                </div>
            </div>

            <DataWrapper
                loading={loadingBanner}
                data={listBanner?.items || []}
                title='Danh sách danh mục'

            >
                <Table<IBannerDto>
                    data={listBanner?.items || []}
                    rowKey={(row) => row.id}
                    column={[
                        {
                            title: 'STT',
                            render: (_, index) => <>{index + 1}</>,
                        },
                        {
                            title: 'Hình ảnh',
                            render: (row, _) => <>{row.imageUrl && (
                                <LightGallery
                                    plugins={[lgZoom, lgShare, lgHash]}
                                    selector={'.slick__slide'}
                                    speed={500}
                                    onInit={(detail: any) => {
                                        refLightGallery.current = detail.instance;
                                    }}
                                >
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <a className={'slick__slide'}
                                           data-src={`${process.env.NEXT_PUBLIC_API}/${row.imageUrl}`}>
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_API}/${row.imageUrl}`}
                                                alt='image slider'
                                                objectFit='cover'
                                                width={80}
                                                height={98}
                                                style={{borderRadius: '8px', cursor: 'pointer', userSelect: 'none'}}
                                            />
                                        </a>
                                    </div>
                                </LightGallery>
                            )}</>,
                        },
                        {
                            title: 'Thứ tự',
                            render: (row, _) => <>{row.order}</>,
                        },
                        {
                            title: 'Trạng thái',
                            render: (row, _) =>
                                <StateActive
                                    stateActive={row?.isActive}
                                    listState={[
                                        {
                                            backgroundColor: 'rgba(29, 201, 77, 0.15)',
                                            state: BooleanType.True,
                                            text: 'Đang sử dụng',
                                            textColor: '#1DC94D',
                                        },
                                        {
                                            backgroundColor: 'rgba(244, 97, 97, 0.15)',
                                            state: BooleanType.False,
                                            text: 'Không sử dụng',
                                            textColor: '#F46161',
                                        },
                                    ]}
                                />
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
                                        onClick={
                                            () => {
                                                setUpdateData(row);
                                                const currentParams = new URLSearchParams(searchParams.toString());
                                                currentParams.set('_action', 'update');
                                                currentParams.set('_id', row.id.toString());
                                                router.replace(`?${currentParams.toString()}`);
                                            }
                                        }
                                    />
                                    <IconCustom
                                        icon={<Trash color='#F53C3CFF' size={24}/>}
                                        tooltip='Xóa'
                                        background='rgba(244, 97, 97, 0.3)'
                                        onClick={() => {
                                            setDeleteId(row?.id)
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
                total={listBanner?.pagination?.totalCount || 0}
                dependencies={[pageSize]}
            />

            <PositionContainer
                open={_action == 'create'}
                onClose={async () => router.replace(pathname)}
            >
                <FormCreateBanner
                    queryKeys={[QueryKey.tableBanner]}
                    onClose={async () => router.replace(pathname)}
                />
            </PositionContainer>

            <PositionContainer
                open={_action == 'update'}
                onClose={async () => {
                    setUpdateData(null)
                    router.replace(pathname)
                }}
            >
                <FormUpdateBanner
                    queryKeys={[QueryKey.tableBanner]}
                    onClose={async () => router.replace(pathname)}
                    data={updateData!}
                />
            </PositionContainer>

            <Dialog
                type='error'
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                title='Xóa banner'
                note='Bạn có chắc chắn muốn xóa banner này?'
                icon={
                    <Danger size='76' color='#F46161' variant='Bold'/>
                }
                onSubmit={funcDeleteBanner.mutate}
            />
        </>
    );
}

export default Page;

function FormCreateBanner({queryKeys, onClose}: IFormProps) {
    const queryClient = useQueryClient();

    const [image, setImage] = React.useState<any>();

    const [form, setForm] = React.useState<IUpsertBannerRequest>({
        id: null,
        imageUrl: '',
        order: 1,
        isActive: BooleanType.True,
    });

    const funcCreateBanner = useMutation({
        mutationFn: (image: string) => apiRequest({
            showMessageFailed: true,
            showMessageSuccess: true,
            msgSuccess: 'Thêm banner thành công!',
            api: () => bannerService.upsertBanner({
                ...form,
                imageUrl: image,
            }),
        }),
        onSuccess: () => {
            onClose && onClose();
            // @ts-ignore
            queryKeys?.map((key) => queryClient.invalidateQueries([key]));
        },
    });

    const handleSubmit = async () => {
        if (!!image?.file) {
            const imageUrl: string = await apiRequest({
                api: () => uploadFileService.uploadSingleFile(image.file),
            });
            if (imageUrl !== null) {
                return funcCreateBanner.mutate(imageUrl);
            } else {
                return toast.error('Upload ảnh thất bại!', ToastCustom.toastError);
            }
        } else {
            return toast.warn('Ảnh không được để trống!', ToastCustom.toastWarn);
        }
    }

    return (
        <Form form={form} setForm={setForm} onSubmit={handleSubmit}>
            <div className="relative w-[540px] h-screen bg-white flex flex-col p-6 gap-4">
                <h4 className="text-[#2f3d50] text-xl font-semibold py-6">Thêm mới banner</h4>

                <div>
                    <span className="text-[16px] font-[600] mb-2 block">Chọn ảnh<span
                        style={{color: 'red'}}>*</span></span>
                    <UploadSingleFile file={image} setFile={setImage}/>
                </div>
                <Input
                    placeholder=""
                    name='order'
                    type='text'
                    isRequired
                    label={
                        <span>
								Thứ tự <span style={{color: 'red'}}>*</span>
                        </span>
                    }
                />

                <div className="flex items-center justify-end gap-[10px]">
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
            </div>
        </Form>
    );

}

function FormUpdateBanner({queryKeys, onClose, data}: IFormUpdateBanner) {
    const queryClient = useQueryClient();

    const [image, setImage] = React.useState<any>({resource: data?.imageUrl});

    const [form, setForm] = React.useState<IUpsertBannerRequest>({
        ...data
    });

    const funcUpdateBanner = useMutation({
        mutationFn: (image: string) => apiRequest({
            showMessageFailed: true,
            showMessageSuccess: true,
            msgSuccess: 'Chỉnh sửa banner thành công!',
            api: () => bannerService.upsertBanner({
                ...form,
                imageUrl: image,
            }),
        }),
        onSuccess: () => {
            onClose && onClose();
            // @ts-ignore
            queryKeys?.map((key) => queryClient.invalidateQueries([key]));
        },
    });

    const handleSubmit = async () => {
        if (!!image?.file) {
            const imageUrl: string = await apiRequest({
                api: () => uploadFileService.uploadSingleFile(image.file),
            });
            if (imageUrl !== null) {
                return funcUpdateBanner.mutate(imageUrl);
            } else {
                return toast.error('Upload ảnh thất bại!', ToastCustom.toastError);
            }
        } else {
            return funcUpdateBanner.mutate(form.imageUrl);
        }
    }

    const handleChangeActive = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            isActive: e.target.checked ? BooleanType.True : BooleanType.False,
        });
    }

    return (
        <Form form={form} setForm={setForm} onSubmit={handleSubmit}>
            <div className="relative w-[540px] h-screen bg-white flex flex-col p-6 gap-4">
                <h4 className="text-[#2f3d50] text-xl font-semibold py-6">Chỉnh sửa banner</h4>
                <div>
                    <span className="text-[16px] font-[600] mb-2 block">Chọn ảnh<span
                        style={{color: 'red'}}>*</span></span>
                    <UploadSingleFile file={image} setFile={setImage}/>
                </div>
                <Input
                    placeholder=""
                    name='order'
                    type='text'
                    isRequired
                    label={
                        <span className="text-[16px] font-[600] mb-2 block">
								Thứ tự <span style={{color: 'red'}}>*</span>
                        </span>
                    }
                />

                <div className="flex items-center justify-start gap-[10px]">
                    <input type="checkbox" id="is-active" className="w-6 h-6"
                           checked={form.isActive == BooleanType.True} onChange={handleChangeActive}/>
                    <label htmlFor="is-active" className="text-[16px] font-[600] block mb-0!">Sử dụng</label>
                </div>

                <div className="flex items-center justify-end gap-[10px]">
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
            </div>
        </Form>
    );

}