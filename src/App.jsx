import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import { EthProvider } from './context/EthContext'
import { UserProvider } from './context/UserContext'
import Profile from './pages/Profile'
import { AxiosInterceptor } from './components/Axios'
import Footer from './components/Footer'
import CodeForm from './pages/CodeForm'
import CodeScreen from './pages/CodeScreen'
import ProfileEdit from './pages/ProfileEdit'
import Explore from './pages/Explore'
import { Suspense, lazy } from 'react'
import PrivateRoute from './components/PrivateRoute'
import CookiesPolicy from './pages/CookiesPolicy'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsService from './pages/TermsService'
import Github from './pages/Github'
import CookiesBanner from './components/CookiesBanner'

const HomePage = lazy(() => import('./pages/Home'))

function App () {
  return (
    <EthProvider>
      <UserProvider>
        <Suspense fallback={null}>
          <BrowserRouter>
            <AxiosInterceptor>
              <Header />
              <Routes>
                <Route path='/explore' element={<Explore />} />
                <Route path='/explore/:tab' element={<Explore />} />
                <Route path='/profile/:hash/:section' element={<Profile />} />
                <Route path='/profile/:hash' element={<Profile />} />
                <Route path='/create' element={<PrivateRoute><CodeForm /></PrivateRoute>} />
                <Route path='/code/:tokenId' element={<CodeScreen />} />
                <Route path='/account/edit' element={<PrivateRoute><ProfileEdit /></PrivateRoute>} />
                <Route path='/cookies_policy' element={<CookiesPolicy />} />
                <Route path='/privacy_policy' element={<PrivacyPolicy />} />
                <Route path='/terms_service' element={<TermsService />} />
                <Route path='/github' element={<Github />} />
                <Route path='/' element={<HomePage />} />
              </Routes>
              <Footer />
              <CookiesBanner />
            </AxiosInterceptor>
          </BrowserRouter>
        </Suspense>
      </UserProvider>
    </EthProvider>
  )
}

export default App
