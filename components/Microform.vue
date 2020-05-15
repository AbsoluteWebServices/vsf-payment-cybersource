<template>
  <div id="payment-cybersource" class="relative">
    <div class="row" v-if="11 === 11">
      <div v-if="errors.message" class="col-12">
        <div class="error">{{ errors.message }}</div>
      </div>
      <div class="col-6">
        <label :id="labelId" :class="[{'text-error' : errors.cardNumber }]">{{ t('Credit Card') }}</label>
        <div
          :id="containerId"
          :class="[{'has-error' : errors.cardNumber }, {disabled}]"
          :disabled="disabled"
          class="input"
        />
        <span class="help-error" v-if="errors.cardNumber">{{ errors.cardNumber }}</span>
      </div>
      <div class="col-6">
        <div class="card-types">
          <svg class=""><use xlink:href="#payment-cybersource-visa"/></svg>
          <svg class=""><use xlink:href="#payment-cybersource-mastercard"/></svg>
          <svg class=""><use xlink:href="#payment-cybersource-discover"/></svg>
          <svg class=""><use xlink:href="#payment-cybersource-amex"/></svg>
        </div>
      </div>
      <div class="col-12">
        <div class="row">
          <div class="col-6">
            <label :class="[{'text-error' : $v.cardInfo.expirationMonth.$error || errors.cardExpirationMonth }]">{{ t('Expiration Month') }}</label>
            <select
              v-model="cardInfo.expirationMonth"
              :class="[{'has-error' : $v.cardInfo.expirationMonth.$error || errors.cardExpirationMonth }, {disabled}]"
              :disabled="disabled"
              class="select"
              required
              @blur="$v.cardInfo.expirationMonth.$touch()"
            >
              <option value="" disabled selected="selected">{{ t('Month') }}</option>
              <option
                v-for="(option, key) in monthsOptions"
                :key="key"
                :value="option.value"
                v-bind="{selected: option.value === cardInfo.expirationMonth}"
              >
                {{ option.label }}
              </option>
            </select>
            <span class="help-error" v-if="errors.cardExpirationMonth">{{ errors.cardExpirationMonth }}</span>
            <span class="help-error" v-if="$v.cardInfo.expirationMonth.$error && !$v.cardInfo.expirationMonth.required">{{ t('Expiration Month is required.') }}</span>
            <span class="help-error" v-if="$v.cardInfo.expirationMonth.$error && !$v.cardInfo.expirationMonth.numeric">{{ t('Expiration Month should be numeric.') }}</span>
            <span class="help-error" v-if="$v.cardInfo.expirationMonth.$error && !$v.cardInfo.expirationMonth.minLength || !$v.cardInfo.expirationMonth.maxLength">{{ t('Expiration Month should be 2 digits length.') }}</span>
          </div>

          <div class="col-6">
            <label :class="[{'text-error' : $v.cardInfo.expirationYear.$error || errors.cardExpirationYear }]">{{ t('Expiration Year') }}</label>
            <select
              v-model="cardInfo.expirationYear"
              :class="[{'has-error' : $v.cardInfo.expirationYear.$error || errors.cardExpirationYear }, {disabled}]"
              :disabled="disabled"
              class="select"
              required
              @blur="$v.cardInfo.expirationYear.$touch()"
            >
              <option value="" disabled selected="selected">{{ t('Year') }}</option>
              <option
                v-for="(option, key) in yearsOptions"
                :key="key"
                :value="option.value"
                v-bind="{selected: option.value === cardInfo.expirationMonth}"
              >
                {{ option.label }}
              </option>
            </select>
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
    <svg style="display: none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <symbol viewBox="0 0 291.764 291.764" id="payment-cybersource-amex">
          <g>
            <path style="fill:#26A6D1;" d="M18.235,41.025h255.294c10.066,0,18.235,8.169,18.235,18.244v173.235
        c0,10.066-8.169,18.235-18.235,18.235H18.235C8.16,250.74,0,242.57,0,232.505V59.269C0,49.194,8.169,41.025,18.235,41.025z"/>
            <path style="fill:#FFFFFF;" d="M47.047,113.966l-28.812,63.76h34.492l4.276-10.166h9.774l4.276,10.166h37.966v-7.759l3.383,7.759
        h19.639l3.383-7.923v7.923h78.959l9.601-9.902l8.99,9.902l40.555,0.082l-28.903-31.784l28.903-32.058h-39.926l-9.346,9.719
        l-8.707-9.719h-85.897l-7.376,16.457l-7.549-16.457h-34.42v7.495l-3.829-7.495C76.479,113.966,47.047,113.966,47.047,113.966z
         M53.721,123.02h16.813l19.111,43.236V123.02h18.418l14.761,31l13.604-31h18.326v45.752h-11.151l-0.091-35.851l-16.257,35.851
        h-9.975l-16.348-35.851v35.851h-22.94l-4.349-10.257H50.147l-4.34,10.248H33.516C33.516,168.763,53.721,123.02,53.721,123.02z
         M164.956,123.02h45.342L224.166,138l14.315-14.98h13.868l-21.071,22.995l21.071,22.73h-14.497l-13.868-15.154l-14.388,15.154
        h-44.64L164.956,123.02L164.956,123.02z M61.9,130.761l-7.741,18.272h15.473L61.9,130.761z M176.153,132.493v8.352h24.736v9.309
        h-24.736v9.118h27.745l12.892-13.43l-12.345-13.357h-28.292L176.153,132.493z"/>
          </g>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
        </symbol>
        <symbol viewBox="0 0 512 512" id="payment-cybersource-discover" >
          <path style="fill:#34495E;" d="M512,402.282c0,16.716-13.55,30.267-30.265,30.267H30.265C13.55,432.549,0,418.996,0,402.282V109.717
    c0-16.716,13.55-30.266,30.265-30.266h451.469c16.716,0,30.265,13.551,30.265,30.266L512,402.282L512,402.282z"/>
          <path style="opacity:0.15;fill:#202121;enable-background:new    ;" d="M21.517,402.282V109.717
    c0-16.716,13.552-30.266,30.267-30.266h-21.52C13.55,79.451,0,93.003,0,109.717v292.565c0,16.716,13.55,30.267,30.265,30.267h21.52
    C35.07,432.549,21.517,418.996,21.517,402.282z"/>
          <path style="fill:#F26E21;" d="M309.389,255.801c0.041-9.636-3.572-19.286-10.843-26.558c-7.287-7.287-16.961-10.897-26.617-10.839
    c-0.046,0-0.091-0.003-0.139-0.003c-20.968,0-37.6,16.628-37.6,37.602c0,20.767,16.837,37.599,37.6,37.599
    c20.974,0,37.604-16.631,37.604-37.599C309.394,255.934,309.389,255.869,309.389,255.801z"/>
          <g>
            <path style="fill:#E7E8E3;" d="M227.198,271.909c-5.62,5.626-10.807,7.824-16.394,7.943c-13.611-0.122-23.618-10.202-23.618-24.573
        c0-7.234,2.739-13.163,7.078-18.228l0,0c4.069-3.863,9.311-6.359,15.339-6.359c6.507,0,11.571,2.169,17.352,7.954v-16.631
        c-5.78-2.891-10.846-4.338-17.352-4.338c-9.192,0.657-17.859,4.371-24.507,10.203l0,0c-1.916,1.724-3.752,3.627-5.309,5.805
        c-4.856,6.294-7.791,14.001-7.791,22.32c0,20.967,16.637,36.875,37.606,36.875c0.102,0,0.203-0.009,0.302-0.01
        c0.141,0.002,0.28,0.01,0.42,0.01c5.784,0,10.85-1.443,17.357-4.336L227.198,271.909c-0.244,0.244,0.242,0.471,0,0.702V271.909z"/>
            <polygon style="fill:#E7E8E3;" points="356.863,228.033 356.863,228.033 340.487,268.295 321.685,220.566 306.502,220.566
        336.148,293.601 344.102,293.601 375.196,220.566 360.013,220.566     "/>
            <polygon style="fill:#E7E8E3;" points="380.983,252.384 380.983,291.435 420.033,291.435 420.753,291.435 420.753,279.861
        408.461,279.861 395.445,279.861 395.445,266.848 395.445,260.342 420.033,260.342 420.033,248.045 395.445,248.045
        395.445,232.861 420.753,232.861 420.753,220.566 380.983,220.566     "/>
            <path style="fill:#E7E8E3;" d="M54.135,220.566H33.884v70.869h20.25c10.845,0,18.798-2.895,25.306-7.957
        c7.953-6.508,13.017-16.629,13.017-27.474C92.458,235.028,77.27,220.566,54.135,220.566z M70.765,274.08
        c-4.339,3.614-10.124,5.781-18.802,5.781h-4.339V232.86h3.615c8.678,0,14.463,1.446,18.803,5.783
        c5.061,4.336,7.955,10.848,7.955,17.358C78.72,262.509,75.828,269.737,70.765,274.08z"/>
            <rect x="98.97" y="220.56" style="fill:#E7E8E3;" width="13.739" height="70.867"/>
            <path style="fill:#E7E8E3;" d="M147.415,248.045c-8.676-2.892-10.848-5.063-10.848-8.677c0-4.339,4.339-7.954,10.124-7.954
        c4.339,0,7.954,1.447,11.57,5.786l7.233-9.4c-5.787-5.064-13.015-7.953-20.97-7.953c-12.296,0-22.42,8.678-22.42,20.244
        c0,10.126,4.343,14.464,17.357,19.526c5.785,2.166,7.955,2.892,9.404,4.338c2.887,1.444,4.336,4.339,4.336,7.228
        c0,5.786-4.336,10.126-10.848,10.126c-6.514,0-12.294-3.615-15.187-9.401l-8.678,8.678c6.511,9.4,14.465,13.738,24.589,13.738
        c14.461,0,24.58-9.4,24.58-23.141C167.659,258.893,163.324,253.831,147.415,248.045z"/>
            <path style="fill:#E7E8E3;" d="M459.804,261.783c10.843-2.166,16.63-9.4,16.63-20.244c0-13.014-9.402-20.973-25.308-20.973h-20.972
        v70.869h13.739V263.23h2.172l19.519,28.205h16.634L459.804,261.783z M448.23,253.105h-4.336v-21.691h4.336
        c8.678,0,13.742,3.614,13.742,10.85C461.972,249.492,456.909,253.105,448.23,253.105z"/>
          </g>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
        </symbol>
        <symbol viewBox="0 0 512 512" id="payment-cybersource-mastercard">
          <path style="fill:#5286F9;" d="M488.727,66.494H256H23.273C10.42,66.494,0,76.914,0,89.767v332.466
    c0,12.853,10.42,23.273,23.273,23.273H256h232.727c12.853,0,23.273-10.42,23.273-23.273V89.767
    C512,76.914,501.58,66.494,488.727,66.494z"/>
          <path style="fill:#FFB655;" d="M273.776,189.773c5.115,5.86,9.57,12.31,13.236,19.242c7.427,14.041,11.655,30.026,11.655,46.986
    s-4.228,32.943-11.655,46.986c-3.666,6.932-8.121,13.38-13.236,19.24c-5.264,6.031-11.23,11.427-17.776,16.069
    c16.454,11.664,36.523,18.553,58.182,18.553c55.608,0,100.849-45.241,100.849-100.848S369.79,155.152,314.182,155.152
    c-21.659,0-41.728,6.886-58.182,18.553C262.544,178.347,268.51,183.744,273.776,189.773z"/>
          <path style="fill:#D8143A;" d="M287.012,209.016c-3.666-6.934-8.121-13.382-13.236-19.242c-5.267-6.031-11.231-11.425-17.776-16.066
    c-16.452-11.667-36.523-18.553-58.182-18.553c-55.608,0-100.848,45.241-100.848,100.848s45.241,100.848,100.848,100.848
    c21.659,0,41.73-6.887,58.182-18.553c6.546-4.641,12.51-10.038,17.776-16.067c5.115-5.86,9.57-12.31,13.236-19.24
    c7.427-14.043,11.655-30.028,11.655-46.986C298.667,239.041,294.439,223.057,287.012,209.016z"/>
          <path style="fill:#3D6DEB;" d="M197.818,356.851c-55.608,0-100.848-45.241-100.848-100.848s45.241-100.848,100.848-100.848
    c21.659,0,41.728,6.886,58.182,18.553V66.494H23.273C10.42,66.494,0,76.914,0,89.767v332.466c0,12.853,10.42,23.273,23.273,23.273
    H256v-107.21C239.546,349.962,219.477,356.851,197.818,356.851z"/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
        </symbol>
        <symbol viewBox="0 0 512 512" id="payment-cybersource-visa">
          <path style="fill:#FFFFFF;" d="M512,402.281c0,16.716-13.55,30.267-30.265,30.267H30.265C13.55,432.549,0,418.997,0,402.281V109.717
    c0-16.716,13.55-30.266,30.265-30.266h451.47c16.716,0,30.265,13.551,30.265,30.266V402.281L512,402.281z"/>
          <path style="fill:#F79F1A;" d="M113.64,258.035l-12.022-57.671c-2.055-7.953-8.035-10.319-15.507-10.632H30.993l-0.491,2.635
    C73.431,202.774,101.836,227.88,113.64,258.035z"/>
          <g>
            <polygon style="fill:#059BBF;" points="241.354,190.892 205.741,190.892 183.499,321.419 219.053,321.419  "/>
            <path style="fill:#059BBF;" d="M135.345,321.288l56.01-130.307h-37.691l-34.843,89.028l-3.719-13.442
        c-6.83-16.171-26.35-39.446-49.266-54.098l31.85,108.863L135.345,321.288z"/>
            <path style="fill:#059BBF;" d="M342.931,278.75c0.132-14.819-9.383-26.122-29.887-35.458c-12.461-6.03-20.056-10.051-19.965-16.17
        c0-5.406,6.432-11.213,20.368-11.213c11.661-0.179,20.057,2.367,26.624,5.003l3.218,1.475l4.826-28.277
        c-7.059-2.637-18.094-5.451-31.895-5.451c-35.157,0-59.904,17.691-60.128,43.064c-0.224,18.763,17.692,29.216,31.181,35.469
        c13.847,6.374,18.493,10.453,18.404,16.171c-0.089,8.743-11.035,12.73-21.264,12.73c-14.25,0-21.8-1.965-33.509-6.843l-4.55-2.09
        l-4.998,29.249c8.303,3.629,23.668,6.801,39.618,6.933C318.361,323.342,342.663,305.876,342.931,278.75z"/>
            <path style="fill:#059BBF;" d="M385.233,301.855c4.065,0,40.382,0.045,45.566,0.045c1.072,4.545,4.333,19.565,4.333,19.565h33.011
        L439.33,191.027h-27.472c-8.533,0-14.874,2.323-18.628,10.809l-52.845,119.629h37.392
        C377.774,321.465,383.848,305.386,385.233,301.855z M409.622,238.645c-0.176,0.357,2.95-7.549,4.737-12.463l2.411,11.256
        c0,0,6.792,31.182,8.22,37.704h-29.528C398.411,267.638,409.622,238.645,409.622,238.645z"/>
            <path style="fill:#059BBF;" d="M481.735,79.451H30.265C13.55,79.451,0,93.001,0,109.717v31.412h512v-31.412
        C512,93.001,498.451,79.451,481.735,79.451z"/>
          </g>
          <path style="fill:#F79F1A;" d="M481.735,432.549H30.265C13.55,432.549,0,418.998,0,402.283v-31.412h512v31.412
    C512,418.998,498.451,432.549,481.735,432.549z"/>
          <path style="opacity:0.15;fill:#202121;enable-background:new    ;" d="M21.517,402.281V109.717
    c0-16.716,13.551-30.266,30.267-30.266h-21.52C13.55,79.451,0,93.001,0,109.717v292.565c0,16.716,13.55,30.267,30.265,30.267h21.52
    C35.069,432.549,21.517,418.997,21.517,402.281z"/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
          <g/>
        </symbol>
      </defs>
    </svg>
  </div>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import i18n from '@vue-storefront/i18n'
