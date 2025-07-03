import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors,Layout } from '../theme';

export default function ScreenContainer({ children, scrollable }) {
  const Container = scrollable ? ScrollView : SafeAreaView;
  return (
    <LinearGradient
      colors={[Colors.primary, Colors.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <Container contentContainerStyle={styles.content}>
        {children}
      </Container>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  content:  { flexGrow: 1, padding: 20 }
});
