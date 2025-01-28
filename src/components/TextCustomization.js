import {Text} from "react-native";
import React from "react";
import MathView from 'react-native-math-view';

export const TextCustomization = ( {text} ) => {
    console.log( text );
    const regex = /(\*\*.*?\*\*|\\\[.*?\\\]|---.*?---|\\\(.*?\\\)|`.*?`)/g;
    const parts = text.split(regex);
    console.log(parts);
    return parts.map((part, index) => {
        if (/\*\*.*?\*\*/.test(part)) {
            const boldText = part.replace(/\*\*/g, '');
            return (
                <Text key={index} style={{ fontWeight: 'bold' }}>
                    {boldText}
                </Text>
            );
        }
        else if(/`.*?`/.test(part)) {
            const boldText = part.replace(/`/g, '');
            return (
                <Text key={index} style={{ fontWeight: 'bold' }}>
                    {boldText}
                </Text>
            );
        }
        else if (/\\\[.*?\\\]|\\\(.*?\\\)/.test(part)) {
            const mathContent = part.replace(/\\[\[\]()]/g, '');
            return (
                <MathView key={index} math={mathContent} />
            );
        }
        else if (/---.*/.test(part)) {
            const boldText = part.replace(/---/g, '');
            return (
                <Text key={index} style={{ fontStyle: 'italic' }}>
                    {boldText}
                </Text>
            );
        }
        else {
            return (
                <Text key={index}>
                    {part.replaceAll(/###/g, '')}
                </Text>
            );
        }
    });
}
