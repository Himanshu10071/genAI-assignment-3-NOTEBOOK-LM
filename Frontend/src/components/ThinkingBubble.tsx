import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay,
  useSharedValue,
  interpolate,
  FadeIn,
  FadeOut
} from "react-native-reanimated";
import { THEME } from "../constants/theme";

const Dot = ({ delay }: { delay: number }) => {
  const anim = useSharedValue(0);

  useEffect(() => {
    anim.value = withRepeat(
      withDelay(delay, withTiming(1, { duration: 500 })),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => {
    return {
      opacity: interpolate(anim.value, [0, 1], [0.4, 1]),
      transform: [{ translateY: interpolate(anim.value, [0, 1], [0, -4]) }],
    };
  });

  return <Animated.View style={[styles.dot, style]} />;
};

const statuses = [
  "Consulting your document...",
  "Synthesizing key insights...",
  "Verifying citations...",
  "Formatting research..."
];

export const ThinkingBubble = () => {
  const [statusIdx, setStatusIdx] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % statuses.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.dotContainer}>
          <Dot delay={0} />
          <Dot delay={150} />
          <Dot delay={300} />
        </View>
        <Animated.View 
          entering={FadeIn.duration(400)} 
          exiting={FadeOut.duration(400)}
          key={statusIdx}
          style={styles.statusBox}
        >
          <Text style={styles.statusText}>{statuses[statusIdx]}</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    marginBottom: THEME.spacing.xl,
    width: "100%",
  },
  bubble: {
    backgroundColor: THEME.colors.surfaceSecondary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    maxWidth: 320,
  },
  dotContainer: {
    flexDirection: "row",
    gap: 4,
    width: 32,
    justifyContent: "center",
  },
  statusBox: {
    flex: 1,
  },
  statusText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontWeight: "600",
    fontStyle: "italic",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.accent,
  },
});
