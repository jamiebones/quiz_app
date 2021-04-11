import React from "react";
import DisplayScriptComponent from "../common/displayScriptComponent";

const ViewCanidateExaminationScripts = ({ location }) => {
  const scripts = location && location.state && location.state.scripts;

  if (scripts) {
    return <DisplayScriptComponent scripts={scripts} />;
  }
};

export default ViewCanidateExaminationScripts;
