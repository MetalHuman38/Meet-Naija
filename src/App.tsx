import {Routes, Route} from 'react-router-dom';
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from '@/_root/pages';
import './globals.css';
import AuthLayOut from '@/_auth/AuthLayOut';
import RootLayOut from '@/_root/RootLayOut';
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
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App
