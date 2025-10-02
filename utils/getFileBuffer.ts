import { Buffer } from 'buffer';
import { File } from 'expo-file-system';

export const getFileAsBuffer = async (fileUri: string) => {
    const fileObj = new File(fileUri);
    const fh = fileObj.open();
    const bytes = fh.readBytes(fh.size!);
    const buffer = Buffer.from(bytes);
    return buffer;
};