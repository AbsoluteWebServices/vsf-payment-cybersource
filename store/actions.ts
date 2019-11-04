import { CybersourceState } from '../types/CybersourceState'
import { ActionTree } from 'vuex'
import * as types from './mutation-types'
import config from 'config'
import fetch from 'isomorphic-fetch'
import { adjustMultistoreApiUrl } from '@vue-storefront/core/lib/multistore'

export const actions: ActionTree<CybersourceState, any> = {
  generateKey ({ commit }): Promise<Response> {
    let url = config.cybersource.endpoint + '/generate-key'
    url = config.storeViews.multistore ? adjustMultistoreApiUrl(url) : url

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
      }).then(resp => {
        resp.json().then(json => {
          commit(types.SET_KEY, json.result.key)
          resolve(json.result.key)
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
    })
  },
  addPaymentData ({ commit }, data): Promise<Response> {
    let url = config.cybersource.endpoint.addPaymentData
    url = config.storeViews.multistore ? adjustMultistoreApiUrl(url) : url

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
      }).then(resp => {
        resolve(resp)
      }).catch(err => {
        reject(err)
      })
    })
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
