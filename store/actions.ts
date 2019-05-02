import { CybersourceState } from '../types/CybersourceState'
import { ActionTree } from 'vuex'
import * as types from './mutation-types'
import config from 'config'
import { adjustMultistoreApiUrl } from '@vue-storefront/core/lib/multistore'

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
  invalidateKey ({ commit }) {
    commit(types.SET_KEY, null)
  },
  setMicroform ({ commit }, microformInstance) {
    commit(types.SET_MICROFORM, microformInstance)
  },
  invalidateMicroform ({ commit }) {
    commit(types.SET_MICROFORM, null)
  },
  setToken ({ commit, dispatch }, token) {
    commit(types.SET_TOKEN, token)
    dispatch('invalidateMicroform')
    dispatch('invalidateKey')
  },
  invalidateToken ({ commit }) {
    commit(types.SET_TOKEN, null)
  }
}
