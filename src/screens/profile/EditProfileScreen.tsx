import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import EditForm from '../../components/profile/EditForm';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../types/navigation';

type EditProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'EditProfile'>;

const EditProfileScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<EditProfileScreenNavigationProp>();

  const handleSuccess = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <EditForm 
        user={user || {}} 
        onSuccess={handleSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default EditProfileScreen; 