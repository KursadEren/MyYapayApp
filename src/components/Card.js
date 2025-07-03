import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Layout } from '../theme';

export default function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius:    Layout.radius,
    padding:         Layout.padding,
    marginVertical:  Layout.margin,
    ...Layout.shadow,
  },
});
