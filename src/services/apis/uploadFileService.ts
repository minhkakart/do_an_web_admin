import axiosClient from "~/services";

const uploadFileService = {
    uploadMultiFile: (files: any[]) => {
        const dataFile = new FormData();

        files.forEach((file) => {
            dataFile.append(`FilesData`, file);
        });

        return axiosClient.post(`/api/v1/File/upload-multiple`, dataFile, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'text/plain',
            },
        });
    },

    uploadSingleFile: (file: any) => {
        const dataFile = new FormData();

        dataFile.append(`FileData`, file);

        return axiosClient.post(`/api/v1/File/upload-single`, dataFile, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'text/plain',
            },
        });
    },
};

export default uploadFileService;