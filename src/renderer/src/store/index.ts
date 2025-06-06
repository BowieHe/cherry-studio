import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import agents from './agents'
import assistants from './assistants'
import backup from './backup'
import copilot from './copilot'
import knowledge from './knowledge'
import llm from './llm'
import mcp from './mcp'
import messageBlocksReducer from './messageBlock'
import migrate from './migrate'
import minapps from './minapps'
import newMessagesReducer from './newMessage'
import nutstore from './nutstore'
import paintings from './paintings'
import runtime from './runtime'
import settings from './settings'
import shortcuts from './shortcuts'
import websearch from './websearch'

const rootReducer = combineReducers({
  assistants,
  agents,
  backup,
  nutstore,
  paintings,
  llm,
  settings,
  runtime,
  shortcuts,
  knowledge,
  minapps,
  websearch,
  mcp,
  copilot,
  // messages: messagesReducer,
  messages: newMessagesReducer,
  messageBlocks: messageBlocksReducer
})

const persistedReducer = persistReducer(
  {
    key: 'cherry-studio',
    storage,
    version: 97,
    blacklist: ['runtime', 'messages', 'messageBlocks'],
    migrate
  },
  rootReducer
)

const store = configureStore({
  // @ts-ignore store type is unknown
  reducer: persistedReducer as typeof rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
  },
  devTools: true
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<typeof store>()

window.store = store

export default store
