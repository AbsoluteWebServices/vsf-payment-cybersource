import config from 'config'
import { VueStorefrontModule, VueStorefrontModuleConfig } from '@vue-storefront/core/lib/module'
import { afterRegistration } from './hooks/afterRegistration'
import { module } from './store'

export const KEY = 'payment-cybersource'
export const METHOD_CODE = config.cybersource.backend_method_code || KEY

const moduleConfig: VueStorefrontModuleConfig = {
  key: KEY,
  store: { modules: [{ key: KEY, module }] },
  afterRegistration
}

export const PaymentCybersource = new VueStorefrontModule(moduleConfig)
