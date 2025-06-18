'use client';

import React, {useState} from 'react';
import Form, {FormContext, Input} from "~/components/commons/Form";
import Loading from "~/components/commons/Loading";
import {apiRequest} from '~/services';
import {useMutation} from "@tanstack/react-query";
import authService from '~/services/apis/authService';
import {UserRole} from "~/constants/config/enum";
import {KEY_STORAGE_TOKEN} from "~/constants/config";
import {useRouter} from "next/navigation";
import {store} from "~/redux/store";
import SwitchButton from "~/components/commons/SwitchButton";
import Button from "~/components/commons/Button";
import Image from "next/image";
import images from "~/constants/images/images";
import {setIsLoggedIn, setIsTokenValid, setLoading, setToken, setUserData} from "~/redux/appReducer";
import {IToken, IUserData} from "~/commons/interfaces";
import {deleteItemStorage, setItemStorage} from "~/commons/funcs/localStorage";

function Login() {
    const router = useRouter();

    const [saveToken, setSaveToken] = useState<boolean>(false);

    const [form, setForm] = useState<{
        userName: string;
        password: string;
        type: UserRole,
    }>({
        userName: '',
        password: '',
        type: UserRole.Admin,
    });

    const login = useMutation({
        mutationFn: () =>
            apiRequest({
                showMessageFailed: true,
                showMessageSuccess: true,
                msgSuccess: 'Đăng nhập thành công!',
                setLoadingState: setLoading,
                api: () => authService.login(form),
            }),
        async onSuccess(data: IToken) {
            if (data) {
                if (saveToken) {
                    setItemStorage(KEY_STORAGE_TOKEN, JSON.stringify(data));
                } else {
                    deleteItemStorage(KEY_STORAGE_TOKEN);
                }
                store.dispatch(setToken(data))
                const res: IUserData = await apiRequest({
                    api: async () => authService.checkToken(),
                    showMessageFailed: true
                });
                if (!!res) {
                    store.dispatch(setUserData(res))
                    store.dispatch(setIsLoggedIn(true))
                    store.dispatch(setIsTokenValid(true))
                }
                router.replace('/')
            }
        },
    });

    const handleLogin = () => {
        login.mutate();
    }

    return (
        <div className="flex items-center justify-center h-screen w-full bg-white">
            <Image src={images.background} alt="logo" width={800} height={800} className="h-full "/>
            <div className="flex-1 flex items-center justify-center h-full">
                <Form form={form} setForm={setForm} onSubmit={handleLogin}>
                    <Loading loading={login.isPending}/>
                    <div
                        className="w-[700px] rounded-[32px] bg-white px-[95px] py-[68px] flex items-center justify-center flex-col">
                        <h4 className="text-[#2f3d50] text-[20px] font-bold mt-4">ĐĂNG NHẬP TÀI KHOẢN</h4>
                        <div className="w-full mt-8">
                            <Input type='text' placeholder='Tên tài khoản' name='userName' value={form?.userName}
                                   onClean
                                   isRequired/>
                            <Input type='password' placeholder='Mật khẩu' name='password' value={form?.password} onClean
                                   isRequired/>

                            <div className="flex items-center justify-between mt-5">
                                <div className="flex items-center gap-3 select-none">
                                    <SwitchButton
                                        name='saveToken'
                                        value={saveToken}
                                        onChange={(e: any) => setSaveToken(e.target.value)}
                                    />
                                    <p className="text-[#2f3d50] text-[15px] font-normal">Ghi nhớ đăng nhập</p>
                                </div>
                            </div>

                            <div className="mt-7">
                                <FormContext.Consumer>
                                    {({isDone}) => (
                                        <Button primaryLinear bold rounded_8 disable={!isDone}
                                                className="bg-blue-400! text-white!">
                                            Đăng nhập
                                        </Button>
                                    )}
                                </FormContext.Consumer>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        </div>

    );
}

export default Login;