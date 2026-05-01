
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CheckAuth = ({children, protectRoute}) => {
    const navigate = useNavigate() ;
    const [loading, setLoading] = useState(true) ;
    useEffect(() => {
        const token = localStorage.getItem("token") ;

        if (protectRoute) {
            if (!token) {
                navigate("/login") ;
            }else{
            setLoading(false) ;
         }
        }else{
            if (token) {
                navigate("/")
            }else{
                setLoading(false)
            }
        }
         
    }, [navigate, protectRoute]) ;

    if (loading) {
        return <div>loading......</div>
    }else{
        return children 
    }
}

export default CheckAuth 