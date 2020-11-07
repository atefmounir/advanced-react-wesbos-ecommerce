import React from 'react';
import Reset from "../components/Reset";

function ResetPage(props) {
  const {resetToken}=props.query
  return (
    <div>
      <p>Reset your password {resetToken}</p>
      <Reset resetToken={resetToken}/>
    </div>
  );
}

export default ResetPage;