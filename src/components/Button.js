import classes from "./Button.module.css";

const Button = (props) => {
    return (
        <button
            className={props.value === "=" ? classes.equalsign : classes}
            type="button"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
};

export default Button;
