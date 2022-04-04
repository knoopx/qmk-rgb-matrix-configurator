import React from "react"
import { useLocalObservable } from "mobx-react"
import { autorun } from "mobx"

import { createStore } from "../store"

const StoreContext = React.createContext(null)

export const StoreProvider = ({ children }) => {
  const store = useLocalObservable(createStore)
  store.restoreState()

  autorun(() => {
    store.persistState()
  })

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  return React.useContext(StoreContext)
}
