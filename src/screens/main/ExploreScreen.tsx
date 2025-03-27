import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type User = {
  id: number;
  username: string;
  email: string;
  image: string;
  created_at: string;
};

const ExploreScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://192.168.11.100:3000/users/list');
      const data = await response.json();

      if (response.ok) {
        console.log('Received data:', data);
        
        if (data && data.success && Array.isArray(data.data)) {
          const usersList = data.data;
          console.log('UsersList:', usersList);
          
          if (usersList.some((user: any) => user && typeof user === 'object' && 'id' in user)) {
            console.log('Setting users with:', usersList);
            setUsers(usersList);
          } else {
            console.log('UsersList validation failed');
            setUsers([]);
          }
        } else {
          setError(`Format de données invalide. Données reçues: ${JSON.stringify(data)}`);
        }
      } else {
        setError(data.message || 'Échec de la récupération des utilisateurs');
      }
    } catch (err) {
      setError('Erreur réseau. Veuillez réessayer.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => setSelectedUser(item)}
    >
      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
        <Image
            style={styles.avatar}
            source={{ uri: item?.image || 'https://via.placeholder.com/150' }}
          />
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.username}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userDate}>Membre depuis {formatDate(item.created_at)}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#666666" />
    </TouchableOpacity>
  );

  // eslint-disable-next-line react/no-unstable-nested-components
  const UserModal = () => (
    <Modal
      visible={selectedUser !== null}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedUser(null)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedUser(null)}
          >
            <MaterialCommunityIcons name="close" size={24} color="#666666" />
          </TouchableOpacity>

          {selectedUser && (
            <View style={styles.modalUserInfo}>
              <View style={styles.modalAvatarContainer}>
                <MaterialCommunityIcons name="account-circle" size={80} color="#007AFF" />
              </View>
              <Text style={styles.modalUserName}>{selectedUser.username}</Text>
              <Text style={styles.modalUserEmail}>{selectedUser.email}</Text>
              <Text style={styles.modalUserDate}>
                Membre depuis {formatDate(selectedUser.created_at)}
              </Text>
              <View style={styles.modalStats}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="calendar-check" size={24} color="#007AFF" />
                  <Text style={styles.statText}>ID: {selectedUser.id}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explorer les utilisateurs</Text>
      </View>

      {!users || users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="account-group" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>Aucun utilisateur trouvé</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchUsers}
        />
      )}

      <UserModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4a90e2',
  },
  userDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  modalUserInfo: {
    alignItems: 'center',
    width: '100%',
    paddingTop: 20,
  },
  modalAvatarContainer: {
    marginBottom: 16,
  },
  modalUserName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  modalUserEmail: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  modalUserDate: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 16,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  statText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
});

export default ExploreScreen;
