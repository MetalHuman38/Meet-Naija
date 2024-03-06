import {Routes, Route} from 'react-router-dom';
import { Home } from './_root/pages';
import './globals.css';
import AuthLayOut from './_auth/AuthLayOut';
import RootLayOut from './_root/RootLayOut';
import SignInForm from '@/_auth/forms/SignInForm';
import SignUpForm from '@/_auth/forms/SignUpForm';
import { Toaster } from "@/components/ui/toaster";



const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayOut />}>
          <Route path='/Sign-In' element={<SignInForm />} />
          <Route path='/Sign-Up' element={<SignUpForm />} />
        </Route>


        {/* Private Routes */}
        <Route element={<RootLayOut />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App
