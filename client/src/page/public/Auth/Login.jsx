import React, {useState} from 'react'
import { InputForm } from '../../../components'
import backgroud from '../../../asset/img/thumbnail.jpg'

const Login = () => {
  const [payload, setPayload] = useState({
    email: "",
    phone: "",
    password: "",
    name: "",
  });
  return (
    <div className='w-screen h-screen relative'>
      <img src={backgroud} alt="" className='absolute w-[70%] h-full right-0 object-cover'/>
      <div className='absolute w-[30%] top-0 bottom-0 left-0 right-1/2 flex items-center justify-center bg-primary'>
        <div className='p-8 flex flex-col items-center'>
          <h1 className='text-2xl font-semibold text-main'>Đăng nhập</h1>
          <InputForm
            label={"EMAIL"}
            value={payload.email}
            setValue={setPayload}
            keyPayload={"email"}
          />
          <InputForm
            label={"SỐ ĐIỆN THOẠI"}
            value={payload.email}
            setValue={setPayload}
            keyPayload={"email"}
          />
          <InputForm
            label={"EMAIL"}
            value={payload.email}
            setValue={setPayload}
            keyPayload={"email"}
          />
          <InputForm
            label={"EMAIL"}
            value={payload.email}
            setValue={setPayload}
            keyPayload={"email"}
          />
        </div>
      </div>
    </div>
  )
}

export default Login