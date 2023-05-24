import classes from "./ScreenDetails.module.css";

const ScreenDetails = (props) => {
    return (
        <div className={classes.screendetails}>
            <p>{props.value}</p>
        </div>
    );
};

export default ScreenDetails;
