import { Route, Routes } from "react-router-dom";
import NavBar from "./components/UI/NavBar/NavBar.tsx";
import Chat from './pages/Chat.tsx';
import RegisterPage from './components/RegisterPage/RegisterPage.tsx';
import LoginForm from './components/LoginForm/LoginForm.tsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import { selectUser } from './store/slices/userSlice.ts';
import { useAppSelector } from './app/hooks.ts';

const App = () => {
  const user = useAppSelector(selectUser);

  return (
    <>
      <header>
        <NavBar />
      </header>
      <Routes>
        <Route path="/" element={(
          <ProtectedRoute isAllowed={Boolean(user)}>
            <Chat/>
          </ProtectedRoute>
        )}/>

        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="*" element={<h1>Not found</h1>} />
      </Routes>
    </>
  );
};

export default App;
