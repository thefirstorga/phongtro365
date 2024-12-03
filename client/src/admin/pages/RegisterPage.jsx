import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function RegisterPage() {
    // Kiểm tra xem cookie có tên 'tokenAdmin' có tồn tại không
    const tokenAdmin = document.cookie.split('; ').find(row => row.startsWith('tokenAdmin='));

    // Nếu không có tokenAdmin, khởi tạo nó với giá trị rỗng
    if (!tokenAdmin) {
    document.cookie = "tokenAdmin="; // Khởi tạo cookie 'tokenAdmin' với giá trị rỗng
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    async function registerAdmin(ev) {
        ev.preventDefault();
        try {
            const {res} = await axios.post("/admin-api/register", {
                email, password
            })
            if(res!=='not') {
                alert('Registration successfull')
                window.location.reload()
            } else {
                alert('Chưa đăng nhập')
            }
            
        } catch (error) {
            alert("Fail, try again")
        }
    }

  return (
    <div className='mt-4 grow flex items-center justify-around'>
        <div className="mb-64">
            <h1 className='text-4xl text-center mb-4'>Thêm admin</h1>
            <form className='max-w-lg mx-auto' onSubmit={registerAdmin}>
                <input type="email" 
                        placeholder='your@email.com'
                        value={email} 
                        onChange={ev => setEmail(ev.target.value)}/>
                <input type="password" 
                        placeholder='yourpassword'
                        value={password} 
                        onChange={ev => setPassword(ev.target.value)}/>
                <button className='primary'>Thêm</button>
            </form>
        </div> 
    </div>
  )
}

export default RegisterPage