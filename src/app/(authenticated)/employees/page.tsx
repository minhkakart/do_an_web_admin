'use client';

import React, {useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {PageSize} from "~/constants/config";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {IFormProps, IPageResponse} from "~/commons/interfaces";
import {apiRequest} from "~/services";
import {QueryKey, TypeGender} from "~/constants/config/enum";
import {
    IEmployeeDto,
    IEmployeeInfoDto,
    IEmployeeRequestCreate,
    IEmployeeRequestUpdate
} from "~/app/(authenticated)/employees/interfaces";
import employeeService from "~/services/apis/employeeService";
import Loading from "~/components/commons/Loading";
import Search from "~/components/commons/Search";
import Button from "~/components/commons/Button";
import Image from "next/image";
import icons from "~/constants/images/icons";
import Table from "~/components/commons/Table";
import Moment from "react-moment";
import IconCustom from "~/components/commons/IconCustom";
import {Edit, FolderOpen} from "iconsax-react";
import DataWrapper from "~/components/commons/DataWrapper";
import Pagination from "~/components/commons/Pagination";
import Form from "~/components/commons/Form/Form";
import {FormContext, Input} from "~/components/commons/Form";
import TextArea from "~/components/commons/Form/components/TextArea";
import {IoClose} from "react-icons/io5";
import PositionContainer from "~/components/commons/PositionContainer";
import moment from "moment";

export default function Employees() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const _action = searchParams.get('_action');
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(PageSize[0]);
    const [keyword, setKeyword] = useState<string>('');

    const {data, isLoading} = useQuery<IPageResponse<IEmployeeDto>>({
        queryFn: () =>
            apiRequest({
                api: async () => employeeService.getListPageEmployee({
                    page: page,
                    size: pageSize,
                    keyword: keyword,
                }),
            }),
        select(data: IPageResponse<IEmployeeDto>) {
            return data;
        },
        queryKey: [QueryKey.tableEmployee, keyword, page, pageSize],
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
                        onClick={() => {
                            const currentParams = new URLSearchParams(searchParams.toString());
                            currentParams.set('_action', 'create');
                            router.replace(`?${currentParams.toString()}`);
                        }
                        }
                    >
                        Thêm nhân viên
                    </Button>
                </div>
            </div>
            <DataWrapper
                loading={isLoading}
                data={data?.items || []}
                title='Danh sách nhân viên trống'

            >
                <Table<IEmployeeDto>
                    data={data?.items || []}
                    rowKey={(row) => row.id}
                    column={[
                        {
                            title: 'STT',
                            render: (_, index) => <>{index + 1}</>,
                        },
                        {
                            title: 'Tên nhân viên',
                            render: (row, _) => <>{row.fullname || '---'}</>,
                        },
                        {
                            title: 'Giới tính',
                            render: (row, _) => <>{row.gender == TypeGender.Male ? "Nam" : "Nữ"}</>,
                        },
                        {
                            title: 'Số điện thoại',
                            render: (row, _) => <>{row.phone || '---'}</>,
                        },
                        {
                            title: 'Địa chỉ',
                            render: (row, _) => <>{row.address || '---'}</>,
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
                <FormCreateEmployee
                    queryKeys={[QueryKey.tableEmployee]}
                    onClose={async () => router.replace(pathname)}
                />
            </PositionContainer>
            <PositionContainer
                open={_action == 'update'}
                onClose={async () => router.replace(pathname)}
            >
                <FormUpdateEmployee
                    queryKeys={[QueryKey.tableEmployee]}
                    onClose={async () => router.replace(pathname)}
                />
            </PositionContainer>
        </>
    );
}

function FormCreateEmployee({queryKeys, onClose}: IFormProps) {
    const queryClient = useQueryClient();

    const [form, setForm] = React.useState<IEmployeeRequestCreate>({
        fullname: '',
        username: '',
        gender: TypeGender.Male,
        birthDate: null,
        phone: '',
        address: '',
    })

    const funcCreateEmployee = useMutation({
        mutationFn: () => apiRequest({
            showMessageFailed: true,
            showMessageSuccess: true,
            msgSuccess: 'Thêm nhân viên thành công!',
            api: async () => employeeService.createEmployee({
                ...form,
                birthDate: form.birthDate?.toString(),
                phone: form.phone?.trim().length == 0 ? null : form.phone,
                address: form.address?.trim().length == 0 ? null : form.address,
            })
        }),
        onSuccess: () => {
            onClose && onClose();
            // @ts-ignore
            queryKeys?.map((key) => queryClient.invalidateQueries([key]));
        },
        onError: (error) => {
            console.error('Error creating employee:', error);
        }
    });

    const handleSubmit = () => {
        return funcCreateEmployee.mutate();
    }

    return (
        <Form
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
        >
            <Loading loading={funcCreateEmployee.isPending}/>
            <div className="relative w-[540px] h-screen bg-white flex flex-col">
                <h4 className="text-[#2f3d50] text-xl font-semibold p-6">Thêm nhân viên</h4>
                <div className="flex-1 overflow-auto bg-[#f4f5f6] rounded-2xl p-6 flex flex-col gap-4">
                    <Input
                        placeholder='Nhập tên nhân viên'
                        name='fullname'
                        type='text'
                        isRequired
                        label={
                            <span>
								Tên nhân viên <span style={{color: 'red'}}>*</span>
							</span>
                        }
                    />
                    <Input
                        placeholder='Nhập tên tài khoản'
                        name='username'
                        type='text'
                        isRequired
                        label={
                            <span>
								Tên tài khoản <span style={{color: 'red'}}>*</span>
							</span>
                        }
                    />
                    <div>
                        <p className="text-[16px] font-medium mb-2">
                            Giới tính <span style={{color: 'red'}}>*</span>
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <input
                                    id='gender_male'
                                    className="w-5 h-5 relative cursor-pointer"
                                    type='radio'
                                    name='gender'
                                    value={form.gender}
                                    checked={form.gender == TypeGender.Male}
                                    onChange={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            gender: TypeGender.Male,
                                        }))
                                    }
                                />
                                <label className="cursor-pointer select-none text-[#23262f] text-[16px] font-medium"
                                       htmlFor='gender_male'>
                                    Nam
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    id='gender_female'
                                    className="w-5 h-5 relative cursor-pointer"
                                    type='radio'
                                    name='gender'
                                    value={form.gender}
                                    checked={form.gender == TypeGender.Female}
                                    onChange={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            gender: TypeGender.Female,
                                        }))
                                    }
                                />
                                <label className="cursor-pointer select-none text-[#23262f] text-[16px] font-medium"
                                       htmlFor='gender_female'>
                                    Nữ
                                </label>
                            </div>

                        </div>
                    </div>
                    <Input
                        placeholder='Nhập số điện thoại'
                        name='phone'
                        type='text'
                        isPhone
                        label={
                            <span>
								Số điện thoại
							</span>
                        }
                    />
                    <Input
                        type='date'
                        name='birthDate'
                        isBlur={true}
                        label={<span>Ngày sinh</span>}
                        placeholder='Nhập ngày sinh'
                    />
                    <TextArea name='address' placeholder='Nhập địa chỉ' label='Địa chỉ'/>
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

