import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Header from './Components/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import Quiz, { Quizzy } from './Components/Quiz';
import userQuizContext from './Context/userQuizContext'
import { Container } from 'reactstrap';
const Index = () => {
  const [user, setUser] = useState(null)
  return (
    <Container fluid className='p-0 h-100 align-middle'>

      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          dark
        />
        <userQuizContext.Provider value={{ user, setUser }}>

          <Header />
          <Routes>
            <Route path='/' element={<App />} />
            <Route path='/quiz' element={<Quizzy />} />
          </Routes>
        </userQuizContext.Provider>
      </BrowserRouter>
    </Container>
  )
}


ReactDOM.render(
  <Index />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

