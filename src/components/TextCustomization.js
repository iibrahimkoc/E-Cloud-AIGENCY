import {Text, View} from "react-native";
import React from "react";
import MathView from 'react-native-math-view';

export const TextCustomization = ( {text} ) => {
    console.log( "Text Customization: ",text );
    const regex = /(\*\*.*?\*\*|\\\[.*?\\\]|---.*?---|\\\(.*?\\\)|`.*?`)/g;
    const parts = text.split(regex);
    console.log( "Text Customization: ", parts);
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
               <MathView key={index} math={mathContent} style={{color: 'rgb(116,118,166)',}}  />
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
