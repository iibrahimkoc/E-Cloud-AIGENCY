import { useEffect, useState } from "react";
import { View } from "react-native";
import SyntaxHighlighter from "react-native-syntax-highlighter";


export const TypewriterEffectSyntax = ({ text, language, theme, onComplete, windowWidth }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + text[index]);
            index++;
            if (index === text.length) {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, 10);

        return () => clearInterval(interval);
    }, [text]);

    return (
        <View style={{ flex: 1 }}>
            <SyntaxHighlighter
                wrapLines={true}
                wrapLongLines={true}
                language={String(language).toLowerCase()}
                style={theme}
                customStyle={{minWidth: 0, width: (windowWidth * 0.9)-24}}
                highlighter="hljs"
            >
                {displayedText}
            </SyntaxHighlighter>
        </View>
    );
};
