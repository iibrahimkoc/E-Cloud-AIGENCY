import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import SyntaxHighlighter from "react-native-syntax-highlighter";
import {TextCustomization} from "./TextCustomization";

const SyntaxToHtml = (codeContent, theme) => {
    const parts = codeContent
        .split(/(<\/?p[^>]*>|<\/?h1[^>]*>|<\/?header[^>]*>|<\/?head[^>]*>|<\/?body[^>]*>|<\/?html[^>]*>|<\/?!DOCTYPE'[^>]*>|<\/?br[^>]*>|<\/?form[^>]*>|<\/?label[^>]*>|<\/?textarea[^>]*>|<\/?input[^>]*>|<\/?title[^>]*>|<\/?meta[^>]*>|<\/?nav[^>]*>|<\/?ul[^>]*>|<\/?li[^>]*>|<\/?h2[^>]*>|<\/?h3[^>]*>|<\/?h4[^>]*>|<\/?h5[^>]*>|<\/?h6[^>]*>|<\/?footer[^>]*>| <style[^>]*style> |<\/?section[^>]*>|<\/?a[^>]*>|<\/?span[^>]*>|<\/?div[^>]*>|<\/?main[^>]*>)/g)
        .filter(Boolean);

    return parts.map((part, index) => {
        if (part.startsWith("<!DOCTYPE")) {
            return (
                <Text key={index} style={{color: theme ? '#61AEEE' : '#4078F2',fontFamily: 'Courier New ', fontSize: 13}}>
                    {part}
                </Text>
            );
        }
        else if (/^\s*<style[^>]*>/.test(part) || /<\/style>\s*$/.test(part)) {
            const stylePart = part.replace(/^\s*<style[^>]*>/, '').replace(/<\/style>\s*$/, '');
            const cssParts = stylePart.split(/(\{|\})/).filter(Boolean).map(part => part.trim());
            return (
                <Text key={index}>
                    <Text style={{color: theme ? '#61AEEE' : '#4078F2',fontFamily: 'Courier New ', fontSize: 13}}>{`\n    <style>`}</Text>
                        <Text>
                            {
                                cssParts.map((part, index) => {
                                    if(index % 4 === 0) {
                                        return (
                                            <Text style={{color: theme ? '#E06C75' : '#E45649',fontFamily: 'Courier New ', fontSize: 13}}>{`\n           ${part}`}</Text>
                                        )
                                    }
                                    if(index % 4 === 1) {
                                        return (
                                            <Text style={{color: theme ? '#ABB2BF' : '#383A42',fontFamily: 'Courier New ', fontSize: 13}}>{`  ${part}\n`}</Text>
                                        )
                                    }
                                    if(index % 4 === 2) {
                                        const cssParca = part.split(/(;)/).filter(Boolean).map(part => part.trim());
                                        return cssParca.map((partlar, index) => {
                                            if(index % 2 === 0) {
                                                const colon = partlar.split(/(:)/).filter(Boolean).map(partlar => partlar.trim());
                                                return colon.map((part, index) => {
                                                    if(index % 3 === 0) {
                                                        return (
                                                            <Text style={{color: theme ? '#98C379' : '#50A14F',fontFamily: 'Courier New ', fontSize: 13}}>                    {part}</Text>
                                                        )
                                                    }
                                                    else if(index % 3 === 1) {
                                                        return (
                                                            <Text style={{color: theme ? '#ABB2BF' : '#383A42',fontFamily: 'Courier New ', fontSize: 13}}> {part}</Text>
                                                        )
                                                    }
                                                    else{
                                                        return (
                                                            <Text style={{color: theme ? '#D19A66' : '#986801',fontFamily: 'Courier New ', fontSize: 13}}> {part}</Text>
                                                        )
                                                    }
                                                });

                                            }
                                            else {
                                                return (
                                                    <Text style={{color: theme ? '#ABB2BF' : '#383A42',fontFamily: 'Courier New ', fontSize: 13}}>{cssParca.length-1 === index ? `${partlar}` : `${partlar}\n`}</Text>
                                                )
                                            }
                                        })

                                    }
                                    if(index % 4 === 3) {
                                        return (
                                            <Text style={{color: theme ? '#ABB2BF' : '#383A42',fontFamily: 'Courier New ', fontSize: 13}}>{`\n           ${part}`}</Text>
                                        )
                                    }
                                })
                            }
                        </Text>
                    <Text style={{color: theme ? '#61AEEE' : '#4078F2',fontFamily: 'Courier New ', fontSize: 13}}>{`<style>\n`}</Text>
                </Text>
            )
        }
        else  if (
            part.startsWith("<p") ||part.endsWith("/p>") ||
            part.startsWith("<h1") || part.endsWith("/h1>") ||
            part.startsWith("<h2") || part.endsWith("/h2>") ||
            part.startsWith("<h3") || part.endsWith("/h3>") ||
            part.startsWith("<h4") || part.endsWith("/h4>") ||
            part.startsWith("<h5") || part.endsWith("/h5>") ||
            part.startsWith("<h6") || part.endsWith("/h6>") ||
            part.startsWith("<span") || part.endsWith("/span>") ||
            part.startsWith("<main") || part.endsWith("/main>") ||
            part.startsWith("<head") || part.endsWith("/head>") ||
            part.startsWith("<div") || part.endsWith("/div>") ||
            part.startsWith("<header") || part.endsWith("/header>") ||
            part.startsWith("<a") || part.endsWith("/a>") ||
            part.startsWith("<body") || part.endsWith("/body>") ||
            part.startsWith("<html") || part.endsWith("/html>") ||
            part.startsWith("<footer") || part.endsWith("/footer>") ||
            part.startsWith("<section") || part.endsWith("/section>") ||
            part.startsWith("<br") || part.endsWith("/br>") ||
            part.startsWith("<nav") || part.endsWith("/nav>") ||
            part.startsWith("<ul") || part.endsWith("/ul>") ||
            part.startsWith("<li") || part.endsWith("/li>") ||
            part.startsWith("<label") || part.endsWith("/label>") ||
            part.startsWith("<textarea") || part.endsWith("/textarea>") ||
            part.startsWith("<title") || part.endsWith("/title>") ||
            part.startsWith("<input") || part.startsWith("<meta") ||
            part.startsWith("<form") || part.endsWith("/form>"))
        {
            const result = part.split(/(<|>)/).filter(Boolean);
            return result.map((part, index) => {
                if (part === '<' || part === '>') {
                    return (
                        <Text key={index} style={{color: theme ? '#ABB2BF' : '#383A42',fontFamily: 'Courier New ', fontSize: 13}}>
                            {part}
                        </Text>
                    );
                }
                else{
                    const parts = part.split(' ').map((part) => part.trim()).filter(Boolean);
                    return parts.map((part, index) => {
                        if(index === 0){
                            if(part.length % 2 === 0){
                                return(
                                    <Text key={index} style={{color: theme ? '#E06C75' : '#E45649',fontFamily: 'Courier New ', fontSize: 13}}>{part}</Text>
                                )
                            }
                            else{
                                return(
                                    <Text key={index} style={{color: theme ? '#E06C75' : '#E45649',fontFamily: 'Courier New ', fontSize: 13}}>{part} </Text>
                                )
                            }
                        }
                        else {
                            if (part.includes('=')) {
                                const partsEquils = part.split('="');
                                return (
                                    <Text key={index}>
                                        <Text style={{color: theme ? '#D19A66' : '#986801',fontFamily: 'Courier New ', fontSize: 13}}> {partsEquils[0]}</Text>
                                        <Text style={{color: theme ? '#98C379' : '#50A14F',fontFamily: 'Courier New ', fontSize: 13}}>={partsEquils[1]}</Text>
                                    </Text>
                                )
                            }
                            else{
                                return(
                                    <Text key={index} style={{color: theme ? '#D19A66' : '#986801',fontFamily: 'Courier New ', fontSize: 13}}> {part}</Text>
                                )
                            }
                        }
                    });
                }
            })
        }
        else {
            return (
                <Text key={index} style={{color: theme ? '#ABB2BF' : '#383A42', fontFamily: 'Courier New ', fontSize: 13}}>
                    {part}
                </Text>
            );
        }
    });
};

export const TypewriterEffectSyntax = ({ parts, theme, style, onComplete, windowWidth }) => {
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState([]);

    useEffect(() => {
        if (currentPartIndex < parts.length) {
            const currentPart = parts[currentPartIndex];
            let charIndex = 0;
            let currentContent = "";

            const interval = setInterval(() => {
                if (charIndex < currentPart.length) {
                    currentContent += currentPart[charIndex];
                    setDisplayedText((prev) => {
                        const updated = [...prev];
                        updated[currentPartIndex] = currentContent;
                        return updated;
                    });
                    charIndex++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        setCurrentPartIndex((prev) => prev + 1);
                    }, 500);
                }
            }, 10);

            return () => clearInterval(interval);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentPartIndex]);

    return (
        <View style={{ flex: 1 }}>
            {displayedText.map((text, index) => {
                const isCode = index % 2 === 1;
                if (isCode) {
                    const lines = text.split("\n");
                    const language = lines[0].trim();
                    const codeContent = lines.slice(1).join("\n");

                    if (language.toLowerCase() === "html") {
                        return (
                            <View key={index} style={{ width: (windowWidth * 0.9) - 24, backgroundColor: theme ?  '#282C34' :  '#fff'}}>
                                <Text
                                    style={{ padding: 2, width: (windowWidth * 0.9) - 24 }}
                                >
                                    {SyntaxToHtml(codeContent,theme)}
                                </Text>
                            </View>
                        );
                    }

                    return (
                        <SyntaxHighlighter
                            key={index}
                            language={language || "plaintext"}
                            style={style}
                            customStyle={{ minWidth: 0, width: (windowWidth * 0.9) - 24 }}
                        >
                            {codeContent}
                        </SyntaxHighlighter>
                    );
                }
                return (
                    <Text
                        key={index}
                        style={[
                            theme
                                ? styles.talkBoxContainerBoxAiChatMessageDarkTheme
                                : styles.talkBoxContainerBoxAiChatMessageLightTheme,
                        ]}
                    >
                        <TextCustomization text={text}/>
                    </Text>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    talkBoxContainerBoxAiChatMessageDarkTheme: {
        color: "white",
    },
    talkBoxContainerBoxAiChatMessageLightTheme: {
        color: "black",
    },
})
