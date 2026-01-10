import { defineStore } from 'pinia'
import moment from 'moment'

export const useAnniversaryStore = defineStore('anniversary', {
  state: () => ({
    anniversaryDate: '11-01-2014',
    isAuthenticated: false 
  }),

  getters: {
    getANVDate: (state) => {
      return moment(state.anniversaryDate,'DD-MM-YYYY')
    },
  },

  actions: {
    setAuthenticated(status) {
      this.isAuthenticated = status
    }
  }
})