import { createContext } from 'react';

export const IdeContext = createContext({
    scheme: 'vscode',
    setScheme: (_s: string) => { }
});
