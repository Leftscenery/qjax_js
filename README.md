Qjax_js
---

#### Introduction:
Qjax.js is a javascript plugin that could send request easily, also support jsonp.

<br/>

---

#### Key Feature:
+ Quick and easy to setup in one line
+ jsonp cross domain supported 
+ Avoid callback hell
+ **'Normal'** and **'Advanced'** mode depends on how to use data.
+ Custom setting and default setting

<br/>

---

#### Instruction:
+ Optional, change default
```javascript
Qjax.defaults={
        defaultURL:'',          //url base
        timeout:500,            //waiting time
        validateStatus: fn,     //function that check success status, pass in statusCode and return bool
        withCredentials:false,  //allowed cookie
        cache: true,            //prevent cache
        dataRoster:null,        //function that process returned data, pass in raw data and return new data
        mode:'normal',          //return result format
        charset:'utf-8',        //encoded
        dataType:'JSON'         //passd data type
    };
```
+ Send request
```javascript
Qjax.get('url').then(result=>console.log(result)).catch(err=>{console.log(err)})
```

<br/>

---

#### Qjax default Options:
+ **defaultURL**: url base
    + '' (default)
+ **timeout**: waiting time
    + 500 (defalut,ms)
+ **validateStatus**: function that check success status, pass in statusCode and return bool
    + function validateStatus(status){
                  return /^(2|3)\d{2}$/.test(status)
              } (default)
+ **withCredentials**: allowed cookie
    + false
+ **cache**
+ **dataRoster**: function that process returned data, pass in raw data and return new data
    + null (default)
+ **mode**: return result format
    + '**normal**' (default): data only
    + '**advance**': return an object
        + data: return data
        + resHeader: response header
        + status: status code
        + statesText: status description
+ **charset**: encoded
    + 'utf-8' (default)
+ **dataType**: passd data type
    + 'JSON' (default)
    + 'FORM': pass data get from form
    + 'FORM_MEDIA': get media from form and pass it
    + 'TEXT': texts
+ **headers**: custom header
    + {} (default)

<br/>

---

#### Supported Method
+ get
+ delete
+ head
+ options
+ post
+ put
+ patch
+ jsonp
   
<br/>

---

#### Send Request
```javascript
Qjax.get(url[, data?][, options?]).then(successFn).catch(failedFn)
```
+ **url**: required
+ **data**: optional, data passed to server, object
+ **option**: optional, custom setting for current request
    + **timeout**: waiting time
        + 500 (defalut,ms)
    + **validateStatus**: function that check success status, pass in statusCode and return bool
        + function validateStatus(status){
                      return /^(2|3)\d{2}$/.test(status)
                  } (default)
    + **withCredentials**: allowed cookie
        + false
    + **cache**
    + **dataRoster**: function that process returned data, pass in raw data and return new data
        + null (default)
    + **mode**: return result format
        + '**normal**' (default): data only
        + '**advance**': return an object
            + data: return data
            + resHeader: response header
            + status: status code
            + statesText: status description
    + **charset**: encoded
        + 'utf-8' (default)
    + **dataType**: passd data type
        + 'JSON' (default)
        + 'FORM': pass data get from form
        + 'FORM_MEDIA': get media from form and pass it
        + 'TEXT': texts
    + **headers**: custom header
        + {} (default)

<br/>

---

#### Qjax.jsonp
```javascript
Qjax.jsonp(url,data?,options?).then(result=>{...}).catch(err=>{...})
```
+ **url**: required, 
+ **data**: optional, data passed to server, object
+ **option**: optional, custom setting for current request
    + **serverCallbackName**: function name sync with server side
        + 'callback' (default)
    + **timeout**:
        + 3000 (default, ms)

<br/>

---

#### Qjax.All
```javascript
Qjax.All([
    Qjax.get(url,data?,options?).then(...).catch(...),
    Qjax.get(url,data?,options?).then(...).catch(...),
    Qjax.get(url,data?,options?).then(...).catch(...)
]).then(...).catch(...)
```
+ Once all Qjaxs complete, call Qjax.All, return a result that concat all result

<br/>

---

#### Qjax.Any
```javascript
Qjax.Any([
    Qjax.get(url,data?,options?).then(...).catch(...),
    Qjax.get(url,data?,options?).then(...).catch(...),
    Qjax.get(url,data?,options?).then(...).catch(...)
]).then(...).catch(...)
```
+ Once one of the Qjax complete, call Qjax.Any

<br/>

---


Feel free to let me know if there are any functions or parts need to be fixed :)
<br>By Jiawei Zhou 2018
