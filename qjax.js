/*
Qajax.get(url,data?,options?).then(result=>{...}).catch(err=>{...})

*when all request success, call then
Qajax.all([
    Qajax.get(url,data?,options?).then(result=>{...}).catch(err=>{...}),
    Qajax.get(url,data?,options?).then(result=>{...}).catch(err=>{...}),
    Qajax.get(url,data?,options?).then(result=>{...}).catch(err=>{...})
]).then(result=>{...}).catch(err=>{...})

*when any of the request success, call then
Qajax.any([
    Qajax.get(url,data?,options?).then(result=>{...}).catch(err=>{...}),
    Qajax.get(url,data?,options?).then(result=>{...}).catch(err=>{...}),
    Qajax.get(url,data?,options?).then(result=>{...}).catch(err=>{...})
]).then(result=>{...}).catch(err=>{...})

method
    get
    delete
    head
    options
    post
    put
    patch

default setting
    timeout: 500
    dataType: JSON
    charset: uft-8
    withCredentials: false
    cache: true
    mode: 'normal'

options
    charset
    dataType：JSON FORM FORM-MEDIA TEXT
    charset
    cache
    timeout
    withCredentials
    validateStatus：must be a function, import StatusCode, return bool
    headers
    mode：'normal' 'advanced'
    dataRoster：must be a function, default import raw data, return new data
 */

/*
Qajax.jsonp(url,data?,options?).then(result=>{...}).catch(err=>{...})

serverCallbackName：callbackName server received，default is 'callback'
timeout
 */

/*
 * VERSION: 1.0.0
 * DATE: 2018-10-13
 *
 * @author: Jiawei Zhou, leftscenery@gmail.com
 */

