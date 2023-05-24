import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";
import Screen from "./components/Screen";
import Wrapper from "./components/Wrapper";
import ScreenDetails from "./components/ScreenDetails";
import ScreenResult from "./components/ScreenResult";
import { useState } from "react";

const buttonValues = [
    ["C", "%", "⌫", "/"],
    [7, 8, 9, "X"],
    [4, 5, 6, "-"],
    [1, 2, 3, "+"],
    [0, ".", "+-", "="],
];

const defaultResultValues = {
    counted: 0, /// it won't be needed. if so, should be erase
    displayed: "0",
    decimal: false,
};

const numberToFormattedStr = (number) => {
    let numString = number.toString();
    let parts = numString.split(".");
    let integerPart = parts[0];
    let decimalPart = parts[1];

    let formattedIntegerPart = "";
    let count = 0;

    for (let i = integerPart.length - 1; i >= 0; i--) {
        count++;
        formattedIntegerPart = integerPart[i] + formattedIntegerPart;

        if (count % 3 === 0 && i !== 0) {
            formattedIntegerPart = " " + formattedIntegerPart;
        }
    }

    let formattedNumber = formattedIntegerPart;

    if (decimalPart !== undefined) {
        formattedNumber += "." + decimalPart;
    }

    return formattedNumber;
};

const formattedStrToNumber = (str) => {
    let formattedStr = str.replace(/\s/g, "");

    return parseFloat(formattedStr);
};

function App() {
    const [resultValue, setResultValue] = useState(defaultResultValues);
    const [detailsValue, setDetailsValue] = useState("");
    const [editNumberMode, setEditNumberMode] = useState(true);

    const resetHandler = () => {
        setResultValue(defaultResultValues);
    };

    const eraseHandler = () => {
        let prevNum = formattedStrToNumber(resultValue.displayed);
        let decimalSign;
        if (editNumberMode && resultValue.displayed.length > 0) {
            decimalSign = resultValue.decimal ? "." : "";
            // The formattedStrNumber() function is cut the "." sign from the end, so we need to put back to work properly.
            let prevResultString = prevNum.toString().concat(decimalSign);

            let newValue;
            if (prevResultString.length > 1) {
                newValue = parseFloat(
                    prevResultString.slice(0, prevResultString.length - 1)
                );
            } else {
                newValue = 0;
            }

            if (prevResultString.charAt(prevResultString.length - 2) === ".") {
                decimalSign = ".";
            } else {
                decimalSign = "";
            }

            setResultValue({
                ...resultValue,
                counted: newValue,
                displayed: numberToFormattedStr(newValue) + decimalSign,
                decimal: decimalSign === "." ? true : false,
            });
        }
    };

    const decimalSignHandler = () => {
        if (!numberToFormattedStr(resultValue.displayed).includes(".")) {
            setResultValue({
                ...resultValue,
                decimal: true,
                displayed: resultValue.displayed.concat("."),
            });
        }
    };

    const signTogglerHandler = () => {
        let prevNum = formattedStrToNumber(resultValue.displayed);

        if (resultValue !== 0) {
            setResultValue({
                ...resultValue,
                displayed: numberToFormattedStr(prevNum * -1),
            });
        }
    };

    const numberHandler = (btn) => {
        let prevNum = formattedStrToNumber(resultValue.displayed);
        let decimalSign;

        decimalSign = resultValue.decimal ? "." : "";
        let newNumber = parseFloat(
            prevNum.toString().concat(decimalSign + btn)
        );
        setResultValue({
            ...resultValue,
            counted: newNumber,
            displayed: numberToFormattedStr(newNumber),
            decimal: false,
        });

        setEditNumberMode(true);
    };

    const percentageHandler = () => {
        let prevNum = formattedStrToNumber(resultValue.displayed);

        if (editNumberMode) {
            setResultValue({
                ...resultValue,
                displayed: numberToFormattedStr(prevNum / 100),
            });
        }
    };

    const operationHandler = (btn) => {
        // let prevNum = formattedStrToNumber(resultValue.displayed);

        setDetailsValue(resultValue.displayed + " " + btn);

        setEditNumberMode(false);
    };

    const buttonClickHandler = (event, btn) => {
        switch (btn) {
            case "C":
                resetHandler();
                break;
            case "%":
                percentageHandler();
                break;
            case "⌫":
                eraseHandler();
                break;
            case ".":
                decimalSignHandler();
                break;
            case "/":
            case "X":
            case "-":
            case "+":
                operationHandler(btn);
                break;
            case "=":
                break;

            case "+-":
                signTogglerHandler();
                break;

            default:
                numberHandler(btn);
                break;
        }
    };

    return (
        <>
            <Wrapper>
                <Screen>
                    <ScreenDetails value={detailsValue} />
                    <ScreenResult value={resultValue.displayed} />
                </Screen>
                <ButtonBox>
                    {buttonValues.flat().map((btn, index) => {
                        return (
                            <Button
                                key={index}
                                value={btn}
                                onClick={(event) =>
                                    buttonClickHandler(event, btn)
                                }
                            />
                        );
                    })}
                </ButtonBox>
            </Wrapper>
        </>
    );
}

export default App;
