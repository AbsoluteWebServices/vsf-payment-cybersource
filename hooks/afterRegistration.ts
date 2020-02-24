import { METHOD_CODE } from '../index'
import i18n from '@vue-storefront/i18n'

export function afterRegistration ({ Vue, config, store, isServer }) {
  let correctPaymentMethod = false

  const placeOrder = () => {
    if (correctPaymentMethod) {
      if (store.state['payment-cybersource'].token) {
        Vue.prototype.$bus.$emit('checkout-do-placeOrder', {})
      } else {
        store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: i18n.t('Tokenization required. Return to Payment Information and try again.'),
          action1: { label: i18n.t('OK') }
        })
        Vue.prototype.$bus.$emit('checkout-activate-section', 'payment')
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

    Vue.prototype.$bus.$on('checkout-payment-method-changed', (paymentMethodCode) => {
      if (paymentMethodCode === METHOD_CODE) {
        correctPaymentMethod = true
      } else {
        correctPaymentMethod = false
      }
    })
  }
}
