import React from "react";
import EditQuestion from "./saveNewQuestion";

const EditQuestionComponent = ({ location, history }) => {
  const question = location && location.state && location.state.question;

  return (
    <EditQuestion editMode={true} questionToEdit={question} history={history} />
  );
};

export default EditQuestionComponent;
