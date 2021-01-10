import React, { useState, useEffect } from "react";
import "./UserInputComponent.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import db from "../../firebase/firebase";

toast.configure();

/*
 *UserInputComponent  enables adding new data in the db.
 *It takes user input , validates it and then adds  the data.
 */
const UserInputComponent = () => {
  const [users, setUsers] = useState([]);
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    mailId: "",
  });
  const [valid, setValid] = useState({
    firstName: false,
    lastName: false,
    mailId: false,
    existingmail: false,
  });

  /*
   *useEffect hooks - execute code that needs happens during lifecycle of the component
   *lets React that your component needs to do db fetching after render
   *loads db  data after fetches
   */
  useEffect(() => {
    db.collection("users")
      .doc("joKRYPW9KZBv7SJVor1F")
      .onSnapshot((snapshot) => setUsers(snapshot.data().data));
  }, []);

  /*
   *handleChange function to handle change events of input components.
   *takes event as argument.
   *tracks the state value of input components.
   */
  const handleChange = (event) => {
    const { id, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  /*
   *onSaveHandler function to perform Add operation.
   *performs Input validations check before adding the data.
   *adds the new data in the db.
   */
  const onSaveHandler = () => {
    let firstNameFlag =
      state["firstName"].length > 0 && state["firstName"].length < 46;
    let lastNameFlag =
      state["lastName"].length > 0 && state["lastName"].length < 46;
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let mailIdFlag = regex.test(state["mailId"]);
    setValid((prevState) => ({
      ...prevState,
      firstName: !firstNameFlag,
      lastName: !lastNameFlag,
      mailId: !mailIdFlag,
    }));

    if (firstNameFlag && lastNameFlag && mailIdFlag) {
      if (users.length >= 20) {
        toast("Cannot Perform Add Operation as data exceeds the limit 20", {
          type: "info",
        });
      } else {
        const existingMailIndex = users.findIndex(
          (each) => each.mailid === state["mailId"]
        );
        if (existingMailIndex === -1) {
          let idToBEInserted = Math.max.apply(
            Math,
            users.map(function (each) {
              return each.id;
            })
          );
          if (users.length === 0) {
            idToBEInserted = 0;
          }
          let insertDB = [...users];
          const toDB = {
            id: idToBEInserted + 1,
            firstname: state["firstName"],
            lastname: state["lastName"],
            mailid: state["mailId"],
          };
          insertDB.push(toDB);

          db.collection("users").doc("joKRYPW9KZBv7SJVor1F").update({
            data: insertDB,
          });

          setState((prevState) => ({
            ...prevState,
            firstName: "",
            lastName: "",
            mailId: "",
          }));
          setValid((prevState) => ({
            ...prevState,
            firstName: false,
            lastName: false,
            mailId: false,
            existingmail: false,
          }));
          toast("Data has been inserted successfully", {
            type: "success",
          });
        } else {
          setValid((prevState) => ({
            ...prevState,
            existingmail: true,
          }));
        }
      }
    }
  };

  return (
    <div className="userinput">
      <TextField
        id="firstName"
        label="First Name"
        variant="outlined"
        value={state["firstName"]}
        error={valid["firstName"]}
        onChange={(event) => handleChange(event)}
        helperText={
          valid["firstName"] ? "First Name should have length 1 - 45" : ""
        }
      />
      <TextField
        id="lastName"
        label="Last Name"
        variant="outlined"
        value={state["lastName"]}
        onChange={(event) => handleChange(event)}
        error={valid["lastName"]}
        helperText={
          valid["lastName"] ? "Last Name should have length 1 - 45" : ""
        }
      />
      <TextField
        id="mailId"
        label="Email Address"
        variant="outlined"
        type="email"
        value={state["mailId"]}
        error={valid["mailId"] || valid["existingmail"]}
        onChange={(event) => handleChange(event)}
        helperText={
          valid["mailId"]
            ? "Email ID is in Incorrect  Format !"
            : valid["existingmail"]
            ? "Already Email Exists!!"
            : null
        }
      />
      <Button
        variant="contained"
        color="primary"
        size="medium"
        onClick={() => onSaveHandler()}
      >
        Save
      </Button>

      <div></div>
    </div>
  );
};

export default UserInputComponent;
