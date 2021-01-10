import React from "react";
import "./App.css";
import UserCards from "./components/Cards/UserCards";
import UserInputComponent from "./components/UserInputComponent/UserInputComponent";

/*
 *App.js
 *includes UserInputComponent and UserCards Component
 *
 */
const App = () => {
  return (
    <div className="app">
      <div className="app__userinput">
        <UserInputComponent />
      </div>
      <div className="app__usercards">
        <UserCards />
      </div>
    </div>
  );
};

export default App;
