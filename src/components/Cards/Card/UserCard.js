import React, { useState } from "react";
import "./UserCard.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import InputLabel from "@material-ui/core/InputLabel";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import db from "../../../firebase/firebase";

toast.configure();
/*
 *UserCard  to display data cards.
 *It takes props from UserCards and displays it.
 */
const UserCard = ({ user: { id, mailid, firstname, lastname }, users }) => {
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
  const [ids, setIds] = useState("");

  const [isModified, setisModified] = useState(false);

  const [isUpdate, setisUpdate] = useState(false);

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
    setisModified(true);
  };

  /*
   *handleSwapComboChange function to handle change events of combo .
   *takes event,id  as argument.
   *tracks the state value of input components.
   */
  const handleSwapComboChange = (event, id) => {
    setIds(event.target.value);
    setisModified(true);
  };

  /*
   *onSaveHandler function to perform Update /swap operation.
   *performs Input validations check before updating the data.
   *Updates the specific data in the db.
   */
  const onSaveHandler = () => {
    if (isModified) {
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
        if (ids !== "") {
          let infoData = [...users];
          let updateDbCheck = [...users];
          const indexToBeIgnored = updateDbCheck.findIndex(
            (each) => each.id === id
          );
          updateDbCheck.splice(indexToBeIgnored, 1);
          const existingMail = updateDbCheck.findIndex(
            (each) => each.mailid === state["mailId"]
          );
          if (existingMail === -1) {
            const frommIndex = infoData.findIndex((each) => each.id === id);
            const toIndex = infoData.findIndex(
              (each) => each.id === parseInt(ids)
            );

            infoData[frommIndex].id = id;
            infoData[frommIndex].firstname = state["firstName"];
            infoData[frommIndex].lastname = state["lastName"];
            infoData[frommIndex].mailid = state["mailId"];

            [infoData[frommIndex], infoData[toIndex]] = [
              infoData[toIndex],
              infoData[frommIndex],
            ];

            infoData[frommIndex].id = id;
            infoData[toIndex].id = ids;

            db.collection("users").doc("joKRYPW9KZBv7SJVor1F").update({
              data: infoData,
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
            toast("Data has been swapped successfully", {
              type: "success",
            });
            setisUpdate(false);
            setIds("");
          } else {
            setValid((prevState) => ({
              ...prevState,
              existingmail: true,
            }));
          }
        } else {
          let updateDb = [...users];
          let updateDbCheck = [...users];
          const indexToBeIgnored = updateDbCheck.findIndex(
            (each) => each.id === id
          );
          updateDbCheck.splice(indexToBeIgnored, 1);
          const existingMail = updateDbCheck.findIndex(
            (each) => each.mailid === state["mailId"]
          );
          if (existingMail === -1) {
            const indexToBeUpdated = updateDb.findIndex(
              (each) => each.id === id
            );

            updateDb[indexToBeUpdated].id = id;
            updateDb[indexToBeUpdated].firstname = state["firstName"];
            updateDb[indexToBeUpdated].lastname = state["lastName"];
            updateDb[indexToBeUpdated].mailid = state["mailId"];

            db.collection("users").doc("joKRYPW9KZBv7SJVor1F").update({
              data: updateDb,
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
            toast("Data has been updated successfully", {
              type: "success",
            });
            setisUpdate(false);
            setIds("");
          } else {
            setValid((prevState) => ({
              ...prevState,
              existingmail: true,
            }));
          }
        }
      }
    } else {
      toast("No Changes to Update", {
        type: "info",
      });
    }
  };

  /*
   *deleteDataHandler function to perform delete operation.
   *deletes  the specific id data in the db.
   */
  const deleteDataHandler = () => {
    let deleteDB = [...users];
    const indexToBeDeleted = deleteDB.findIndex((each) => each.id === id);
    deleteDB.splice(indexToBeDeleted, 1);
    db.collection("users").doc("joKRYPW9KZBv7SJVor1F").update({
      data: deleteDB,
    });
    toast(
      "Data corresponding to ID  :" + id + " has been deleted successfully",
      {
        type: "success",
      }
    );
  };

  const updateDataHandler = () => {
    setisUpdate(true);
    setState((prevState) => ({
      ...prevState,
      firstName: firstname,
      lastName: lastname,
      mailId: mailid,
    }));
  };

  return (
    <div className="usercard">
      <div className="usercard__top">
        <div className="typo">
          <Typography variant="h5" component="h4">
            {"#" + id}
          </Typography>
        </div>
        {isUpdate ? (
          <React.Fragment>
            <div>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={ids}
                onChange={(event) => handleSwapComboChange(event)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {users
                  .filter((each) => each.id !== id)
                  .map((each) => (
                    <MenuItem key={each.id} value={each.id}>
                      {each.id}
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText>{"Select ID to swap"}</FormHelperText>
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => onSaveHandler()}
              >
                Save
              </Button>
              <IconButton onClick={() => setisUpdate(false)}>
                <CloseIcon />
              </IconButton>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div>
              <IconButton onClick={() => updateDataHandler()}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteDataHandler()}>
                <DeleteIcon />
              </IconButton>
            </div>
          </React.Fragment>
        )}
      </div>
      <div className="usercard__middle">
        {isUpdate ? (
          <React.Fragment>
            <TextField
              id="firstName"
              key={"firstName" + id}
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
              error={valid["lastName"]}
              onChange={(event) => handleChange(event)}
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
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div>
              <Typography noWrap variant="h5" component="h5">
                First Name : {firstname}
              </Typography>
              <br></br>
              <Typography noWrap variant="h5" component="h5">
                Last Name : {lastname}
              </Typography>
              <br></br>
              <Typography noWrap variant="h5" component="h5">
                Email Address : {mailid}
              </Typography>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default UserCard;
