import Sidebar from "@/components/sidebar";
import React from "react";

const Dashboard = ({ children }) => {
  return (
    <div className="w-full">
      {/* navbar */}
      <div className="flex w-full">
        <div className="w-full md:w-[400px] relative">
          <Sidebar />
        </div>
        <div className="w-full md:w-full">{children}</div>
        {/* <div className="w-full md:w-[500px]">right section</div> */}
      </div>
    </div>
  );
};

export default Dashboard;
