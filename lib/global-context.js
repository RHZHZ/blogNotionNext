import { createContext, useContext } from 'react'

export const GlobalContext = createContext({})

let globalContextSnapshot = {}

export const useGlobal = () => useContext(GlobalContext)

export const setGlobalContextSnapshot = value => {
  globalContextSnapshot = value || {}
}

export const getGlobalContextSnapshot = () => globalContextSnapshot

