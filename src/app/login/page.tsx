'use client';

import React, {useEffect, useState} from 'react';
import Form, {FormContext, Input} from "~/components/commons/Form";
import Loading from "~/components/commons/Loading";
import { httpRequest } from '~/services';
import {useMutation} from "@tanstack/react-query";
import authService from '~/services/apis/authService';
import {UserRole} from "~/constants/config/enum";
import {KEY_STORAGE_TOKEN, PATH} from "~/constants/config";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState, store} from "~/redux/store";
import {setLoading, setSaveStorage} from "~/redux/reducer/site";
import SwitchButton from "~/components/commons/SwitchButton";
import Button from "~/components/commons/Button";
import {IToken, setAccessToken, setRefreshToken} from "~/redux/reducer/auth";
import {setItemStorage} from "~/commons/funcs/localStorage";
import Image from "next/image";
import images from "~/constants/images/images";

function Login() {
    const router = useRouter();

    const {saveStorage, loading} = useSelector((state: RootState) => state.site);

    useEffect(() => {
        if (loading){
            store.dispatch(setLoading(false));
        }
    }, [loading]);

    const [form, setForm] = useState<{
        username: string;
        password: string;
    }>({
        username: '',
        password: '',
    });

    const login = useMutation({
        mutationFn: () =>
            httpRequest({
                showMessageFailed: true,
                showMessageSuccess: true,
                msgSuccess: 'Đăng nhập thành công!',
                showLoading: false,
                http: () => authService.login({
                    userName: form.username,
                    password: form.password,
                    type: UserRole.Admin,
                }),
            }),
        onSuccess(data: IToken) {
            if (data) {
                store.dispatch(setAccessToken(data.accessToken));
                store.dispatch(setRefreshToken(data.refreshToken));
                setItemStorage(KEY_STORAGE_TOKEN, data);
                router.replace(PATH.Home);
            }
        },
    });

    const handleLogin = () => {
        login.mutate();
    }

    return (
        <div className="flex items-center justify-center h-screen w-full bg-white">
            <Image src={images.background} alt="logo" width={800} height={800} className="h-full " />
            <div className="flex-1 flex items-center justify-center h-full">
                <Form form={form} setForm={setForm} onSubmit={handleLogin}>
                    <Loading loading={login.isPending}/>
                    <div
                        className="w-[700px] rounded-[32px] bg-white px-[95px] py-[68px] flex items-center justify-center flex-col">
                        <h4 className="text-[#2f3d50] text-[20px] font-bold mt-4">ĐĂNG NHẬP TÀI KHOẢN</h4>
                        <div className="w-full mt-8">
                            <Input type='text' placeholder='Tên tài khoản' name='username' value={form?.username}
                                   onClean
                                   isRequired/>
                            <Input type='password' placeholder='Mật khẩu' name='password' value={form?.password} onClean
                                   isRequired/>

                            <div className="flex items-center justify-between mt-5">
                                <div className="flex items-center gap-3 select-none">
                                    <SwitchButton
                                        name='saveStorage'
                                        value={saveStorage}
                                        onChange={() => store.dispatch(setSaveStorage(!saveStorage))}
                                    />
                                    <p className="text-[#2f3d50] text-[15px] font-normal">Ghi nhớ đăng nhập</p>
                                </div>
                            </div>

                            <div className="mt-7">
                                <FormContext.Consumer>
                                    {({isDone}) => (
                                        <Button primaryLinear bold rounded_8 disable={!isDone} className="bg-blue-400! text-white!">
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