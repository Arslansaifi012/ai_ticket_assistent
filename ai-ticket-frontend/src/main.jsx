
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import checkAuth from './components/checkAuth.jsx'
import TicketDetailsPage from './pages/ticket.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Admin from './pages/admin.jsx'

createRoot(document.getElementById('root')).render(
    
    <BrowserRouter>
    <Routes>
        <Route path='/tickets/:id' element={
            <checkAuth protected={true}>
               <TicketDetailsPage/>
            </checkAuth>
        
    }     
        />


         <Route path='/login' element={
            <checkAuth protected={false}>
              <Login />
            </checkAuth>
        
    }     
        />


           <Route path='/signup' element={
            <checkAuth protected={false}>
             <Signup />
            </checkAuth>
        
    }     
        />


           <Route path='/admin' element={
            <checkAuth protected={true}>
             <Admin />
            </checkAuth>
        
    }     
        />

    </Routes>
    </BrowserRouter>
)
