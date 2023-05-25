import { Textfit } from "react-textfit";
import classes from "./ScreenDetails.module.css";

const ScreenDetails = (props) => {
    return (
        <Textfit className={classes.screendetails} mode="single" max={17}>
            {props.value}
        </Textfit>
    );
};

export default ScreenDetails;
