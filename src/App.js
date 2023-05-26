import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";
import Screen from "./components/Screen";
import Wrapper from "./components/Wrapper";
import ScreenDetails from "./components/ScreenDetails";
import ScreenMain from "./components/ScreenMain";
import { useState } from "react";
import useKeyDownHandler from "./hooks/useKeyDownHandler";
import NP from "number-precision";

const buttonValues = [
    ["C", "%", "⌫", "/"],
    [7, 8, 9, "X"],
    [4, 5, 6, "-"],
    [1, 2, 3, "+"],
    [0, ".", "+-", "="],
];

const maximumCharacter = 19;
// Up to 15 number + 4 spaces int the determined format= 19

const defaultResultValues = {
    displayed: "0",
    operator: null,
    operand: 0,
};

const numberToFormattedStr = (number) => {
    // This function creates the proper format of the given number. But mostly we need this number in
    // string format and only in the case of operations in number form.
    // The parameter is in "FormattedStr" format, so first needs to remove all spaces.
    let numString = number.replaceAll(" ", "");

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

const operationHandler = (num1, num2, sign) => {
    let result;
    if (num2 === 0 && sign === "/") {
        return { error: "Cannot divide by 0" };
    }
    switch (sign) {
        case "+":
            result = NP.plus(num1, num2);
            break;
        case "-":
            result = NP.minus(num1, num2);
            break;
        case "/":
            result = NP.divide(num1, num2);
            break;
        case "X":
            result = NP.times(num1, num2);
            break;
        default:
            break;
    }
    return { result: result, error: null };
};

function App() {
    const [resultValue, setResultValue] = useState(defaultResultValues);
    const [detailsValue, setDetailsValue] = useState("");
    const [editNumberMode, setEditNumberMode] = useState(true);
    const [mainScreenOverwrite, setMainScreenOverwrite] = useState(false);
    const [detailsScreenOverwrite, setDetailsScreenOverwrite] = useState(false);

    const resetHandler = () => {
        setResultValue(defaultResultValues);
        setDetailsValue("");
    };

    const eraseHandler = () => {
        let prevNum = resultValue.displayed;
        if (editNumberMode && prevNum.length > 0) {
            let newValue;
            if (prevNum.length > 1) {
                newValue = prevNum.slice(0, prevNum.length - 1);
            } else {
                newValue = "0";
            }
            setResultValue({
                ...resultValue,
                displayed: numberToFormattedStr(newValue),
            });
        }
    };

    const decimalSignHandler = () => {
        let prevNum = resultValue.displayed;
        if (prevNum.length === maximumCharacter && !mainScreenOverwrite) {
            return;
        }

        let newValue;
        if (!mainScreenOverwrite && prevNum.includes(".")) {
            return;
        }
        if (mainScreenOverwrite) {
            newValue = "0.";
        } else {
            if (!prevNum.includes(".")) {
                newValue = prevNum.concat(".");
            }
        }

        setResultValue({
            ...resultValue,
            displayed: newValue,
        });
        setMainScreenOverwrite(false);
    };

    const signTogglerHandler = () => {
        if (!editNumberMode) {
            return;
        }
        let prevNum = formattedStrToNumber(resultValue.displayed);

        if (resultValue !== 0) {
            setResultValue({
                ...resultValue,
                displayed: numberToFormattedStr((prevNum * -1).toString()),
            });
        }
    };

    const numberHandler = (btn) => {
        let prevNum = resultValue.displayed;
        if (prevNum.length === maximumCharacter && !mainScreenOverwrite) {
            return;
        }
        if (prevNum === "0" && btn === 0) {
            return;
        }
        if (mainScreenOverwrite) {
            prevNum = "0";
        }
        if (prevNum === "0") {
            prevNum = "";
        }

        let newNumber = prevNum.concat(btn);
        setResultValue({
            ...resultValue,
            displayed: numberToFormattedStr(newNumber),
        });

        if (detailsScreenOverwrite) {
            setDetailsValue("");
        }

        setMainScreenOverwrite(false);
        setDetailsScreenOverwrite(false);
        setEditNumberMode(true);
    };

    const percentageHandler = () => {
        let prevNum = formattedStrToNumber(resultValue.displayed);

        if (editNumberMode) {
            setResultValue({
                ...resultValue,
                displayed: numberToFormattedStr((prevNum / 100).toString()),
            });
        }
    };

    const operatorHandler = (btn) => {
        setResultValue({
            ...resultValue,
            operator: btn,
            operand: formattedStrToNumber(resultValue.displayed),
        });
        setDetailsValue(resultValue.displayed + " " + btn);
        setMainScreenOverwrite(true);
        setDetailsScreenOverwrite(false);
        setEditNumberMode(false);
    };

    const equalHandler = () => {
        if (!resultValue.operator) {
            return;
        }
        setDetailsValue(
            (detailsValue) => detailsValue + " " + resultValue.displayed + " ="
        );

        let result = operationHandler(
            resultValue.operand,
            formattedStrToNumber(resultValue.displayed),
            resultValue.operator
        );

        setResultValue({
            ...resultValue,
            displayed: result.error
                ? result.error
                : numberToFormattedStr(result.result.toString()),
            operator: null, // this turns off the consecutive use of the equals sign
        });

        setMainScreenOverwrite(true);
        setDetailsScreenOverwrite(true);
        setEditNumberMode(false);
    };

    const buttonClickHandler = (btn) => {
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
                operatorHandler(btn);
                break;
            case "=":
                equalHandler();
                break;
            case "+-":
                signTogglerHandler();
                break;
            default:
                numberHandler(btn);
                break;
        }
    };

    const keyHandlers = {
        0: numberHandler.bind(null, 0),
        1: numberHandler.bind(null, 1),
        2: numberHandler.bind(null, 2),
        3: numberHandler.bind(null, 3),
        4: numberHandler.bind(null, 4),
        5: numberHandler.bind(null, 5),
        6: numberHandler.bind(null, 6),
        7: numberHandler.bind(null, 7),
        8: numberHandler.bind(null, 8),
        9: numberHandler.bind(null, 9),
        "+": operatorHandler.bind(null, "+"),
        "-": operatorHandler.bind(null, "-"),
        "*": operatorHandler.bind(null, "X"),
        "/": operatorHandler.bind(null, "/"),
        "%": percentageHandler.bind(null),
        ".": decimalSignHandler.bind(null),
        Escape: resetHandler.bind(null),
        Enter: equalHandler.bind(null),
        Backspace: eraseHandler.bind(null),
    };

    useKeyDownHandler(keyHandlers);

    return (
        <>
            <Wrapper>
                <Screen>
                    <ScreenDetails value={detailsValue} />
                    <ScreenMain value={resultValue.displayed} />
                </Screen>
                <ButtonBox>
                    {buttonValues.flat().map((btn, index) => {
                        return (
                            <Button
                                key={index}
                                value={btn}
                                onClick={() => buttonClickHandler(btn)}
                            />
                        );
                    })}
                </ButtonBox>
            </Wrapper>
        </>
    );
}

export default App;
