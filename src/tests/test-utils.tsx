import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import ContextProvider from '../components/Context'
import { MemoryRouter } from 'react-router-dom'
import '../utils/i18n'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ContextProvider>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </ContextProvider>
    </Provider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
