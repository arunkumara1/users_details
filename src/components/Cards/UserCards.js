import React, { useState, useEffect } from "react";
import UserCard from "./Card/UserCard";
import "./UserCards.css";
import db from "../../firebase/firebase";

/*
 *UserCards  to load the data cards.
 *It takes db data and iterate it to and loads usercard.
 */
const UserCards = () => {
  const [users, setUsers] = useState([]);

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

  let userCardsComponent = users.map((each) => (
    <UserCard key={each.id} user={each} users={users} />
  ));

  return (
    <div className="usercards">
      <div className="usercards__card">
        {users.length > 0 ? userCardsComponent : null}
      </div>
    </div>
  );
};

export default UserCards;
