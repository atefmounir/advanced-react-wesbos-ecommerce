import React from 'react';
import styled from 'styled-components';

import Signup from "../components/Signup";
import SignIn from "../components/SignIn";
import RequestReset from "../components/RequestReset";


function SignupPage(props) {
  return (
    <Columns>
      <Signup/>
      <SignIn/>
      <RequestReset/>
    </Columns>
  );
}

const Columns =styled.div`
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(300px,1fr));
  grid-gap: 20px;
`

export default SignupPage;