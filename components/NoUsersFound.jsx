import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NoUsersFound = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="person-circle-outline" size={80} color="#ccc" />
      <Text style={styles.title}>Brak wyników</Text>
      <Text style={styles.subtitle}>Nie zanleziono użytkowników</Text>
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
    fontSize: 20,
    fontWeight: '600',
    marginTop: 15,
    color: '#444',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default NoUsersFound;
