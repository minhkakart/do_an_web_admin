'use client'
import React, {useState} from 'react';
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {PageSize} from "~/constants/config";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {IFormProps, IPageResponse} from "~/commons/interfaces";
import {apiRequest} from "~/services";
import {QueryKey, TypeDiscount, VoucherState} from "~/constants/config/enum";
import Loading from "~/components/commons/Loading";
import Search from "~/components/commons/Search";
import Button from "~/components/commons/Button";
import Image from "next/image";
import icons from "~/constants/images/icons";
import DataWrapper from "~/components/commons/DataWrapper";
import Table from "~/components/commons/Table";
import Moment from "react-moment";
import IconCustom from "~/components/commons/IconCustom";
import {Edit, FolderOpen} from "iconsax-react";
import Pagination from "~/components/commons/Pagination";
import {IVoucherListDto, IVoucherRequestCreate} from "~/app/(authenticated)/vouchers/interfaces";
import {convertCoin} from "~/commons/funcs/convertCoin";
import StateActive from "~/components/commons/StateActive";
import voucherService from "~/services/apis/voucherService";
import Form from "~/components/commons/Form/Form";
import {FormContext, Input} from "~/components/commons/Form";
import SelectForm from "~/components/commons/SelectForm";
import TextArea from "~/components/commons/Form/components/TextArea";
import {IoClose} from "react-icons/io5";
import PositionContainer from "~/components/commons/PositionContainer";
import moment from "moment";
import {timeSubmit} from "~/commons/funcs/optionConvert";

