import { MutationTree } from 'vuex'
import * as types from './mutation-types'

export const mutations: MutationTree<any> = {
  [types.SET_KEY] (state, data) {
    state.key = data
  },
  [types.SET_MICROFORM] (state, data) {
    state.microform = data
  }
}
