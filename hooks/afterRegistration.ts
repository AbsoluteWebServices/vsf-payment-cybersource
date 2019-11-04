import Microform from '../components/Microform.vue'
import { METHOD_CODE } from '../index'

export function afterRegistration({ Vue, config, store, isServer }) {
  let correctPaymentMethod = false
  let componentInstance = null

  const placeOrder = () => {
    if (correctPaymentMethod) {
      if (store.state['payment-cybersource'].token) {
        Vue.prototype.$bus.$emit('checkout-do-placeOrder', {})
      } else if (store.state['payment-cybersource'].microform && componentInstance.validate()) {
        componentInstance.block()

        const options = {
          cardExpirationMonth: store.state['payment-cybersource'].cardInfo.expirationMonth,
          cardExpirationYear: store.state['payment-cybersource'].cardInfo.expirationYear
        }

        store.state['payment-cybersource'].microform.createToken(options, async (error, token) => {
          if (error) {
            // handle error
            componentInstance.unblock()
            componentInstance.setErrors(error)
            return
          }

          componentInstance.cancelReload()

          store.dispatch('payment-cybersource/setToken', token)

          await store.dispatch('payment-cybersource/addPaymentData', {
            ...token,
            ...options,
            quote_masked_id: store.state.cart.cartServerToken
          })

          Vue.prototype.$bus.$emit('checkout-do-placeOrder', {})
        })
      }
    }
  }

  // Update the methods
  let paymentMethodConfig = {
    'title': 'Cybersource',
    'code': METHOD_CODE,
    'cost': 0,
    'costInclTax': 0,
    'default': false,
    'offline': false,
    'is_server_method': false
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
      if (paymentMethodCode === METHOD_CODE) {
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
