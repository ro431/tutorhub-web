import { Injectable, signal } from '@angular/core';

export interface DialogOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'info' | 'warning';
}

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    private dialogState = signal<{
        options: DialogOptions | null;
        resolve: ((value: boolean) => void) | null;
    }>({
        options: null,
        resolve: null
    });

    state = this.dialogState.asReadonly();

    confirm(options: DialogOptions): Promise<boolean> {
        return new Promise((resolve) => {
            this.dialogState.set({
                options: {
                    confirmText: 'Confirm',
                    cancelText: 'Cancel',
                    type: 'danger',
                    ...options
                },
                resolve
            });
        });
    }

    close(result: boolean) {
        const currentState = this.dialogState();
        if (currentState.resolve) {
            currentState.resolve(result);
        }
        this.dialogState.set({
            options: null,
            resolve: null
        });
    }
}
