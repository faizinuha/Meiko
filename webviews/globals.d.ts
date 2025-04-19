import * as _vscode from "vscode";

declare global {
    const tsvscode: {
        postMessage: <T = any>(message: { type: string; value: T }) => void;
        getState: () => any;
        setState: (state: any) => void;
    };
    const SE: {
        init: (options: Record<string, unknown>) => void;
        authenticate: (options: Record<string, unknown>) => Promise<void>;
    };
}

export {};