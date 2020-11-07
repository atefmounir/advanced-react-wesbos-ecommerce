import React from 'react';

import Items from "../components/Items";


function Index(props) {
  const {page}=props.query;

  return (
    <div>
      <Items page={parseFloat(page) || 1}/>
    </div>
  );
}

export default Index;


/*
  Notes
  page number will be cascaded to Items component via props.query. and from Items to Pagination component
  parseFloat to convert the string value of the page to float
  since pagination has to have this url --> items?page=2, if we are in items page "main page", the page value must be 1
*/