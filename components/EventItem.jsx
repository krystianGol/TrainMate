import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

const EventItem = ({ title, time, onDelete }) => {
  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
      <MaterialIcons name="delete" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.container}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121111',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginTop: 4,
  },
  time: {
    fontSize: 14,
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    borderRadius: 12,
    marginVertical: 8,
    marginRight: 16,
  },
});

export default EventItem;
