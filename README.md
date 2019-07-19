# Vue Storefront Cybersource Payment Extension

Cybersource Payment module for [vue-storefront](https://github.com/DivanteLtd/vue-storefront).

## Installation

By hand (preferer):

```shell
git clone git@github.com:AbsoluteWebServices/vsf-payment-cybersource.git ./vue-storefront/src/modules/payment-cybersource
```

Registration the Cybersource module. Go to `./vue-storefront/src/modules/index.ts`

```js
...
import { PaymentCybersource } from './payment-cybersource';

export const registerModules: VueStorefrontModule[] = [
  ...
  PaymentCybersource
]
```

Add `backend_method_code` and endpoint to your config

```json
  "cybersource" : {
    "backend_method_code": "chcybersource",
    "endpoint": {
      "generateKey": "http://localhost:8080/api/ext/cybersource/generate-key"
    }
  },
```

### dependencies for built

"cybersource-rest-client": "^0.0.6",

## Cybersource payment API extension

Install additional extension for `vue-storefront-api`:

```shell
cp -f ./vue-storefront/src/modules/payment-cybersource/API/cybersource ./vue-storefront-api/src/api/extensions/
```

Add the config to your api config. You can add different configurations for different origins. `__ORIGIN__` must match request origin. (Eg. `http://localhost:3000`)

```json
"extensions":{
   "cybersource": {
     "__ORIGIN__": {
       "configObj": {
        "authenticationType": "http_signature",
        "runEnvironment": "cybersource.environment.SANDBOX",
        "merchantID": "__MERCHANT_ID__",
        "merchantKeyId": "__MERCHANT_KEY_ID__",
        "merchantsecretKey": "__MERCHANT_KEY__",
        "keyAlias": "testrest",
        "keyPass": "testrest",
        "keyFileName": "testrest",
        "keysDirectory": "keys/",
        "enableLog": true,
        "logFilename": "ext-cybersource",
        "logDirectory": "logs/",
        "logFileMaxSize": "5242880"
      },
      "encryptionType": "RsaOaep256",
      "targetOrigin": "http://localhost:3000"
     },
     ...
    }
  }
```
