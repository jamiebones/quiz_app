import React from "react";
import DisplayEssayScriptComponent from "../common/displayEssayScript";

const ViewCanidateExaminationScripts = ({ location }) => {
  const scripts = location && location.state && location.state.scripts;

  if (scripts) {
    return <DisplayEssayScriptComponent scripts={scripts} />;
  }
};

export default ViewCanidateExaminationScripts;
