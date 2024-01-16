import { Outlet } from "@remix-run/react";
import React from "react";

const About = () => {
  return (
    <div className="prose">
      <Outlet />
    </div>
  );
};

export default About;
