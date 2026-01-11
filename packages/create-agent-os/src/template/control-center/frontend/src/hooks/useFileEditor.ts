import { useState } from 'react';
import axios from 'axios';
import { useToast } from '../components/ui/ToastContext';

export const useFileEditor = (runtimeConfig: any, fetchStatus: () => void) => {
    const [viewingFile, setViewingFile] = useState<{ path: string, title: string } | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const { toast } = useToast();

    const openFile = async (path: string, title: string) => {
        setViewingFile({ path, title });
        setFileContent("Loading...");
        try {
            const res = await axios.get(`${runtimeConfig.api}/api/files?path=${encodeURIComponent(path)}`);
            setFileContent(res.data.content);
        } catch (error) {
            setFileContent("Error loading file.");
        }
    };

    const saveFile = async (content: string) => {
        if (!viewingFile || !runtimeConfig) return;
        try {
            await axios.post(`${runtimeConfig.api}/api/files`, {
                path: viewingFile.path,
                content: content
            });
            setFileContent(content);
            toast({ title: "File Saved!", type: "success" });
            fetchStatus();
        } catch (error) {
            toast({ title: "Failed to save file", type: "error" });
        }
    };

    const closeFile = () => {
        setViewingFile(null);
        setFileContent(null);
    };

    return { viewingFile, fileContent, openFile, saveFile, closeFile };
};
