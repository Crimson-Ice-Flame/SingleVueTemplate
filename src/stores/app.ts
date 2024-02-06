import { defineStore } from 'pinia'

interface App {
    version: string
  }

export const useInfoStore = defineStore('info', {
    state: () :App => ({
        version: '1.0.0'
    }),
    getters: {},
    actions: {}
  })
  