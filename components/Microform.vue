<template>
  <div id="payment-cybersource" class="relative">
    <div class="row">
      <div v-if="errors.message" class="col-12">
        <div class="error">{{ errors.message }}</div>
      </div>
      <div class="col-12">
        <label :id="labelId" :class="[{'text-error' : errors.cardNumber }]">{{ t('Credit Card') }}</label>
        <div
          :id="containerId"
          :class="[{'has-error' : errors.cardNumber }, {disabled}]"
          :disabled="disabled"
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
              :class="[{'has-error' : $v.cardInfo.expirationMonth.$error || errors.cardExpirationMonth }, {disabled}]"
              :disabled="disabled"
              class="input"
              placeholder="MM"
              required
              @blur="$v.cardInfo.expirationMonth.$touch()"
            >
            <span class="help-error" v-if="errors.cardExpirationMonth">{{ errors.cardExpirationMonth }}</span>
            <span class="help-error" v-if="$v.cardInfo.expirationMonth.$error && !$v.cardInfo.expirationMonth.required">{{ t('Expiration Month is required.') }}</span>
            <span class="help-error" v-if="$v.cardInfo.expirationMonth.$error && !$v.cardInfo.expirationMonth.numeric">{{ t('Expiration Month should be numeric.') }}</span>
            <span class="help-error" v-if="$v.cardInfo.expirationMonth.$error && !$v.cardInfo.expirationMonth.minLength || !$v.cardInfo.expirationMonth.maxLength">{{ t('Expiration Month should be 2 digits length.') }}</span>
          </div>

          <div class="col-6">
            <label :class="[{'text-error' : $v.cardInfo.expirationYear.$error || errors.cardExpirationYear }]">{{ t('Expiration Year') }}</label>
            <input
              v-model="cardInfo.expirationYear"
              :class="[{'has-error' : $v.cardInfo.expirationYear.$error || errors.cardExpirationYear }, {disabled}]"
              :disabled="disabled"
              class="input"
              placeholder="YYYY"
              required
              @blur="$v.cardInfo.expirationYear.$touch()"
            >
            <span class="help-error" v-if="errors.cardExpirationYear">{{ errors.cardExpirationYear }}</span>
            <span class="help-error" v-if="$v.cardInfo.expirationYear.$error && !$v.cardInfo.expirationYear.required">{{ t('Expiration Year is required.') }}</span>
            <span class="help-error" v-if="$v.cardInfo.expirationYear.$error && !$v.cardInfo.expirationYear.numeric">{{ t('Expiration Year should be numeric.') }}</span>
            <span class="help-error" v-if="$v.cardInfo.expirationYear.$error && !$v.cardInfo.expirationYear.minLength || !$v.cardInfo.expirationYear.maxLength">{{ t('Expiration Year should be 4 digits length.') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="disabled" class="disabled-overlay">
      <button type="button" class="btn reload-btn" @click="init">{{ t('Reload') }}</button>
    </div>
  </div>
</template>

<script>
import { required, minLength, maxLength, numeric } from 'vuelidate/lib/validators'
import i18n from '@vue-storefront/i18n'
import rootStore from '@vue-storefront/core/store'
import { setTimeout, clearTimeout } from 'timers'

export default {
  name: 'CybersourceMicroform',
  data () {
    return {
      disabled: false,
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
      },
      timeout: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    t (string) {
      return i18n.t(string)
    },
    async init () {
      this.block()
      this.cancelReload()
      this.invalidateMicroform()

      var start = Date.now()
      await this.setupMicroform()
      var interval = (15 * 60 * 1000) - (Date.now() - start) - 5

      this.timeout = setTimeout(this.reload, interval)
    },
    cancelReload () {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
    },
    async setupMicroform () {
      const key = await rootStore.dispatch('payment-cybersource/generateKey')
      window.FLEX.microform({
        ...this.formOptions,
        keyId: key.kid,
        keystore: key,
        container: '#' + this.containerId,
        label: '#' + this.labelId
      }, (error, microformInstance) => {
        if (error) {
          console.error(error)
          return
        }
        rootStore.dispatch('payment-cybersource/setMicroform', microformInstance)
        this.unblock()
      })
    },
    invalidateMicroform () {
      this.block()
      rootStore.dispatch('payment-cybersource/invalidateKey')
      rootStore.dispatch('payment-cybersource/invalidateMicroform')
      rootStore.dispatch('payment-cybersource/invalidateToken')
      if (document.getElementById(this.containerId)) {
        document.getElementById(this.containerId).innerHTML = null
      }
      this.errors = {
        message: null,
        cardNumber: null,
        cardExpirationMonth: null,
        cardExpirationYear: null
      }
      this.$v.$reset()
    },
    block () {
      this.disabled = true
    },
    unblock () {
      this.disabled = false
    },
    validate () {
      this.errors = {
        message: null,
        cardNumber: null,
        cardExpirationMonth: null,
        cardExpirationYear: null
      }
      this.$v.$touch()
      if (this.$v.$invalid || this.disabled) {
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
.relative {
  position: relative;
}

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

.disabled {
  cursor: not-allowed;
}

.disabled-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: rgba(255, 255, 255, .4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color .3s ease;

  .reload-btn {
    border: none;
    background: #fff;
    padding: .25rem;
    color: #000;
    font-size: 1.25rem;
    opacity: 0;
    transition: opacity .3s ease;

    &:focus {
      outline: none;
    }
  }

  &:hover, &:focus {
    background-color: rgba(255, 255, 255, .8);

    .reload-btn {
      opacity: 1;
    }
  }
}
</style>
