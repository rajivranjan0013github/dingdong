import React, { useEffect, useState, useCallback } from 'react';
import { Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

const TypeWriter = ({ texts = [], style, onComplete, className }) => {
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const cursorOpacity = useSharedValue(1);

  const cursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }));

  // Start cursor blinking
  useEffect(() => {
    cursorOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, []);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const animateText = useCallback(async () => {
    const text = texts[textIndex];

    if (isTyping) {
      if (charIndex < text.length) {
        setCurrentText(text.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        await sleep(50); // Typing speed
      } else {
        await sleep(1500); // Pause at the end
        setIsTyping(false);
        setCharIndex(text.length);
      }
    } else {
      if (charIndex > 0) {
        setCurrentText(text.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        await sleep(30); // Deletion speed
      } else {
        await sleep(500); // Pause before next text
        setIsTyping(true);
        const nextIndex = (textIndex + 1) % texts.length;
        setTextIndex(nextIndex);
        if (nextIndex === 0 && onComplete) {
          onComplete();
        }
      }
    }
  }, [textIndex, charIndex, isTyping, texts, onComplete]);

  useEffect(() => {
    const timeoutId = setTimeout(animateText, 10);
    return () => clearTimeout(timeoutId);
  }, [animateText]);

  return (
    <Text className={className} style={style}>
      {currentText}
      <AnimatedText style={[{ marginLeft: 2 }, cursorStyle]}>|</AnimatedText>
    </Text>
  );
};

export default TypeWriter;