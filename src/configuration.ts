import * as vscode from 'vscode';

export interface KawaiiConfiguration {
    aiPartnerEnabled: boolean;
}

export const defaultConfig: KawaiiConfiguration = {
    aiPartnerEnabled: true
};

export function getConfiguration(): KawaiiConfiguration {
    const config = vscode.workspace.getConfiguration('kawaiiCode');
    return {
        aiPartnerEnabled: config.get('aiPartnerEnabled', defaultConfig.aiPartnerEnabled)
    };
}

export function updateConfiguration(config: Partial<KawaiiConfiguration>): void {
    if (config.aiPartnerEnabled !== undefined) {
        vscode.workspace.getConfiguration('kawaiiCode').update('aiPartnerEnabled', config.aiPartnerEnabled, true);
    }
}