import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorPage } from './pages/Error/errorPage';
import { Suspense, useEffect, useState } from 'react';
import Loader from './components/loader/loader';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home/Home';
import { CalendarPage } from './pages/CalendarPage/CalendarPage';

import RegisterForm from './pages/RegisterPage/Registerpage';
import LoginForm from './pages/AuthPage/AuthPage';
import NewsPage from './pages/newsPage/newsPage';
import Profile from './pages/profile/Profile';

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(()=> {
    const isAuth = localStorage.getItem('user_id')
    setIsAuth(!!isAuth)
  }, [isAuth]);
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route index element={<LoginForm />}/>
            if (isAuth) {
              <Route path="/" element={<Layout />}>
                <Route path='home' element={<Home />}/>
                <Route path='calendar' element={<CalendarPage />}/>
                <Route path='home/:id' element={<NewsPage />} />
                <Route path='profile' element={<Profile />} />
              </Route>
            } else {
              <Route path='*' element={<LoginForm />} />
            }
          <Route path='/register' element={<RegisterForm />}/>
          <Route path='/auth' element={<LoginForm />}/>
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App