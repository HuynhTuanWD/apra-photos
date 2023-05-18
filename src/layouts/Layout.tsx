import React, { Component } from 'react';

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  return (
    <div className="apra-layout">
      <header>{/* header here if needed */}</header>
      {props.children}
      <footer>{/* footer here if needed */}</footer>
    </div>
  );
};

export default Layout;
