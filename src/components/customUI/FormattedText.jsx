import React from 'react';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';

const FormattedText = ({ content, baseColor = '#ffffff', fontSize = 14 }) => {
  if (!content) return null;

  // Custom styles for markdown
  const markdownStyles = {
    body: {
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
    bullet_list_icon: {
      color: baseColor,
      marginRight: 4,
      marginLeft: 0,
    },
    ordered_list: {
      marginLeft: 0,
    },
    ordered_list_icon: {
      color: baseColor,
      marginRight: 4,
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
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderLeftColor: baseColor,
      borderLeftWidth: 4,
      padding: 8,
      marginVertical: 8,
    },
    code_inline: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      color: baseColor,
      paddingHorizontal: 4,
      borderRadius: 4,
    },
    code_block: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: 8,
      marginVertical: 8,
      borderRadius: 4,
    },
    fence: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: 8,
      marginVertical: 8,
      borderRadius: 4,
    },
    link: {
      color: '#3b82f6', // blue-500
      textDecorationLine: 'underline',
    },
    hr: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      height: 1,
      marginVertical: 8,
    },
  };

  // Process LaTeX in the content
  const processContent = (text) => {
    // Replace $$ ... $$ with ```math ... ```
    text = text.replace(/\$\$(.*?)\$\$/g, '```math\n$1\n```');
    // Replace $ ... $ with `$ ... $`
    text = text.replace(/\$(.*?)\$/g, '`$1`');
    return text;
  };

  return (
    <View>
      <Markdown
        style={markdownStyles}
        mergeStyle={true}
      >
        {processContent(content)}
      </Markdown>
    </View>
  );
};

export default FormattedText;