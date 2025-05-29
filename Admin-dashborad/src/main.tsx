import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { RouterProvider } from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import store from './redux/store';
import router from './routing';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
        <RouterProvider router={router}  />
    </Provider>
  </StrictMode>
)
