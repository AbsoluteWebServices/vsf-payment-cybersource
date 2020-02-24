# Vue Storefront Cybersource Payment Extension

Cybersource Payment module for [vue-storefront](https://github.com/DivanteLtd/vue-storefront).

## Installation

By hand (preferer):

```shell
git clone git@github.com:AbsoluteWebServices/vsf-payment-cybersource.git ./vue-storefront/src/modules/payment-cybersource
```

Add `backend_method_code` and endpoint to your config

```json
  "cybersource" : {
    "backend_method_code": "__CYBERSOURCE_BACKEND_METHOD_CODE__",
    "endpoint": {
      "generateKey": "http://localhost:8080/api/ext/cybersource/generate-key"
    }
  },
```

### Registration the Cybersource module. Go to `./vue-storefront/src/modules/index.ts`

```js
...
import { PaymentCybersource } from './payment-cybersource';

export const registerModules: VueStorefrontModule[] = [
  ...
  PaymentCybersource
]
```

### Integration the Stripe component to you theme
```js
import { METHOD_CODE as CYBERSOURCE_METHOD_CODE } from 'src/modules/vsf-payment-cybersource'
import CybersourceMicroform from 'src/modules/vsf-payment-cybersource/components/Microform'

export default {
  components: {
    ...
    CybersourceMicroform
  },
  data () {
    return {
      ...
      CYBERSOURCE_METHOD_CODE: CYBERSOURCE_METHOD_CODE
    }
  },
```

Then need to add component instance before <div id="checkout-order-review-additional-container"> to template section

```html
...
<cybersource-microform v-if="payment.paymentMethod === CYBERSOURCE_METHOD_CODE" key="cybersource-microform" ref="cybersourceMicroform" />
...
```

Then need to modify `sendDataToCheckout` method to make tokenization

```js
methods: {
  ...
  async sendDataToCheckout () {
    let paymentValid = true

    if (this.payment.paymentMethod === CYBERSOURCE_METHOD_CODE && this.$refs.cybersourceMicroform) {
      paymentValid = await this.$refs.cybersourceMicroform.tokenize()
    }

    if (paymentValid) {
      // process to the next step
    }
  }
}
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