function Page() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const _action = searchParams.get('_action');
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(PageSize[0]);
    const [keyword, setKeyword] = useState<string>('');

    const {data: listVoucher, isLoading} = useQuery<IPageResponse<IVoucherListDto>>({
        queryFn: () =>
            apiRequest({
                api: async () => voucherService.getListPageVoucher({
                    page: page,
                    size: pageSize,
                    keyword: keyword,
                }),
            }),
        select(data: IPageResponse<IVoucherListDto>) {
            return data;
        },
        queryKey: [QueryKey.tableVoucher, keyword, page, pageSize],
    });

    return (
        <>
            <Loading loading={isLoading}/>
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
                        onClick={
                            () => {
                                const currentParams = new URLSearchParams(searchParams.toString());
                                currentParams.set('_action', 'create');
                                router.replace(`?${currentParams.toString()}`);
                            }
                        }
                    >
                        Thêm voucher
                    </Button>
                </div>
            </div>

            <DataWrapper
                loading={isLoading}
                data={listVoucher?.items || []}
                title='Danh sách voucher'

            >
                <Table<IVoucherListDto>
                    data={listVoucher?.items || []}
                    rowKey={(row) => row.id}
                    column={[
                        {
                            title: 'STT',
                            render: (_, index) => <>{index + 1}</>,
                        },
                        {
                            title: 'Mã voucher',
                            render: (row, _) => <>{row.code || '---'}</>,
                        },
                        {
                            title: 'Mô tả',
                            render: (row, _) => <>{row.description || '---'}</>,
                        },
                        {
                            title: 'Giá trị',
                            render: (row, _) =>
                                <>
                                    {convertCoin(row.value)}{row.discountType === TypeDiscount.Percent ? "%" : "VNĐ"}
                                </>
                        },
                        {
                            title: 'Đơn tối thiểu',
                            render: (row, _) =>
                                <>
                                    {convertCoin(row.minOrderValue)}VNĐ
                                </>
                        },
                        {
                            title: 'Số lượng',
                            render: (row, _) => <>{row.limit == 0 ? "Không giới hạn" : row.limit}</>,
                        },
                        {
                            title: 'Lượt dùng',
                            render: (row, _) => <>{row.timesUsed}</>,
                        },
                        {
                            title: 'Ngày bắt đầu',
                            render: (row, _) => <><Moment date={row?.startTime} format='DD/MM/YYYY'/></>,
                        },
                        {
                            title: 'Ngày kết thúc',
                            render: (row, _) => <><Moment date={row?.endTime} format='DD/MM/YYYY'/></>,
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
                                    stateActive={row?.state}
                                    listState={[
                                        {
                                            backgroundColor: 'rgba(29, 201, 77, 0.15)',
                                            state: VoucherState.InUse,
                                            text: 'Đang áp dụng',
                                            textColor: '#1DC94D',
                                        },
                                        {
                                            backgroundColor: 'rgba(244, 97, 97, 0.15)',
                                            state: VoucherState.NotUse,
                                            text: 'Ngưng áp dụng',
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
                total={listVoucher?.pagination?.totalCount || 0}
                dependencies={[pageSize, keyword]}
            />

            <PositionContainer
                open={_action == 'create'}
                onClose={async () => router.replace(pathname)}
            >
                <FormCreateVoucher
                    queryKeys={[QueryKey.tableVoucher]}
                    onClose={async () => router.replace(pathname)}
                />
            </PositionContainer>
        </>
    );
}

export default Page;


function FormCreateVoucher({queryKeys, onClose}: IFormProps) {
    const queryClient = useQueryClient();

    const [form, setForm] = React.useState<IVoucherRequestCreate>({
        code: '',
        description: '',
        value: 0,
        discountType: TypeDiscount.Percent,
        minOrderValue: 0,
        limit: 0,
        startTime: '',
        endTime: '',
    });

    const funcCreateVoucher = useMutation({
        mutationFn: () => apiRequest({
            showMessageFailed: true,
            showMessageSuccess: true,
            msgSuccess: 'Thêm voucher thành công!',
            api: async () => voucherService.createVoucher({
                ...form,
                startTime: timeSubmit(new Date(moment(form.startTime).format('YYYY-MM-DD'))),
                endTime: form.endTime?.length == 0 ? null : timeSubmit(new Date(moment(form.endTime).format('YYYY-MM-DD')), true),
            })
        }),
        onSuccess: () => {
            onClose && onClose();
            // @ts-ignore
            queryKeys?.map((key) => queryClient.invalidateQueries([key]));
        },
        onError: (error) => {
            console.error('Error creating product:', error);
        }
    });

    const handleSubmit = () => {
        funcCreateVoucher.mutate();
    }

    return (
        <Form form={form} setForm={setForm} onSubmit={handleSubmit}>
            <Loading loading={funcCreateVoucher.isPending}/>
            <div className="relative w-[540px] h-screen bg-white flex flex-col">
                <h4 className="text-[#2f3d50] text-xl font-semibold p-6">Thêm voucher</h4>
                <div className="flex-1 overflow-auto bg-[#f4f5f6] rounded-2xl p-6 flex flex-col gap-4">
                    <Input
                        placeholder='Nhập mã'
                        name='code'
                        type='text'
                        label={
                            <span>
								Mã voucher
							</span>
                        }
                    />
                    <div className="flex gap-4 flex-row">
                        <Input
                            placeholder='Giảm giá'
                            name='value'
                            type='text'
                            isMoney
                            min={0}
                            label={<span>Giảm giá</span>}
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
                    <Input
                        placeholder='Nhập giá đơn tối thiểu'
                        name='minOrderValue'
                        type='text'
                        isMoney
                        min={0}
                        label={<span>Đơn tối thiểu</span>}
                        className={"flex-1"}
                    />

                    <Input
                        placeholder='Nhập số lượng'
                        name='limit'
                        type='text'
                        isMoney
                        min={0}
                        label={<span>Số lượng</span>}
                        className={"flex-1"}
                    />
                    <Input
                        type='date'
                        name='startTime'
                        isBlur={true}
                        isRequired
                        label={<>Ngày bắt đầu<span style={{color: 'red'}}>*</span></>}
                        placeholder='Nhập ngày bắt đầu'
                    />
                    <Input
                        type='date'
                        name='endTime'
                        isBlur={true}
                        label={<span>Ngày kết thúc</span>}
                        placeholder='Nhập ngày kết thúc'
                    />
                    <TextArea name='description' placeholder='Nhập mô tả' label='Mô tả'/>
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
