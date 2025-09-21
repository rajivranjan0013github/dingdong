import React from 'react';
import { View } from 'react-native';
import MarkdownMathView from 'react-native-markdown-math-view';

const FormattedText = ({ content, baseColor = '#ffffff', fontSize = 14 }) => {
  if (!content) return null;

  // Custom styles for markdown + math
  const markdownStyles = {
    body: {
      color: baseColor,
      fontSize: fontSize,
    },
    text: {
      color: baseColor,
      fontSize: fontSize,
    },
    heading1: {
      color: baseColor,
      fontSize: fontSize + 8,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
    },
    heading2: {
      color: baseColor,
      fontSize: fontSize + 6,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
    },
    heading3: {
      color: baseColor,
      fontSize: fontSize + 4,
      fontWeight: 'bold',
      marginTop: 12,
      marginBottom: 6,
    },
    bullet_list: {
      marginLeft: 0,
    },
    ordered_list: {
      marginLeft: 0,
    },
    paragraph: {
      marginVertical: 4,
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    strong: {
      color: baseColor,
      fontWeight: 'bold',
    },
    blockquote: {
      color: baseColor,
      borderLeftColor: '#374151',
      borderLeftWidth: 4,
      padding: 8,
      marginVertical: 8,
    },
    code_inline: {
      color: '#ffffff',
      backgroundColor: '#1f2937',
      paddingHorizontal: 4,
      borderRadius: 4,
    },
    code_block: {
      color: '#ffffff',
      backgroundColor: '#1f2937',
      padding: 8,
      marginVertical: 8,
      borderRadius: 4,
    },
    fence: {
      color: '#ffffff',
      backgroundColor: '#1f2937',
      padding: 8,
      marginVertical: 8,
      borderRadius: 4,
    },
    link: {
      color: '#3b82f6',
      textDecorationLine: 'underline',
    },
    hr: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      height: 1,
      marginVertical: 8,
    },
  };

  return (
    <View>
      <MarkdownMathView
        markdownStyle={markdownStyles}
        style={{ color: baseColor, fontSize }}
      >
        {content}
      </MarkdownMathView>
    </View>
  );
};

export default FormattedText;