"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedIn = void 0;
class LinkedIn {
    constructor() {
        this.name = 'linkedInApi';
        this.displayName = 'LinkedIn API';
        this.documentationUrl = '';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'Login Token',
                name: 'loginToken',
                type: 'string',
                default: '',
                required: true,
            }
        ];
    }
}
exports.LinkedIn = LinkedIn;
//# sourceMappingURL=LinkedIn.credentials.js.map