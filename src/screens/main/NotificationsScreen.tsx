// src/screens/main/NotificationsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const NOTIFICATIONS = [
  { id: '1', title: 'New Follower', message: 'John Doe started following you.' },
  { id: '2', title: 'New Message', message: 'You have a new message from Jane Doe.' },
];

export const NotificationsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationTitle: {
    fontWeight: 'bold',
  },
});
