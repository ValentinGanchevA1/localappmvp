// Minimal ambient type declarations for react-native-image-picker
declare module 'react-native-image-picker' {
  export type Asset = {
    uri?: string;
    fileName?: string;
    type?: string;
    width?: number;
    height?: number;
    fileSize?: number;
  };

  export interface ImageLibraryOptions {
    mediaType?: 'photo' | 'video' | 'mixed';
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    selectionLimit?: number;
  }

  export interface ImagePickerResponse {
    didCancel?: boolean;
    errorCode?: string;
    errorMessage?: string;
    assets?: Asset[];
  }

  export function launchImageLibrary(
    options: ImageLibraryOptions,
    callback: (response: ImagePickerResponse) => void,
  ): Promise<ImagePickerResponse>;
}
