import * as vscode from 'vscode';
import { getConfiguration, updateConfiguration } from '../configuration';

export function toggleAIPartner() {
    const config = getConfiguration();
    updateConfiguration({
        aiPartnerEnabled: !config.aiPartnerEnabled
    });
    vscode.window.showInformationMessage(
        `Fitur Pacar AI telah ${config.aiPartnerEnabled ? 'dinonaktifkan' : 'diaktifkan'}`
    );
}
