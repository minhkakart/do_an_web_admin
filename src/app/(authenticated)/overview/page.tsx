'use client'
import {Box, BoxTick, BoxTime, DollarCircle, MoneyRecive, MoneySend} from "iconsax-react";
import React from "react";
import {convertCoin} from "~/commons/funcs/convertCoin";
import BoxStatistical from "~/components/utils/BoxStatistical";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export default function Overview() {
    const dataBarChart = [
        {
            name: '1/5',
            'Đơn online': 53,
            'Đơn tại quầy': 84,
        },
        {
            name: '2/5',
            'Đơn online': 67,
            'Đơn tại quầy': 59,
        },
        {
            name: '3/5',
            'Đơn online': 35,
            'Đơn tại quầy': 97,
        },
        {
            name: '4/5',
            'Đơn online': 23,
            'Đơn tại quầy': 67,
        },
        {
            name: '5/5',
            'Đơn online': 74,
            'Đơn tại quầy': 61,
        },
        {
            name: '6/5',
            'Đơn online': 16,
            'Đơn tại quầy': 34,
        },
        {
            name: '7/5',
            'Đơn online': 45,
            'Đơn tại quầy': 85,
        },
        {
            name: '8/5',
            'Đơn online': 23,
            'Đơn tại quầy': 45,
        },
        {
            name: '9/5',
            'Đơn online': 23,
            'Đơn tại quầy': 62,
        },
    ];
    return (
        <div className="h-full flex flex-col justify-start items-start">
            <div className="flex items-center justify-between">
                <h4 className="text-[#141416] text-[24px] font-semibold">Báo cáo thống kê hệ thống</h4>
            </div>

            <div className="my-5 grid grid-cols-[1fr_500px] gap-5">
                <div className="grid grid-cols-3 gap-5">
                    <BoxStatistical
                        value={convertCoin(128)}
                        text='Tổng số đơn'
                        icon={<BoxTick size='32' color='#3772FF' />}
                    />
                    <BoxStatistical
                        value={convertCoin(9)}
                        text='Đơn đang thực hiện'
                        icon={<Box size='32' color='#4ECB71' />}
                    />
                    <BoxStatistical
                        value={convertCoin(119)}
                        text='Đơn đã hoàn thành'
                        icon={<Box size='32' color='#4ECB71' />}
                    />
                    {/*<BoxStatistical value={0} text='Tồn kho tạm tính (Tấn)' icon={<BoxTime size='32' color='#F46161' />} />*/}
                    <BoxStatistical
                        value={convertCoin(15700000)}
                        text='Tổng chi (VNĐ)'
                        icon={<MoneySend size='32' color='#3772FF' />}
                    />
                    <BoxStatistical
                        value={convertCoin(23800000)}
                        text='Tổng thu (VNĐ)'
                        icon={<MoneyRecive size='32' color='#4ECB71' />}
                    />
                    <BoxStatistical
                        value={convertCoin(8100000)}
                        text='Lợi nhuận ước tính'
                        icon={<DollarCircle size='32' color='#6170E3' />}
                    />
                </div>
            </div>

            <div className="px-5 py-3 rounded-sm border border-dashed border-[rgba(110,105,105,0.15)] bg-white min-h-[500px] w-full">
                <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                        width={500}
                        height={300}
                        data={dataBarChart}
                        margin={{

                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Đơn online" stackId="a" fill="#8884d8" />
                        <Bar dataKey="Đơn tại quầy" stackId="a" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
