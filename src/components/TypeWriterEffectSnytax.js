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


/*
                                <TypeWriter
                                    key={item.id}
                                    typing={1}
                                    onTypingEnd={() => {
                                        setTypeWriterActive(false)
                                        setTalkScreenData( {
                                            ...dataRef.current,
                                            messages: dataRef.current.messages.map((msg) =>
                                                msg.id === item.id ? { ...msg, isTyping: false } : msg
                                            ),
                                        });
                                    }}
                                    speed={1000}
                                    minDelay={10}
                                    maxDelay={10}
                                    style={{width:'100%'}}
                                    wrapLines={true}
                                    wrapLongLines={true}
                                >
                                    {
                                        parts.map((part, partIndex) => {
                                            const isCode = partIndex % 2 === 1;

                                            if (isCode) {
                                                const kelimeler = part.split('\n');
                                                const codeLanguage = kelimeler.shift();
                                                const newCode = kelimeler.join("\n");

                                                const uniqueIndex = `${flatListIndex}-${partIndex}`;
                                                console.log("i : ",newCode);
                                                return (
                                                    <View style={{width: "100%", backgroundColor: isDarkTheme ? '#282c34':  '#fff'}}>
                                                        <Text style={{color: isDarkTheme ? 'rgb(117,121,131)' : 'black'}} key={uniqueIndex}>{newCode}</Text>
                                                    </View>
                                                );
                                            } else {
                                                return (
                                                    <Text style={[isDarkTheme ? styles.talkBoxContainerBoxAiChatMessageDarkTheme : styles.talkBoxContainerBoxAiChatMessageLightTheme]}>
                                                        {TextCustomization(part)}
                                                    </Text>
                                                );
                                            }
                                        })
                                    }
                                </TypeWriter>
*/
