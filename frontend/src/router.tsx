import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./LoginPage.tsx";
import DogsList from "./DogsList.tsx";
import DogDetailsPage from "./DogDetailsPage.tsx";

export const router = createBrowserRouter([
  { path: "/login", Component: LoginPage },
  { path: "/", Component: DogsList },
  { path: "/dogs/:dogId", Component: DogDetailsPage }
]);
