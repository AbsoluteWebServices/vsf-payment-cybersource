import { CybersourceState } from '../types/CybersourceState'
import { MutationTree } from 'vuex'
import * as types from './mutation-types'

export const mutations: MutationTree<CybersourceState> = {
  [types.SET_KEY] (state, data) {
    state.key = data
  },
  [types.SET_TOKEN] (state, data) {
    state.token = data
  }
}