~function (window) {

    class Qajax{
        constructor(url,data,options,method){
            this.url = url||'';
            this.baseURL = Qajax.defaults.defaultURL||'';
            this.method = method;
            this.charset=options.charset || Qajax.defaults.charset;
            this.dataType = options.dataType||Qajax.defaults.dataType||'JSON';
            this.data = data||null;
            this.cache = options.hasOwnProperty('cache')?options.cache:Qajax.defaults.cache;
            this.timeout = options.timeout || Qajax.defaults.timeout;
            this.withCredentials = options.withCredentials || Qajax.defaults.withCredentials;
            this.validateStatus = options.validateStatus || Qajax.defaults.validateStatus;
            this.headers = options.headers || Qajax.defaults.headers;
            this.mode = options.mode || Qajax.defaults.mode;
            this.dataRoster = options.dataRoster || Qajax.defaults.dataRoster;

            return this._promise();
        }

        //GET GROUP
        static get(url,data,options = {}){
            return new Qajax(url,data,options,'GET');
        }
        static delete(url,data,options = {}){
            return new Qajax(url,data,options,'DELETE');
        }
        static head(url,data,options = {}){
            return new Qajax(url,data,options,'HEAD');
        }
        static options(url,data,options = {}){
            return new Qajax(url,data,options,'OPTIONS');
        }

        //POST GROUP
        static post(url,data,options = {}){
            return new Qajax(url,data,options,'POST');
        }
        static put(url,data,options = {}){
            return new Qajax(url,data,options,'PUT');
        }
        static patch(url,data,options = {}){
            return new Qajax(url,data,options,'PATCH');
        }

        //jsonp
        static jsonp(url, data=null, options={}){
            return new Promise((resolve, reject) => {
                if (typeof url === 'undefined' && Qajax.defaults.baseURL=='') {
                    reject('Lack URL');
                    return
                }

                //passed fn name
                let FN_NAME = `JSONP${new Date().getTime()}`;

                //backend fn name, default 'callback'
                let CALL_BACK = options.serverCallbackName || 'callback';

                //other setting
                let TIMEOUT = options.timeout || 3000,
                    DELAY_TIMER = null;

                //prepare data
                let DATA='';
                if(data && data instanceof Object){
                    for (let attr in data){
                        DATA += `${data[attr]}&`;
                    }
                }else if(data && typeof data == 'string'){
                    DATA = data+'&';
                }

                //create script element and send
                let SCRIPT = document.createElement('script');
                SCRIPT.src = `${ajaxp.defaults.baseURL}/${url}${url.indexOf('?')?'&':'?'}${DATA}${CALL_BACK}=${FN_NAME}&_=${new Date().getTime()}`;
                document.body.appendChild(SCRIPT);

                //listener timeout
                DELAY_TIMER = setTimeout(()=>{
                    reject('Time Out');
                    clearTimeout(DELAY_TIMER);
                },TIMEOUT);

                //call fn after get result
                window[FN_NAME] = function (result) {
                    //remove working fn
                    document.removeChild(SCRIPT);
                    window[FN_NAME] = null;
                    clearTimeout(DELAY_TIMER);
                    //call resolve
                    resolve(result);
                };
            });
        }

        //All
        static All(arr){
            return Promise.all(arr)
        }

        //Any
        static Any(arr){
            return Promise.race(arr)
        }


        //MAIN
        //prepare params based on setting
        _paramsRoster(){
            if (/^(GET|DELETE|HEAD|OPTIONS)$/i.test(this.method)) {
                //GET group
                if (this.data) {
                    this.url+=`${(this._checkQuestionMark(this.url)?'&':'?')}${this._formatData(this.params)}`;
                }
                if(this.cache === true){
                    this.url += `${(this._checkQuestionMark(this.url)?'&':'?')}_=${+(new Date())}`
                }
                this.data = null;
            } else {
                //POST group
                if(this.data){
                    this.data = this._formatData(this.data);
                }
            }
        }

        //send Promise
        _promise(){
            //return promise
            return new Promise((resolve, reject) => {
                //send ajax request
                let xhr = new XMLHttpRequest();
                xhr.open(this.method, (this.baseURL + this.url), true);
                //set request header
                xhr.withCredentials=this.withCredentials;
                this._setHeader(xhr);
                this._setContentType(xhr);
                this._paramsRoster();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (this.validateStatus(xhr.status)) {
                            let result = this._resultDataRoster(xhr.responseText,xhr.getResponseHeader('content-type'));
                            if(this.dataRoster){
                                result = this.dataRoster(result)
                            }
                            if(this.mode == 'advance'){
                                resolve({
                                    data:result,
                                    resHeader:xhr.getAllResponseHeaders(),
                                    status:xhr.status,
                                    statesText:xhr.statusText
                                })
                            }else{
                                resolve(result);
                            }
                        } else {
                            reject(xhr.statusText)
                        }
                    }
                };

                //time out
                xhr.timeout = this.timeout;
                xhr.ontimeout=()=>{
                    console.log('Request Time Out')
                };
                xhr.send(this.data);
            })
        }

        //TOOLS

        _setHeader(xhr){
            if ((this.headers instanceof Object) && this.headers !== null) {
                for (let attr in this.headers) {
                    if (this.headers.hasOwnProperty(attr)) {
                        xhr.setRequestHeader(attr, this.headers[attr]);
                    }
                }
            }
        }

        _setContentType(xhr){
            switch (this.dataType.toUpperCase()){
                case 'JSON':
                    xhr.setRequestHeader('content-type',`application/json; charset=${this.charset}`);
                case 'FORM':
                    xhr.setRequestHeader('content-type',`application/x-www-form-urlencoded; charset=${this.charset}`);
                case 'FORM_MEDIA':
                    xhr.setRequestHeader('content-type',`multipart/form-data; charset=${this.charset}`);
                case 'TEXT':
                default:
                    xhr.setRequestHeader('content-type',`text/xml; charset=${this.charset}`);

            }
        }

        _checkQuestionMark(){
            return this.url.indexOf('?') > -1
        }

        _resultDataRoster(data,type){
            type=type.split(';')[0].trim();
            switch (type){
                case 'application/json':
                    return JSON.parse(data);
                    break;
                default:
                    return data;
            }
        }

        //object to urlencoded
        _formatData(obj){
            let str='';
            switch (this.dataType.toUpperCase()){
                case 'JSON':
                    for (let attr in obj){
                        str += `${obj[attr]}&`;
                    }
                    return str.substring(0,str.length-1);
                case 'FORM':
                case 'FORM_MEDIA':
                case 'TEXT':
                    return obj;
                default:
                    return str;
            }
        }
    }

    //Default Settings
    Qajax.defaults={
        defaultURL:'',
        timeout:500,
        validateStatus:function validateStatus(status){
            return /^(2|3)\d{2}$/.test(status)
        },
        withCredentials:false,
        dataRoster:null,
        mode:'normal',
        charset:'utf-8',
        dataType:'JSON',
        cache: true,
        headers:{}
    };

    //export
    //JS
    window.Qjax = Qajax;

    //commonJS
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.export = {
            Qajax
        }
    }
}((typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window);