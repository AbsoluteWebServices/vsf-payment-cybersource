import { CybersourceState } from '../types/CybersourceState'
import { ActionTree } from 'vuex'
import * as types from './mutation-types'
import config from 'config'
import { adjustMultistoreApiUrl } from '@vue-storefront/core/lib/multistore'

// it's a good practice for all actions to return Promises with effect of their execution
export const actions: ActionTree<CybersourceState, any> = {
    async generateKey ({ commit }) {
      let url = config.cybersource.endpoint.generateKey
      url = config.storeViews.multistore ? adjustMultistoreApiUrl(url) : url
      const resp = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
      });
      const json = await resp.json()
      commit(types.SET_KEY, json.result.key)
      return json.result.key
    },
    setMicroform ({ commit }, microformInstance) {
      commit(types.SET_MICROFORM, microformInstance)
    },
    // doPayment ({}, params) {
    //     let url = config.braintree.endpoint+'/do-payment'
    //     console.log(url)
    //     console.log(params)
    //     return fetch(url, {
    //         method: 'POST',
    //         mode: 'cors',
    //         headers: {
    //             'Accept': 'application/json, text/plain, */*',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(params)
    //     }).then(resp => { return resp.json() })
    //         .then((resp) => {
    //             console.debug(resp)
    //             return resp
    //         })
    // }
}
