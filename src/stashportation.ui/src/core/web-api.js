import { inject } from './annotations';
import uuid from './uuid';

const UNHANDLED_ERROR_CODES = [ 401, 403, 500 ];

function getRequestConfig(params, cache) {
    if (typeof(params) !== 'object' && typeof(cache) === 'undefined') {
        cache = params;
        params = null;
    }

    return { 
        headers: { 'X-Correlation-Id': uuid() }, 
        cache: !!cache,
        params: params || null
    };
}

@inject('$q', '$http')
export class WebApiService {
    constructor(q, http) {
        this.http = http;

        this.$onError = function(err) {
            var structuredResponse = err && err.hasOwnProperty('data')
                && err.data && err.data.hasOwnProperty('status');

            if (!structuredResponse)
                return q.reject(err);
            else if (UNHANDLED_ERROR_CODES.indexOf(err.data.status) < 0)
                return err.data;
            else {
                // Unhandled structured response from the server
                var error = new Error(`${err.config.method} "${err.config.url}" ${err.data.status} (${err.data.errors.join('; ')})`);
                error.name = 'WebApiUnhandledResponseError';
                error.response = err.data;

                return q.reject(error);
            }
        };
    }

    get(url, params, cache) {
        var req = this.http.get(url, getRequestConfig(params, cache));
        return req.then(res => res.data, this.$onError);
    }  

    post(url, data, params) {
        var req = this.http.post(url, data, getRequestConfig(params));
        return req.then(res => res.data, this.$onError);
    }

    delete(url, params) {
        var req = this.http.delete(url, getRequestConfig(params));
        return req.then(res => res.data, this.$onError);
    }

    put(url, data, params) {
        var req = this.http.put(url, data, getRequestConfig(params));
        return req.then(res => res.data, this.$onError);
    }

    patch(url, data, params) {
        var req = this.http.patch(url, data, getRequestConfig(params));
        return req.then(res => res.data, this.$onError);
    }
};