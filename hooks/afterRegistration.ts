import Microform from '../components/Microform.vue'
import { adjustMultistoreApiUrl } from '@vue-storefront/core/lib/multistore'


export function afterRegistration({ Vue, config, store, isServer }) {
  const CURRENT_METHOD_CODE = config.cybersource.backend_method_code || 'cybersource'
  let correctPaymentMethod = false
  let componentInstance = null

  const placeOrder = () => {
    let url = config.cybersource.endpoint.addPaymentData
    url = config.storeViews.multistore ? adjustMultistoreApiUrl(url) : url

    if (correctPaymentMethod) {
      if (store.state['payment-cybersource'].token) {
        Vue.prototype.$bus.$emit('checkout-do-placeOrder', {
          token: store.state['payment-cybersource'].token
        })
      } else if (store.state['payment-cybersource'].microform && componentInstance.validate()) {
        componentInstance.block()

        const options = {
          cardExpirationMonth: store.state['payment-cybersource'].cardInfo.expirationMonth,
          cardExpirationYear: store.state['payment-cybersource'].cardInfo.expirationYear
        }

        store.state['payment-cybersource'].microform.createToken(options, (error, token) => {
          if (error) {
            // handle error
            componentInstance.unblock()
            componentInstance.setErrors(error)
            return
          }

          componentInstance.cancelReload()

          store.dispatch('payment-cybersource/setToken', token)

            fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.assign(token, options, {quote_masked_id: store.state['cart'].cartServerToken}))
            }).finally( () => {
                Vue.prototype.$bus.$emit('checkout-do-placeOrder', {
                    token
                })
            })
        })
      }
    }
  }

  // Update the methods
  let paymentMethodConfig = {
    'title': 'Cybersource',
    'code': CURRENT_METHOD_CODE,
    'cost': 0,
    'costInclTax': 0,
    'default': false,
    'offline': false,
    'is_server_method': config.cybersource.backend_method_code ? true : false
  }
  store.dispatch('payment/addMethod', paymentMethodConfig)

  if (!isServer) {
    let jsUrl = 'https://flex.cybersource.com/cybersource/assets/microform/0.4.0/flex-microform.min.js'
    let docHead = document.getElementsByTagName('head')[0]
    let docScript = document.createElement('script')
    docScript.type = 'text/javascript'
    docScript.src = jsUrl
    docHead.appendChild(docScript)

    Vue.prototype.$bus.$on('checkout-before-placeOrder', placeOrder)

    // Mount the microform component when required.
    Vue.prototype.$bus.$on('checkout-payment-method-changed', (paymentMethodCode) => {
      if (paymentMethodCode === CURRENT_METHOD_CODE) {
        correctPaymentMethod = true

        const Component = Vue.extend(Microform)
        componentInstance = (new Component())
        componentInstance.$mount('#checkout-order-review-additional')
      } else {
        correctPaymentMethod = false
      }
    })
  }
}
