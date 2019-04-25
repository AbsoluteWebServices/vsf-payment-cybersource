import { Module } from 'vuex'
import { CybersourceState } from '../types/CybersourceState'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'
import { state } from './state'

export const module: Module<CybersourceState, any> = {
    namespaced: true,
    mutations,
    actions,
    getters,
    state
}
