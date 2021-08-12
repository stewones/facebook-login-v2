var FacebookLoginPlugin = (function (exports, core) {
    'use strict';

    const FacebookLogin = core.registerPlugin('FacebookLogin', {
        web: () => Promise.resolve().then(function () { return web; }).then(m => new m.FacebookLoginWeb()),
    });

    class FacebookLoginWeb extends core.WebPlugin {
        constructor() {
            super({
                name: 'FacebookLogin',
                platforms: ['web'],
            });
        }
        async login(options) {
            console.log('FacebookLoginWeb.login', options);
            return new Promise((resolve, reject) => {
                FB.login(response => {
                    console.debug('FB.login', response);
                    if (response.status === 'connected') {
                        resolve({
                            accessToken: {
                                token: response.authResponse.accessToken,
                            },
                        });
                    }
                    else {
                        reject({
                            accessToken: {
                                token: null,
                            },
                        });
                    }
                }, { scope: options.permissions.join(',') });
            });
        }
        async logout() {
            return new Promise(resolve => {
                FB.logout(() => resolve());
            });
        }
        async getCurrentAccessToken() {
            return new Promise((resolve, reject) => {
                FB.getLoginStatus(response => {
                    if (response.status === 'connected') {
                        const result = {
                            accessToken: {
                                applicationId: undefined,
                                declinedPermissions: [],
                                expires: undefined,
                                isExpired: undefined,
                                lastRefresh: undefined,
                                permissions: [],
                                token: response.authResponse.accessToken,
                                userId: response.authResponse.userID,
                            },
                        };
                        resolve(result);
                    }
                    else {
                        reject({
                            accessToken: {
                                token: null,
                            },
                        });
                    }
                });
            });
        }
        async getProfile(options) {
            const fields = options.fields.join(',');
            return new Promise((resolve, reject) => {
                FB.api('/me', { fields }, response => {
                    if (response.error) {
                        reject(response.error.message);
                        return;
                    }
                    resolve(response);
                });
            });
        }
    }

    var web = /*#__PURE__*/Object.freeze({
        __proto__: null,
        FacebookLoginWeb: FacebookLoginWeb
    });

    exports.FacebookLogin = FacebookLogin;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}, capacitorExports));
//# sourceMappingURL=plugin.js.map