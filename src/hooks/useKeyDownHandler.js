import { useEffect } from "react";

const useKeyDownHandler = (keyHandlers) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (keyHandlers[event.key]) {
                // Just if it is a defined key, we call the belonged function
                event.preventDefault();
                keyHandlers[event.key]();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [keyHandlers]);
};

export default useKeyDownHandler;
