// Import necessary components and functions from react-router-dom.

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
import { Playgrounds } from "./pages/Playgrounds";
import { PlaygroundCreate } from "./pages/PlaygroundCreate";
import { PlaygroundEdit } from "./pages/PlaygroundEdit";
import { PlaygroundSingle } from "./pages/PlaygroundSingle";
import { UserView } from "./pages/UserView";
import { BetCreate } from "./pages/BetCreate";
import { BetEdit } from "./pages/BetEdit";

export const router = createBrowserRouter(
    createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

        {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
        <Route path= "/" element={<Home />} />
        <Route path="/single/:theId" element={ <Single />} />  {/* Dynamic route for single items */}
        <Route path="/demo" element={<Demo />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />
        <Route path="/create" element={<UserCreate />} />
        <Route path="/edit/:id" element={<UserEdit />} />
        <Route path="/adminsite" element={<Adminsite />} />
        <Route path="/playground" element={<Playgrounds />} />
        <Route path="/playground/create" element={<PlaygroundCreate />} />
        <Route path="/playground/edit/:id" element={<PlaygroundEdit />} />
        <Route path="/playground/:id" element={<PlaygroundSingle />} />
        <Route path="/view/:id" element={<UserView />} />
        <Route path="/playground/:id/bet" element={<BetCreate />} />
        <Route path="/playground/:id/bet/:betId/edit" element={<BetEdit />} />
      </Route>
    )
);