import React from 'react'

const Footer = () => {
  return (
    <div className='bg-[#252525da] mt-20 flex flex-col p-5 justify-center items-center border-t-2 border-[#4d4c4c]'>
        <span>Created by: Huzaifa</span>
        <span>Copyright &copy; {new Date().getFullYear()}</span>
    </div>
  )
}

export default Footer