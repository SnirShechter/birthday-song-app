export interface PhotoFile {
    id: string;
    file: File;
    url: string;
}
export interface PhotoUploaderProps {
    maxPhotos?: number;
    onChange?: (photos: PhotoFile[]) => void;
}
export declare function PhotoUploader({ maxPhotos, onChange, }: PhotoUploaderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PhotoUploader.d.ts.map