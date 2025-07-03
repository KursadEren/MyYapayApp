import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
} from 'react-native';
import Card       from '../components/Card';
import ButtonIcon from '../components/CircleButton';
import { Colors ,Layout} from '../theme';

export default function About() {
  return (
    <View style={styles.root}>
      <Card>
        <Text style={styles.heading}>Hisse Görsel Tahmin App</Text>
        <Text style={styles.sub}>Versiyon 1.0 • 2025</Text>
      </Card>
      <Card style={styles.linkCard}>
        <ButtonIcon
          name="github"
          iconStyle="brands"
          onPress={() => Linking.openURL('https://github.com/yourrepo')}
        />
        <Text
          style={styles.linkText}
          onPress={() => Linking.openURL('https://github.com/yourrepo')}
        >
          Kaynak Kodu
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:           1,
    backgroundColor: Colors.background,
    padding:        Layout.padding,
  },
  heading: {
    fontSize:     18,
    fontWeight: '600',
    color:       Colors.text,
  },
  sub: {
    marginTop:   4,
    color:       Colors.textLight,
  },
  linkCard: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: 14,
  },
  linkText: {
    marginLeft: 12,
    color:      Colors.primary,
    textDecorationLine: 'underline',
  },
});
