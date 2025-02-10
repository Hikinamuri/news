import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorPage } from './pages/Error/errorPage';
import { Suspense } from 'react';
import Loader from './components/loader/loader';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home/Home';
import { CalendarPage } from './pages/CalendarPage/CalendarPage';

import RegisterForm from './pages/RegisterPage/Registerpage';
import LoginForm from './pages/AuthPage/AuthPage';
import UserProfile from './pages/UserProfile/UserProfile';

function App() {

  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />}/>
            <Route path='home' element={<Home />}/>
            <Route path='calendar' element={<CalendarPage />}/>
            <Route path='profile' element={<UserProfile />}/>

          </Route>

          <Route path='/register' element={<RegisterForm />}/>
          <Route path='/auth' element={<LoginForm />}/>
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App