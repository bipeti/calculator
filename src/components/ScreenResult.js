import classes from "./ScreenResult.module.css";

const ScreenResult = (props) => {
    return (
        <div className={classes.screenresult}>
            <p>{props.value}</p>
        </div>
    );
};

export default ScreenResult;
