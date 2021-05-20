import React from 'react';

type EditingErrorProps = {
  message: string;
};

const EditingError = (props: EditingErrorProps): JSX.Element => {
  return (
    <div className="editing-error alert alert-danger" role="alert">
      {props.message}
    </div>
  );
};

export default EditingError;
