
import { BrowserRouter, Route, Routes } from 'react-router'
import { Home } from './pages/Home'
import Login from './pages/Login'
import { Register } from './pages/Register'
import { Forgot } from './pages/Forgot'
import { Confirm } from './pages/Confirm'
import { NotFound } from './pages/NotFound'
import Dashboard from './layout/Dashboard'
import Profile from './pages/Profile'
import List from './pages/List'
import Details from './pages/Details'
import Create from './pages/Create'
import Update from './pages/Update'
import Chat from './pages/Chat'
import AdminChats from './pages/AdminChats'
import Reset from './pages/Reset'
import Panel from './pages/Panel'
import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'
import { useEffect } from 'react'
import storeProfile from './context/storeProfile'
import storeAuth from './context/storeAuth'



function App() {
    const { profile} = storeProfile()
  const { token } = storeAuth()

  useEffect(() => {
    if(token){
      profile()
    }
  }, [token])
  return (
    <>
    <BrowserRouter>
      <Routes>
        
        <Route element={<PublicRoute />}>
        <Route index element={<Home/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='register' element={<Register/>}/>
        <Route path='forgot/:id' element={<Forgot/>}/>
        <Route path='confirmar/:token' element={<Confirm/>}/>
        <Route path='recuperarpassword/:token' element={<Reset/>}/>
        <Route path='*' element={<NotFound />} />
        </Route>


          <Route path='dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route index element={<Panel />} />
            <Route path='profile' element={<Profile />} />
            <Route path='list' element={<List />} />
            <Route path='details/:id' element={<Details />} />
            <Route path='create' element={<Create />} />
            <Route path='update/:id' element={<Update />} />
            <Route path='chat' element={<Chat />} />
            <Route path='chats' element={<AdminChats />} />
          </Route>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