import rootStore from '@vue-storefront/core/store'
import { setTimeout, clearTimeout } from 'timers'

export default {
  name: 'CybersourceMicroform',
  data () {
    return {
      microform: null,
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
      timeout: null,
      month: ''
    }
  },
  computed: {
    monthsOptions () {
      let monthsOptions = []
      for (let i = 1; i < 13; i++) {
        monthsOptions.push({
          value: (i < 10) ? '0' + i : '' + i,
          label: (i < 10) ? '0' + i : '' + i
        })
      }
      return monthsOptions
    },
    yearsOptions () {
      let monthsOptions = []
      for (let i = new Date().getFullYear(); i < new Date().getFullYear() + 21; i++) {
        monthsOptions.push({
          value: '' + i,
          label: i
        })
      }
      return monthsOptions
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

        microformInstance.on('cardTypeChange', this.onValidationChange)

        this.microform = microformInstance
        this.unblock()
      })
    },
    invalidateMicroform () {
      this.block()
      rootStore.dispatch('payment-cybersource/invalidateKey')
      rootStore.dispatch('payment-cybersource/invalidateToken')
      this.microform = null
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
    },
    onValidationChange (data) {
      this.errors.cardNumber = null
      if (!data || !data.card || data.card.length < 1) {
        this.errors.cardNumber = i18n.t('Card number is invalid')
      }
    },
    async tokenize () {
      if (!this.validate()) {
        return new Promise((resolve, reject) => resolve(false))
      }

      const options = {
        cardExpirationMonth: this.cardInfo.expirationMonth,
        cardExpirationYear: this.cardInfo.expirationYear
      }

      this.$store.dispatch('payment-cybersource/invalidateToken')
      return new Promise((resolve, reject) => {
        this.microform.createToken(options, async (error, token) => {
          if (error) {
            // handle error
            this.unblock()
            this.setErrors(error)
            resolve(false)
          } else {
            this.cancelReload()
            this.$store.dispatch('payment-cybersource/setToken', token)
            await this.$store.dispatch('payment-cybersource/addPaymentData', {
              ...token,
              ...options,
              quote_masked_id: this.$store.state.cart.cartServerToken
            })
            resolve(true)
          }
        })
      })
    }
  },
  validations () {
    return {
      cardInfo: {
        expirationMonth: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(2)
        },
        expirationYear: {
          required,
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

.select {
  padding: 1.25rem;
  border-width: 1px;
  border-color: transparent;
  width: 100%;
  background-color: #f4f4f4;
  color: #000;
  height: 60px;
  -webkit-appearance: none;
  -webkit-border-radius: 0px;
  -moz-border-radius: 0px;
  -ms-border-radius: 0px;
  border-radius: 0px;

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
.card-types {
  display: flex;
  align-items: center;
  margin-top: 10px;

  @media screen and (min-width: 768px) {
    margin-top: 40px;
  }

  svg {
    width: 45px;
    height: 30px;
    margin-left: 5px;

    &:first-child {
      margin-left: 0;
    }

  }
}
</style>
