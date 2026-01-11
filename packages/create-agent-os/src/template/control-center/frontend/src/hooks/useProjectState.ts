import { useState, useEffect } from 'react';
import axios from 'axios';
import type { ProjectState } from '../types';

export const useProjectState = () => {
    const [state, setState] = useState<ProjectState | null>(null);
    const [loading, setLoading] = useState(true);
    const [runtimeConfig, setRuntimeConfig] = useState<any>(null);

    useEffect(() => {
        fetch('/runtime-config.json')
            .then(res => res.json())
            .then(config => { setRuntimeConfig(config); })
            .catch(() => {
                setRuntimeConfig({
                    api: 'http://localhost:5403',
                    app: 'http://localhost:5402',
                    design: 'http://localhost:5400',
                    ports: { api: 5403, app: 5402, design: 5400 }
                });
            });
    }, []);

    const fetchStatus = async () => {
        if (!runtimeConfig) return;
        try {
            const res = await axios.get(`${runtimeConfig.api}/api/status`);
            setState(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (runtimeConfig) {
            fetchStatus();
            const interval = setInterval(fetchStatus, 2000);
            return () => clearInterval(interval);
        }
    }, [runtimeConfig]);

    return { state, loading, runtimeConfig, fetchStatus };
};
