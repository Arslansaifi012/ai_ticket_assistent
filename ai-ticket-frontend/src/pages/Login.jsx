
import React, { useState, useNavigate } from 'react'

const Login = () => {

  const [form, setForm] = useState({email: "", password: ""}) ;
  const [loading, setLoading] = useState(false) ;
  const navigate = useNavigate() ;

  const handleChange = (e) =>{
    setForm({...form, [e.target.name]: e.target.value}) ;
  } ;

  const handleLogin = async (e) =>{
    e.prevenDefault() ;
    setLoading(true) ;

    try {
      const responce = await fetch(`${import.meta.VITE_SERVER_URL}/auth/login`,
        {
          method:"POST",
          headers:{
            "Content-Type": "application/json"
          },
          body:JSON.stringify(form) 
        }
      ) ;
      const data = responce.json() ;
      console.log(data);
      if (responce.ok) {
        localStorage.setItem("token", data.token) ;
        localStorage.setItem("user", JSON.stringify(data.user)) ;
        navigate("/") ;
      }else{
        alert(data.message || "signup failed") ;
      }

    } catch (error) {
      console.log('signup_error',error.message);

    }finally{
      setLoading(false) ;

    }

  }


  return (
    <div>login</div>
  )
}

export default Login