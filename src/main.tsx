import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { persistor, store } from './domain/redux/store.ts'
import { Provider } from 'react-redux'
import App from './App.tsx'
import { PersistGate } from "redux-persist/integration/react";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
    </Provider>
  </StrictMode>,
)
