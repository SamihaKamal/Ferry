import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { ListItem, Avatar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';


export default function ListExtention({ route }) {
  const { user, flag, list } = route.params;
  const navigation = useNavigation();
 
  return (
    <ScrollView>
      
    </ScrollView>
  );
}