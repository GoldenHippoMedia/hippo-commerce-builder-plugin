import React from "react";
import { AppTabState } from "@application/AppCore";

interface Props {
  state: AppTabState;
}

function AdminHomePage(props: Props) {
  const { state } = props;

  return (
    <div className="bg-base-100 min-h-screen rounded-lg max-w-7xl mx-auto">
      <div>Coming soon...</div>
    </div>
  );
}

export default AdminHomePage;
