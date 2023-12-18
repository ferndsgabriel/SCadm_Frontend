import React, { InputHTMLAttributes, useState } from "react";
import InputMask, { Props as InputMaskProps } from "react-input-mask";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import styles from "./styles.module.scss";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  mask?: string;
}

interface InputProps extends CustomInputProps {
  type?: string;
}

export const Input = ({ type, mask, ...rest }: InputProps) => {
  const [inputType, setInputType] = useState(type);
  const [inputIcon, setInputIcon] = useState(<BsEyeSlashFill />);

  function handleInputType() {
    setInputType("text");
    setInputIcon(<IoEyeSharp />);
    if (inputType === "text") {
      setInputType(type);
      setInputIcon(<BsEyeSlashFill />);
    }
  }

  const inputMaskProps = rest as InputMaskProps;

  return (
    <label className={styles.inputContainer}>
      <InputMask
        {...inputMaskProps}
        type={inputType}
        mask={mask}
        tabIndex={rest.tabIndex || 1}
      />

      {type === "password" ? (
        <button
          onClick={handleInputType}
          type="button"
          className={styles.buttonEyes}
          style={{ userSelect: "none" }}
        >
          {inputIcon}
        </button>
      ) : null}
    </label>
  );
};
