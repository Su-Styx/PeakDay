import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Home from './pages/Home';
import Timetable from './pages/Timetable';
import Signup from './pages/Signup';
import Login from './pages/Login';

import Event from './pages/Events';
import Eventcreator from './pages/Eventcreator';
import ChooseMeal from './pages/ChooseMeal';
import MealNotification from './pages/MealNotification';
import MentalHealth from './pages/MentalHealth';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "timetable",
    element: <Timetable />,
},
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {

    path: "event",
    element: <Event />,
  },
  {
    path: "eventcreator",
    element: <Eventcreator />,
  },
    {
    path: "choosemeal",
    element: <ChooseMeal />
  },
  {
    path: "notification_view",
    element: < MealNotification />
  },
  {
    path: "mental_health",
    element: < MentalHealth />,
  }

      
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