function FormUpdateEmployee({queryKeys, onClose}: IFormProps) {
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const [_id] = useState(searchParams.get('_id'));

    const [form, setForm] = React.useState<IEmployeeRequestUpdate>({
        id: 0,
        fullname: '',
        gender: TypeGender.Male,
        birthDate: null,
        phone: '',
        address: '',
    })

    const {data, isFetched} = useQuery<IEmployeeInfoDto | null>({
        queryFn: () =>
            apiRequest({
                api: async () => employeeService.getInfoEmployee({
                    id: Number(_id),
                }),
            }),
        select(data: IEmployeeInfoDto | null) {
            return data;
        },
        enabled: _id !== null,
        queryKey: [_id],
    });

    useEffect(() => {
        if (!!data) {
            setForm({
                id: data.id,
                fullname: data.fullname,
                gender: data.gender,
                birthDate: data?.birthday ? moment(data.birthday, "DD/MM/YYYY").format('YYYY-MM-DD') : '',
                phone: data.phone ?? "",
                address: data.address ?? "",
            });
        }
    }, [isFetched])

    const funcUpdateEmployee = useMutation({
        mutationFn: () => apiRequest({
            showMessageFailed: true,
            showMessageSuccess: true,
            msgSuccess: 'Chỉnh sửa nhân viên thành công!',
            api: async () => employeeService.updateEmployee({
                ...form,
                birthDate: form.birthDate?.length === 0 ? null : form.birthDate,
                phone: form.phone?.trim().length == 0 ? null : form.phone,
                address: form.address?.trim().length == 0 ? null : form.address,
            })
        }),
        onSuccess: () => {
            onClose && onClose();
            // @ts-ignore
            queryKeys?.map((key) => queryClient.invalidateQueries([key]));
        },
        onError: (error) => {
            console.error('Error updating employee:', error);
        }
    });

    const handleSubmit = () => {
        return funcUpdateEmployee.mutate();
    }

    return (
        <Form
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
        >
            <Loading loading={funcUpdateEmployee.isPending}/>
            <div className="relative w-[540px] h-screen bg-white flex flex-col">
                <h4 className="text-[#2f3d50] text-xl font-semibold p-6">Thêm nhân viên</h4>
                <div className="flex-1 overflow-auto bg-[#f4f5f6] rounded-2xl p-6 flex flex-col gap-4">
                    <Input
                        placeholder='Nhập tên nhân viên'
                        name='fullname'
                        type='text'
                        isRequired
                        label={
                            <span>
								Tên nhân viên <span style={{color: 'red'}}>*</span>
							</span>
                        }
                    />
                    <div>
                        <p className="text-[16px] font-medium mb-2">
                            Giới tính <span style={{color: 'red'}}>*</span>
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <input
                                    id='gender_male'
                                    className="w-5 h-5 relative cursor-pointer"
                                    type='radio'
                                    name='gender'
                                    value={form.gender}
                                    checked={form.gender == TypeGender.Male}
                                    onChange={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            gender: TypeGender.Male,
                                        }))
                                    }
                                />
                                <label className="cursor-pointer select-none text-[#23262f] text-[16px] font-medium"
                                       htmlFor='gender_male'>
                                    Nam
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    id='gender_female'
                                    className="w-5 h-5 relative cursor-pointer"
                                    type='radio'
                                    name='gender'
                                    value={form.gender}
                                    checked={form.gender == TypeGender.Female}
                                    onChange={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            gender: TypeGender.Female,
                                        }))
                                    }
                                />
                                <label className="cursor-pointer select-none text-[#23262f] text-[16px] font-medium"
                                       htmlFor='gender_female'>
                                    Nữ
                                </label>
                            </div>

                        </div>
                    </div>
                    <Input
                        placeholder='Nhập số điện thoại'
                        name='phone'
                        type='text'
                        isPhone
                        label={
                            <span>
								Số điện thoại
							</span>
                        }
                    />
                    <Input
                        type='date'
                        name='birthDate'
                        isBlur={true}
                        label={<span>Ngày sinh</span>}
                        placeholder='Nhập ngày sinh'
                    />
                    <TextArea name='address' placeholder='Nhập địa chỉ' label='Địa chỉ'/>
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
