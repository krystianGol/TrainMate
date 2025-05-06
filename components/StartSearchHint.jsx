import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const StartSearchHint = () => {
  return (
    <View style={styles.container}>
      <Feather name="search" size={70} color="#bbb" />
      <Text style={styles.title}>Zacznij wyszukiwać</Text>
      <Text style={styles.subtitle}>
        Wpisz imie lub miato użytkownika aby rozpocząć
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#444',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default StartSearchHint;
