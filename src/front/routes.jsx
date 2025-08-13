import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Register } from "./pages/Register";
import { Users } from "./pages/Users";
import { UserCreate } from "./pages/UserCreate";
import { UserEdit } from "./pages/UserEdit";
import { Adminsite } from "./pages/Adminsite";
import { AdminCreate } from "./pages/AdminCreate";
import { AdminEdit } from "./pages/AdminEdit";
import { Playgrounds } from "./pages/Playgrounds";
import { PlaygroundCreate } from "./pages/PlaygroundCreate";
import { PlaygroundEdit } from "./pages/PlaygroundEdit";
import { PlaygroundSingle } from "./pages/PlaygroundSingle";
import { UserView } from "./pages/UserView";
import { BetCreate } from "./pages/BetCreate";
import { BetEdit } from "./pages/BetEdit";
import { ChatList } from "./pages/ChatList";
import { ChatCreate } from "./pages/ChatCreate";
import { ChatEdit } from "./pages/ChatEdit";
import { ChatListForPlayground } from "./pages/ChatListForPlayground";
import PlaygroundChat from "./pages/PlaygroundChat";
import { BetOptions } from "./pages/BetOptions";
import { MessageBoard } from "./pages/MessageBoard.jsx";
import { Private } from "./pages/Private";
import PrivateRoutes from "./PrivateRoutes";
import { Login } from "./pages/Login";
import { UserBetsBoard } from "./pages/UserBetsBoard";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminBoard } from "./pages/AdminBoard";
import { PlaygroundInvite } from "./pages/PlaygroundInvite";
import PlaygroundUser from "./pages/PlaygroundUser.jsx";
import { PlaygroundUserCreate } from "./pages/PlaygroundUserCreate.jsx";
import { PlaygroundUserEdit } from "./pages/PlaygroundUserEdit.jsx";
import { MyProfile } from "./pages/MyProfile.jsx";
import { AdminUsers } from "./pages/AdminUsers.jsx";
import { AdminPlaygrounds } from "./pages/AdminPlaygrounds.jsx"
import { AdminBets } from "./pages/AdminBets.jsx";
import { PlaygroundSearch } from "./pages/PlaygroundSearch";
import { Requests } from "./pages/Requests";
import { BetSingle } from "./pages/BetSingle";
import { AdminMessageBoard } from "./pages/AdminMessageBoard.jsx";
import { MyProfileEdit } from "./pages/MyProfileEdit.jsx";
import BetWinners from "./pages/BetWinners.jsx";


export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* ✅ Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/message-board" element={<MessageBoard />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin-board" element={<AdminBoard />} />
      <Route path="/adminusers" element={<AdminUsers />} />
      <Route path="/adminplaygrounds" element={<AdminPlaygrounds />} />
      <Route path="/adminbets" element={<AdminBets />} />



      {/* ✅ Admin visible y accesible */}
      <Route path="/adminsite" element={<Adminsite />} />
      <Route path="/admincreate" element={<AdminCreate />} />
      <Route path="/admin/adminsite/:id" element={<AdminEdit />} />
        <Route path="/admin-message-board" element={<AdminMessageBoard/>} />

      {/* ✅ Rutas privadas de usuario */}
      <Route path="/private" element={
        <PrivateRoutes>
          <Private />
        </PrivateRoutes>
      } />

      <Route path="/profile/edit" element={
        <PrivateRoutes>
          <MyProfileEdit />
        </PrivateRoutes>
      } />

      <Route path="/playground/:id/bet/:betId" element={
        <PrivateRoutes>
          <BetSingle />
        </PrivateRoutes>
      } />

      <Route path="/users" element={
        <PrivateRoutes>
          <Users />
        </PrivateRoutes>
      } />
      <Route path="/create" element={<UserCreate />} />

      <Route path="/edit/:id" element={
        <PrivateRoutes>
          <UserEdit />
        </PrivateRoutes>
      } />
      <Route path="/view/:id" element={
        <PrivateRoutes>
          <UserView />
        </PrivateRoutes>
      } />

      {/* ✅ Todas las rutas de Playground protegidas */}
      <Route path="/playground" element={
        <PrivateRoutes>
          <Playgrounds />
        </PrivateRoutes>
      } />
      <Route path="/playground/create" element={
        <PrivateRoutes>
          <PlaygroundCreate />
        </PrivateRoutes>
      } />
      <Route path="/playground/edit/:id" element={
        <PrivateRoutes>
          <PlaygroundEdit />
        </PrivateRoutes>
      } />
      <Route path="/playground/:id" element={
        <PrivateRoutes>
          <PlaygroundSingle />
        </PrivateRoutes>
      } />
      <Route path="/playground/:id/bet" element={
        <PrivateRoutes>
          <BetCreate />
        </PrivateRoutes>
      } />
      <Route path="/playground/:id/bet/:betId/edit" element={
        <PrivateRoutes>
          <BetEdit />
        </PrivateRoutes>
      } />
      <Route path="/playground/:id/bet/:betId/options" element={
        <PrivateRoutes>
          <BetOptions />
        </PrivateRoutes>
      } />
      <Route path="/playground/:id/chats" element={
        <PrivateRoutes>
          <ChatListForPlayground />
        </PrivateRoutes>
      } />
      <Route path="/playground/:id/chat" element={
        <PrivateRoutes>
          <PlaygroundChat />
        </PrivateRoutes>
      } />


      {/* ✅ Chats protegidos */}
      <Route path="/chats" element={
        <PrivateRoutes>
          <ChatList />
        </PrivateRoutes>
      } />
      <Route path="/chat/create" element={
        <PrivateRoutes>
          <ChatCreate />
        </PrivateRoutes>
      } />
      <Route path="/chat/edit/:id" element={
        <PrivateRoutes>
          <ChatEdit />
        </PrivateRoutes>
      } />

      {/* ✅ User bets protegidas */}
      <Route path="/userbets" element={
        <PrivateRoutes>
          <UserBetsBoard />
        </PrivateRoutes>
      } />
      
      {/* ✅ Ganadores bets protegidos */}
      <Route path="/betwinners" element={
        <PrivateRoutes>
        <BetWinners />
        </PrivateRoutes>
      } />

      {/* ✅ Ruta de invitación abierta */}
      <Route path="/playground/:id/invite" element={<PlaygroundInvite />} />

      <Route path="/my-profile" element={<MyProfile />} />

      <Route path="/playground/search" element={
        <PrivateRoutes>
          <PlaygroundSearch />
        </PrivateRoutes>
      } />

      <Route path="/solicitudes" element={
        <PrivateRoutes>
          <Requests />
        </PrivateRoutes>
      } />

    </Route>

    
  )
);
