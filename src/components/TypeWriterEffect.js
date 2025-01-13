import { useEffect, useState } from "react";
import { Text } from "react-native";

export const TypewriterEffect = ({ text, onComplete = () => {} }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + text[index]);
            index++;
            if (index === text.length) {
                clearInterval(interval);
                onComplete();
            }
        }, 10);

        return () => clearInterval(interval);
    }, [text]);

    return <Text>{displayedText}</Text>; // Text bileşeni içinde döndür
};


