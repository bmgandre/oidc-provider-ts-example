export class PromptDebugModel {
    constructor(init?: PromptDebugModel) {
        Object.assign(this, init);
    }

    session: any;
    params: any;
    prompt: any;
}