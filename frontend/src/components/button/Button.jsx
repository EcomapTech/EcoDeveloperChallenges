import React from "react";
import styles from "./button.module.css";

function Button({ content, type, onClick }) {
  const buttonStyle = `${styles.buttonStyle} ${
    type === "update" ? styles.add : styles.delete
  }`;

  const icon =
    type === "update" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
      >
        <g clip-path="url(#clip0_376_117)">
          <path
            d="M19.6666 3.33331V8.33332M19.6666 8.33332H14.6666M19.6666 8.33332L15.7999 4.69998C14.9043 3.80391 13.7963 3.14932 12.5792 2.79729C11.3622 2.44527 10.0758 2.40727 8.84016 2.68686C7.60447 2.96645 6.45975 3.55451 5.51281 4.39616C4.56586 5.23782 3.84756 6.30564 3.42492 7.49998M1.33325 16.6666V11.6666M1.33325 11.6666H6.33325M1.33325 11.6666L5.19992 15.3C6.09554 16.1961 7.20356 16.8506 8.42059 17.2027C9.63762 17.5547 10.924 17.5927 12.1597 17.3131C13.3954 17.0335 14.5401 16.4455 15.487 15.6038C16.434 14.7621 17.1523 13.6943 17.5749 12.5"
            stroke="white"
            stroke-width="1.67"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_376_117">
            <rect
              width="20"
              height="20"
              fill="white"
              transform="translate(0.5)"
            />
          </clipPath>
        </defs>
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M2.5 5.00002H4.16667M4.16667 5.00002H17.5M4.16667 5.00002V16.6667C4.16667 17.1087 4.34226 17.5326 4.65482 17.8452C4.96738 18.1578 5.39131 18.3334 5.83333 18.3334H14.1667C14.6087 18.3334 15.0326 18.1578 15.3452 17.8452C15.6577 17.5326 15.8333 17.1087 15.8333 16.6667V5.00002H4.16667ZM6.66667 5.00002V3.33335C6.66667 2.89133 6.84226 2.4674 7.15482 2.15484C7.46738 1.84228 7.89131 1.66669 8.33333 1.66669H11.6667C12.1087 1.66669 12.5326 1.84228 12.8452 2.15484C13.1577 2.4674 13.3333 2.89133 13.3333 3.33335V5.00002M8.33333 9.16669V14.1667M11.6667 9.16669V14.1667"
          stroke="#B42318"
          stroke-width="1.67"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );

  return (
    <button className={buttonStyle} onClick={onClick}>
      {icon}
      {content}
    </button>
  );
}

export default Button;
