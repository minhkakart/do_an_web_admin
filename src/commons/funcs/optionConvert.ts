// noinspection JSUnusedGlobalSymbols,SpellCheckingInspection

export function obfuscateEmail(email: string) {
    // Tách phần trước @ và phần tên miền
    const [username, domain] = email.split('@');

    // Giữ lại ký tự đầu tiên và cuối cùng của tên người dùng
    const firstChar = username[0];
    const lastChar = username[username.length - 1];

    // Tạo phần che giấu giữa
    const middleHidden = '...';

    // Tạo tên người dùng mới với phần che giấu
    const newUsername = firstChar + middleHidden + lastChar;

    // Kết hợp với tên miền để tạo email đã che giấu
    return newUsername + '@' + domain;
}

export function checkTime(i: any) {
    if (Math.abs(i) < 10) {
        i = '0' + i;
    }
    return i;
}

export const timeSubmit = (date: Date | null | undefined, isTo?: boolean) => {
    return date ? `${date.getFullYear()}-${checkTime(date.getMonth() + 1)}-${checkTime(date.getDate())}T${isTo ? '23:59' : '00:00'}` : null;
};

// dateOnly: 2021-09-01
export const timeSubmitDateOnly = (date: Date | null | undefined) => {
    return date ? `${date.getFullYear()}-${checkTime(date.getMonth() + 1)}-${checkTime(date.getDate())}` : null;
};

export function removeVietnameseTones(str: string): string {
    str = str?.toLowerCase();
    str = str?.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
    str = str?.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
    str = str?.replace(/[ìíịỉĩ]/g, 'i');
    str = str?.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
    str = str?.replace(/[ùúụủũưừứựửữ]/g, 'u');
    str = str?.replace(/[ỳýỵỷỹ]/g, 'y');
    str = str?.replace(/đ/g, 'd');
    return str;
}

export function convertToRoman(num: number) {
    const romanNumerals = [
        {value: 1000, symbol: 'M'},
        {value: 900, symbol: 'CM'},
        {value: 500, symbol: 'D'},
        {value: 400, symbol: 'CD'},
        {value: 100, symbol: 'C'},
        {value: 90, symbol: 'XC'},
        {value: 50, symbol: 'L'},
        {value: 40, symbol: 'XL'},
        {value: 10, symbol: 'X'},
        {value: 9, symbol: 'IX'},
        {value: 5, symbol: 'V'},
        {value: 4, symbol: 'IV'},
        {value: 1, symbol: 'I'},
    ];

    let result = '';

    for (const {value, symbol} of romanNumerals) {
        while (num >= value) {
            result += symbol;
            num -= value;
        }
    }

    return result;
}

export function convertFileSize(fileSizeInKB: number) {
    if (fileSizeInKB < 0) {
        return 'Kích thước không hợp lệ';
    }

    if (fileSizeInKB < 1024) {
        return fileSizeInKB.toFixed(2) + ' kb';
    } else if (fileSizeInKB < 1048576) {
        // 1024 KB = 1 MB
        return (fileSizeInKB / 1024).toFixed(2) + ' mb';
    } else if (fileSizeInKB < 1073741824) {
        // 1024 MB = 1 GB
        return (fileSizeInKB / 1048576).toFixed(2) + ' gb';
    } else {
        return (fileSizeInKB / 1073741824).toFixed(2) + ' tb';
    }
}


export function toQueryString(params: any){
    const queryString = Object.keys(params)
        .map(key => {
            const value = params[key];
            if (value === null || value === undefined) {
                return '';
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .filter(part => part !== '')
        .join('&');

    return queryString ? `?${queryString}` : '';
}
