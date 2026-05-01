
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CheckAuth from './components/CheckAuth.jsx'
import TicketDetailsPage from './pages/ticket.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Admin from './pages/admin.jsx'

createRoot(document.getElementById('root')).render(
    
    <BrowserRouter>
    <Routes>
        <Route path='/tickets/:id' element={
            <CheckAuth protected={true}>
               <TicketDetailsPage/>
            </CheckAuth>
        
    }     
        />


         <Route path='/login' element={
            <CheckAuth protected={false}>
              <Login />
            </CheckAuth>
        
    }     
        />


           <Route path='/signup' element={
            <CheckAuth protected={false}>
             <Signup />
            </CheckAuth>
        
    }     
        />


           <Route path='/admin' element={
            <CheckAuth protected={true}>
             <Admin />
            </CheckAuth>
        
    }     
        />

    </Routes>
    </BrowserRouter>
)
