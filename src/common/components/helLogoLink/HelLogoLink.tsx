import React from 'react';
import { NavLink } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <NavLink to="/" className="logoLink">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 266.66 123.69"
        className="logoLink__logo"
      >
        <defs />
        <title>HelsinkiUusiLogo</title>
        <path
          d="M288.78,37.5v71.17a24.85,24.85,0,0,1-25,24.64H187.72a36.52,36.52,0,0,0-24.58,9.41,36.52,36.52,0,0,0-24.58-9.41H62.3a24.75,24.75,0,0,1-24.8-24.64V37.5Zm-121.6,112A28.91,28.91,0,0,1,187.72,141h76.07a32.54,32.54,0,0,0,32.68-32.33V29.81H29.81v78.86A32.44,32.44,0,0,0,62.3,141h76.27a28.9,28.9,0,0,1,20.53,8.47l4,4Z"
          transform="translate(-29.81 -29.81)"
        />
        <path
          d="M259.52,69.9a4.29,4.29,0,1,1-4.29-4.13,4.11,4.11,0,0,1,4.29,4.13m-8,33.63h7.43V77.17h-7.43Zm-13.28-15.9,9.68,15.9h-8.05L233.37,93l-3.5,4.44v6.12H222.5V65.67h7.37V83.14c0,3.24-.37,6.49-.37,6.49h.16s1.73-2.88,3.19-4.92l5.65-7.53h8.63Zm-23.22-1c0-6.54-3.19-10.09-8.26-10.09a8.56,8.56,0,0,0-7.9,5h-.16l.37-4.34h-7.37v26.36h7.37V87.89c0-3,1.78-5.13,4.55-5.13s4,1.83,4,5.33v15.43H215ZM184.63,69.9a4.29,4.29,0,1,1-4.29-4.13,4.11,4.11,0,0,1,4.29,4.13m-8,33.63h7.43V77.17h-7.43Zm-12.76-7.32c0-2.09-2.93-2.56-6.33-3.5-4-1-8.94-3-8.94-8.05s4.76-8.11,10.41-8.11c5.23,0,10,2.51,12.08,6l-6.33,3.56a5.51,5.51,0,0,0-5.49-4.18c-1.88,0-3.45.84-3.45,2.35,0,2,3.45,2.2,7.37,3.45,4.13,1.31,7.9,3.19,7.9,8,0,5.28-4.92,8.42-10.62,8.42-6.17,0-11-2.62-13.18-6.8l6.43-3.61a6.65,6.65,0,0,0,6.64,5c2,0,3.5-.89,3.5-2.56M140,65.93H132.6V96.26q0,4.08,1.75,5.94t5.57,1.86a13,13,0,0,0,2.67-.29,6.86,6.86,0,0,0,2.2-.81l.63-5a11.7,11.7,0,0,1-1.54.44,8,8,0,0,1-1.54.13,1.85,1.85,0,0,1-1.75-.73,4.55,4.55,0,0,1-.55-2.61Zm-24.69,16c-2.72,0-4.92,1.94-5.49,5.54h10.41c0-3.19-2-5.54-4.92-5.54m11.4,10.46h-17c.31,4.29,2.72,6.38,5.81,6.38a5,5,0,0,0,5.07-4.34l6.22,3.5a12.63,12.63,0,0,1-11.3,6.28c-7.37,0-12.76-5.13-12.76-13.81s5.49-13.81,12.6-13.81,11.77,5,11.77,12.19a16.42,16.42,0,0,1-.37,3.61M89.58,103.53h7.69V67.34H89.58V81.67H75.15V67.34H67.46v36.19h7.69v-15H89.58Z"
          transform="translate(-29.81 -29.81)"
        />
      </svg>
    </NavLink>
  );
};

export default Logo;
