/* @flow */

let Global = GLOBAL || window;
const fetch = Global.fetch;

//const _XHR = Global.originalXMLHttpRequest
//    ? Global.originalXMLHttpRequest
//    : Global.XMLHttpRequest;

//Global.XMLHttpRequest = _XHR;

const API_URL: string = 'http://api.tianapi.com/wxnew/';
const API_KEY: string = '1f0f7ba24a9a8c6f1f4196f490b3ec8b';

const combineUrl = (path: string, query: Object = null): string => {
    if (!query) {
        return path;
    }

    let q = path.includes('?') ? '&' : '?';
    Object.entries(query).forEach(([k, v]) => {
        q += k + '=' + ((typeof v === 'object' ? JSON.stringify(v) : v)) + '&';
    });
    return path + q.substr(0, q.length - 1);
};

const get = (url: string, query) => {
    return new Promise((resolve, reject) => {
        fetch(combineUrl(url, query), {
            method: 'GET',
            cache: 'default'
        }).then((response) => {
            return response.json();
        }).then((json: Object) => {
            resolve(json);
        }).catch((e) => {
            reject(e);
        });
    });
};

export default class NewsService {
    static async fetchNews(page: number, num: number = 10) {
        let params = {
            num,
            page,
            key: API_KEY
        };

        let result = await get(API_URL, params);
        if (result.code === 200) {
            return result.newslist;
        } else {
            throw new Error('fetch failed!');
        }
    }
};