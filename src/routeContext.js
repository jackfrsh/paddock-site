import { createContext } from 'react'

/* The current public path and the SPA navigate function, so shared pieces such
   as the breadcrumbs know where they are without every page passing props. */
export const RouteContext = createContext({ path: null, navigateTo: null })
