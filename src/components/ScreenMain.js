import { Textfit } from "react-textfit";
import classes from "./ScreenMain.module.css";

const ScreenMain = (props) => {
    return (
        // <div className={classes.screenresult}>
        <Textfit className={classes.screenresult} mode="single" max={50}>
            {props.value}
        </Textfit>
        // </div>
    );
};

export default ScreenMain;
