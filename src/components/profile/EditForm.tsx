import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useForm, Controller, Control } from 'react-hook-form';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

type FormData = {
  username: string;
  email: string;
  bio: string;
  image?: string;
};

type EditFormProps = {
  user: {
    username?: string;
    email?: string;
    bio?: string;
    image?: string;
  };
  onSuccess?: () => void;
};

const EditForm: React.FC<EditFormProps> = ({ user, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      image: user?.image || '',
    },
  });

  const image = watch('image');

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('@Auth:token');
      if (!token) {
        throw new Error('Token d\'authentification non trouvé');
      }

      const decoded = jwtDecode(token) as { id: string };
      const userId = decoded.id;

      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('bio', data.bio);
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await fetch('http://192.168.11.100:3000/auth/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      
      const json = await response.json();
      
      if (response.ok) {
        Alert.alert('Succès', 'Profil mis à jour avec succès');
        onSuccess?.();
      } else {
        throw new Error(json.message || 'Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      Alert.alert(
        'Erreur',
        error instanceof Error 
          ? error.message 
          : 'Impossible de mettre à jour le profil. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control as Control<FormData>}
        rules={{
          required: 'Le nom est requis',
          minLength: {
            value: 2,
            message: 'Le nom doit contenir au moins 2 caractères',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Votre nom"
            />
            {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
          </View>
        )}
        name="username"
      />

      <Controller
        control={control as Control<FormData>}
        rules={{
          required: 'L\'email est requis',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Adresse email invalide',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Votre email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>
        )}
        name="email"
      />

      <Controller
        control={control as Control<FormData>}
        rules={{
          maxLength: {
            value: 500,
            message: 'La bio ne doit pas dépasser 500 caractères',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Parlez-nous de vous"
              multiline
              numberOfLines={4}
            />
            {errors.bio && <Text style={styles.errorText}>{errors.bio.message}</Text>}
          </View>
        )}
        name="bio"
      />

      <Controller
        control={control as Control<FormData>}
        rules={{
          pattern: {
            value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            message: 'URL invalide',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>URL de l'image</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="https://exemple.com/image.jpg"
              autoCapitalize="none"
            />
            {errors.image && <Text style={styles.errorText}>{errors.image.message}</Text>}
            {image && (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: image }}
                  style={styles.imagePreview}
                />
                <Text style={styles.imagePreviewText}>Aperçu de l'image</Text>
              </View>
            )}
          </View>
        )}
        name="image"
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  imagePreviewContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
  },
  imagePreviewText: {
    fontSize: 12,
    color: '#666666',
  },
});

export default EditForm; 