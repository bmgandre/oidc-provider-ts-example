/* tslint:disable:variable-name */
export class Profile {
    constructor(init?: Profile) {
        Object.assign(this, init);
    }

    email: string;
    email_verified: string;
    family_name: string;
    given_name: string;
    locale: string;
    name: string;
}