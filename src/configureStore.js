import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
import { connectRoutes } from 'redux-first-router'
import thunkMiddleware from 'redux-thunk'
import { clientMiddleware } from './clientMiddleware'

import routesMap from './routesMap'
import * as reducers from './reducers'
import * as actionCreators from './actions'

export default (history, preLoadedState, client) => {
  const {
    reducer, middleware, enhancer, thunk
  } = connectRoutes(
    history,
    routesMap
  )

  const _middlewares = [middleware, thunkMiddleware, clientMiddleware(client)]

  const rootReducer = combineReducers({ ...reducers, location: reducer })
  const middlewares = applyMiddleware(..._middlewares)
  const enhancers = composeEnhancers(enhancer, middlewares)
  const store = createStore(rootReducer, preLoadedState, enhancers)

  if (module.hot && process.env.NODE_ENV === 'development') {
    module.hot.accept('./reducers/index', () => {
      const reducers = require('./reducers/index')
      const rootReducer = combineReducers({ ...reducers, location: reducer })
      store.replaceReducer(rootReducer)
    })
  }

  return { store, thunk }
}

const composeEnhancers = (...args) =>
  typeof window !== 'undefined'
    ? composeWithDevTools({ actionCreators })(...args)
    : compose(...args)
