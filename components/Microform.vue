<template>
  <div id="payment-cybersource">
    <div class="row">
      <div v-if="errors.message" class="col-12">
        <div class="error">{{ errors.message }}</div>
      </div>
      <div class="col-12">
        <label :id="labelId" :class="[{'text-error' : errors.cardNumber }]">{{ t('Credit Card') }}</label>
        <div
          :id="containerId"
          :class="[{'has-error' : errors.cardNumber }]"
          class="input"
        />
        <span class="help-error" v-if="errors.cardNumber">{{ errors.cardNumber }}</span>
      </div>
      <div class="col-12">
        <div class="row">
          <div class="col-6">
            <label :class="[{'text-error' : $v.cardInfo.expirationMonth.$error || errors.cardExpirationMonth }]">{{ t('Expiration Month') }}</label>
            <input
              v-model="cardInfo.expirationMonth"
              :class="[{'has-error' : $v.cardInfo.expirationMonth.$error || errors.cardExpirationMonth }]"
              class="input"
              placeholder="MM"
              required
              @blur="$v.cardInfo.expirationMonth.$touch()"
            >
            <span class="help-error" v-if="errors.cardExpirationMonth">{{ errors.cardExpirationMonth }}</span>
            <span class="help-error" v-if="!$v.cardInfo.expirationMonth.required">{{ t('Expiration Month is required.') }}</span>
            <span class="help-error" v-if="!$v.cardInfo.expirationMonth.numeric">{{ t('Expiration Month should be numeric.') }}</span>
            <span class="help-error" v-if="!$v.cardInfo.expirationMonth.minLength || !$v.cardInfo.expirationMonth.maxLength">{{ t('Expiration Month should be 2 digits length.') }}</span>
          </div>

          <div class="col-6">
            <label :class="[{'text-error' : $v.cardInfo.expirationYear.$error || errors.cardExpirationYear }]">{{ t('Expiration Year') }}</label>
            <input
              v-model="cardInfo.expirationYear"
              :class="[{'has-error' : $v.cardInfo.expirationYear.$error || errors.cardExpirationYear }]"
              class="input"
              placeholder="YYYY"
              required
              @blur="$v.cardInfo.expirationYear.$touch()"
            >
            <span class="help-error" v-if="errors.cardExpirationYear">{{ errors.cardExpirationYear }}</span>
            <span class="help-error" v-if="!$v.cardInfo.expirationYear.required">{{ t('Expiration Year is required.') }}</span>
            <span class="help-error" v-if="!$v.cardInfo.expirationYear.numeric">{{ t('Expiration Year should be numeric.') }}</span>
            <span class="help-error" v-if="!$v.cardInfo.expirationYear.minLength || !$v.cardInfo.expirationYear.maxLength">{{ t('Expiration Year should be 4 digits length.') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, maxLength, numeric } from 'vuelidate/lib/validators'
import i18n from '@vue-storefront/i18n'
import rootStore from '@vue-storefront/core/store'

export default {
  name: 'CybersourceMicroform',
  data () {
    return {
      key: null,
      labelId: 'payment-cybersource-label',
      containerId: 'payment-cybersource-container',
      formOptions: {
        placeholder: 'Card Number',
        styles: {
          'input': {
            'font-size': '14px',
            'font-family': 'helvetica, tahoma, calibri, sans-serif',
            'color': '#555'
          },
          ':focus': { 'color': 'blue' },
          ':disabled': { 'cursor': 'not-allowed' },
          'valid': { 'color': '#3c763d' },
          'invalid': { 'color': '#a94442' }
        },
        encryptionType: 'rsaoaep256'
      },
      cardInfo: rootStore.state['payment-cybersource'].cardInfo,
      errors: {
        message: null,
        cardNumber: null,
        cardExpirationMonth: null,
        cardExpirationYear: null
      }
    }
  },
  async mounted () {
    this.key = await rootStore.dispatch('payment-cybersource/generateKey')
    this.setupMicroform()
  },
  methods: {
    t (string) {
      return i18n.t(string)
    },
    setupMicroform () {
      window.FLEX.microform({
        ...this.formOptions,
        keyId: this.key.kid,
        keystore: this.key,
        container: '#' + this.containerId,
        label: '#' + this.labelId
      }, (error, microformInstance) => {
        if (error) {
          console.error(error)
          return
        }
        rootStore.dispatch('payment-cybersource/setMicroform', microformInstance)
      })
    },
    validate () {
      this.errors = {
        message: null,
        cardNumber: null,
        cardExpirationMonth: null,
        cardExpirationYear: null
      }
      this.$v.$touch()
      if (this.$v.$invalid) {
        return false
      } else {
        return true
      }
    },
    setErrors (errorObject) {
      let errors = {}
      errors.message = errorObject.details.responseStatus.message
      for (let i = 0; i < errorObject.details.responseStatus.details.length; i++) {
        const error = errorObject.details.responseStatus.details[i]
        switch (error.location) {
          case 'cardInfo.cardNumber':
            errors.cardNumber = i18n.t(error.message.replace('cardInfo.cardNumber', 'Card Number'))
            break
          case 'cardInfo.cardType':
            errors.cardNumber = i18n.t(error.message.replace('cardInfo.cardType', 'Card Number'))
            break
          case 'cardInfo.cardExpirationMonth':
            errors.cardExpirationMonth = i18n.t(error.message.replace('cardInfo.cardExpirationMonth', 'Expiration Month'))
            break
          case 'cardInfo.cardExpirationYear':
            errors.cardExpirationYear = i18n.t(error.message.replace('cardInfo.cardExpirationYear', 'Expiration Year'))
            break
        }
      }
      this.errors = errors
    }
  },
  validations () {
    return {
      cardInfo: {
        expirationMonth: {
          required,
          numeric,
          minLength: minLength(2),
          maxLength: maxLength(2)
        },
        expirationYear: {
          required,
          numeric,
          minLength: minLength(4),
          maxLength: maxLength(4)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  margin: 0 -1rem;
  flex-wrap: wrap;
}

.col-6 {
  padding: 0 1rem;
  margin-bottom: .5rem;
  width: 100%;
  flex-basis: 100%;

  @media screen and (min-width: 768px) {
    width: 50%;
    flex-basis: 50%;
  }
}

.col-12 {
  padding: 0 1rem;
  margin-bottom: .5rem;
  width: 100%;
  flex-basis: 100%;
}

label {
  display: block;
  margin-bottom: .5rem;

  &.text-error {
    color: #a94442;
  }
}

.input {
  width: 100%;
  border: 1px solid #000;
  padding: .5rem 1rem;
  height: 40px;

  &.has-error {
    border-color: #a94442;
  }
}

.help-error {
  display: block;
  margin-top: .25rem;
  color: #a94442;
}

.error {
  background-color: #a94442;
  padding: .5rem 1rem;
  line-height: 1.5rem;
  color: #fff;
}
</style>
