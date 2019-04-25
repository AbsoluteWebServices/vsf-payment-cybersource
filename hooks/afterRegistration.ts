import Microform from '../components/Microform.vue'

export function afterRegistration({ Vue, config, store, isServer }) {
  // Place the order. Payload is empty as we don't have any specific info to add for this payment method '{}'
  const CURRENT_METHOD_CODE = 'cybersource'
  let correctPaymentMethod = false
  let componentInstance = null

  const placeOrder = () => {
    if (correctPaymentMethod && store.state['payment-cybersource'].microform && componentInstance.validate()) {
      const options = {
        cardExpirationMonth: store.state['payment-cybersource'].cardInfo.expirationMonth,
        cardExpirationYear: store.state['payment-cybersource'].cardInfo.expirationYear
      }

      store.state['payment-cybersource'].microform.createToken(options, (error, response) => {
        if (error) {
          // handle error
          componentInstance.setErrors(error)
          return
        }
        console.log('Token generated: ')
        console.log(JSON.stringify(response))

        let token = JSON.stringify(response)

        // Vue.prototype.$bus.$emit('checkout-do-placeOrder', {
        //   cybersource_token: token
        // })
      })
    }
  }

  // Update the methods
  let paymentMethodConfig = {
    'title': 'Cybersource',
    'code': CURRENT_METHOD_CODE,
    'cost': 0,
    'costInclTax': 0,
    'default': true,
    'offline': false,
    'is_server_method': false
  }
  store.dispatch('payment/addMethod', paymentMethodConfig)

  if (!Vue.prototype.$isServer) {
    let jsUrl = 'https://flex.cybersource.com/cybersource/assets/microform/0.4.0/flex-microform.min.js'
    let docHead = document.getElementsByTagName('head')[0]
    let docScript = document.createElement('script')
    docScript.type = 'text/javascript'
    docScript.src = jsUrl
    docHead.appendChild(docScript)

    Vue.prototype.$bus.$on('checkout-before-placeOrder', placeOrder)

    // Mount the info component when required.
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
