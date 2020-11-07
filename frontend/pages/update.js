import React from 'react';
import UpdateItem from "../components/UpdateItem";

function Update(props) {
  const {id}=props.query

  return (
    <div>
      <UpdateItem id={id}/>
    </div>
  );
}

export default Update;