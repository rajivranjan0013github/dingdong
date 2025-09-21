import React, { useEffect, useState, useCallback } from 'react';
import { Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

const TypeWriter = ({ texts = [], style, className }) => {
  const [textIndex, setTextIndex] = useState(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const nextText = useCallback(() => {
    setTextIndex(prevIndex => (prevIndex + 1) % texts.length);
  }, [texts.length]);

  useEffect(() => {
    if (texts.length === 0) return;

    translateY.value = 20; // Start from bottom
    opacity.value = 0; // Start transparent

    // Animate in
    translateY.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });

    const timer = setTimeout(() => {
      // Animate out
      translateY.value = withTiming(-20, {
        // End by going up
        duration: 400,
        easing: Easing.in(Easing.ease),
      });
      opacity.value = withTiming(
        0,
        {
          duration: 400,
          easing: Easing.in(Easing.ease),
        },
        finished => {
          if (finished) {
            runOnJS(nextText)();
          }
        },
      );
    }, 2000); // Time text is visible

    return () => clearTimeout(timer);
  }, [textIndex, texts.length, nextText]);

  if (!texts || texts.length === 0) {
    return null;
  }

  return (
    <AnimatedText className={className} style={[style, animatedStyle]}>
      {texts[textIndex]}
    </AnimatedText>
  );
};

export default TypeWriter;