import React from 'react';
import Head from 'next/head'


function Meta(props) {
  return (
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta charSet="utf-8"/>
      <link rel="shortcut icon" href="/static/favicon.png" />
      <link rel="stylesheet" href="/static/nprogress.css" type="text/css" />
      <title>Sick Fits!</title>
    </Head>
  );
}

export default Meta;