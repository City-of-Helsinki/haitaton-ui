import { useFormik } from 'formik';
import React from 'react';

const ContactDetails: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div>
      <h1>Step2</h1>
      <form>
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
export default ContactDetails;
