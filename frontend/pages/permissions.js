import React from 'react';

import Permissions from "../components/Permissions";
import PleaseSignIn from "../components/PleaseSignIn";



function PermissionsPage(props) {
  return (
    <PleaseSignIn>
      <Permissions />
    </PleaseSignIn>
  );
}

export default PermissionsPage;