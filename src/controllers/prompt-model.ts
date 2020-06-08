import { PromptDebugModel } from "./prompt-debug-model";

export class PromptModel {
    constructor(init?: PromptModel) {
        Object.assign(this, init);
    }

    title?: string;
    uid?: string;
    email?: string;
    client?: any;
    session?: any;
    params?: any;
    promptDetail?: any;
    promptDebug?: PromptDebugModel;
}