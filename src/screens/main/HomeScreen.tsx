import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.7;

const HomeScreen = () => {
  const { user } = useAuth();

  const renderQuickAction = (icon: string, label: string, color: string) => (
    <TouchableOpacity style={[styles.quickAction, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon} size={24} color="white" />
      <Text style={styles.quickActionText}>{label}</Text>
    </TouchableOpacity>
  );

  const renderNewsCard = (title: string, description: string, image: string) => (
    <TouchableOpacity style={styles.newsCard}>
      <Image
        source={{ uri: image }}
        style={styles.newsImage}
      />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{title}</Text>
        <Text style={styles.newsDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>{user?.name || 'Utilisateur'} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="account-group" size={24} color="#6C63FF" />
            <Text style={styles.statNumber}>1,234</Text>
            <Text style={styles.statLabel}>Connexions</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="message-text" size={24} color="#FF6B6B" />
            <Text style={styles.statNumber}>56</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="star" size={24} color="#FFD93D" />
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>Favoris</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.quickActionsContainer}
          contentContainerStyle={styles.quickActionsContent}
        >
          {renderQuickAction('account-plus', 'Inviter', '#6C63FF')}
          {renderQuickAction('message-plus', 'Message', '#FF6B6B')}
          {renderQuickAction('calendar-plus', 'Événement', '#4ECDC4')}
          {renderQuickAction('share', 'Partager', '#FFD93D')}
        </ScrollView>

        <Text style={styles.sectionTitle}>Actualités</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.newsContainer}
          contentContainerStyle={styles.newsContent}
        >
          {renderNewsCard(
            "Nouvelle fonctionnalité disponible !",
            "Découvrez notre nouvelle interface de messagerie avec des fonctionnalités améliorées.",
            "https://picsum.photos/300/200"
          )}
          {renderNewsCard(
            "Événement à venir",
            "Rejoignez-nous pour notre prochain meetup virtuel ce weekend.",
            "https://picsum.photos/300/201"
          )}
          {renderNewsCard(
            "Conseils et astuces",
            "Apprenez à optimiser votre profil pour plus de visibilité.",
            "https://picsum.photos/300/202"
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  header: {
    backgroundColor: '#6C63FF',
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -50,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    width: width / 3.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3142',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3142',
    marginBottom: 15,
    marginTop: 20,
  },
  quickActionsContainer: {
    marginLeft: -20,
  },
  quickActionsContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    gap: 10,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  newsContainer: {
    marginLeft: -20,
  },
  newsContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
  newsCard: {
    width: cardWidth,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newsImage: {
    width: '100%',
    height: 150,
  },
 
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3142',
    marginBottom: 5,
  },
  newsDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default HomeScreen; 