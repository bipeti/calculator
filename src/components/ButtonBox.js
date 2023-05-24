import classes from "./ButtonBox.module.css";

const ButtonBox = (props) => {
    return <div className={classes.buttonbox}>{props.children}</div>;
};

export default ButtonBox;
