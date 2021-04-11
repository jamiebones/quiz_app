import React from "react";
import DisplaySpellingScriptComponent from "../common/displaySpellingScriptComponent";

const ViewCanidateExaminationScripts = ({ location }) => {
  const scripts = location && location.state && location.state.scripts;

  if (scripts) {
    return <DisplaySpellingScriptComponent scripts={scripts} />;
  }
};

export default ViewCanidateExaminationScripts;
