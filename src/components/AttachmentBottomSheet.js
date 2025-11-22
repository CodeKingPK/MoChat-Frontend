import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AttachmentBottomSheet = ({ visible, onClose, onOptionPress }) => {
  const attachmentOptions = [
    {
      id: 'camera',
      icon: 'camera',
      label: 'Camera',
      color: '#FF6B6B',
    },
    {
      id: 'gallery',
      icon: 'images',
      label: 'Gallery',
      color: '#A855F7',
    },
    {
      id: 'document',
      icon: 'document',
      label: 'Document',
      color: '#3B82F6',
    },
    {
      id: 'audio',
      icon: 'mic',
      label: 'Audio',
      color: '#F59E0B',
    },
    {
      id: 'location',
      icon: 'location',
      label: 'Location',
      color: '#10B981',
    },
    {
      id: 'contact',
      icon: 'person',
      label: 'Contact',
      color: '#06B6D4',
    },
  ];

  const handleOptionPress = (optionId) => {
    onOptionPress(optionId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.bottomSheet}>
              <View style={styles.handle} />
              <Text style={styles.title}>Share Content</Text>
              
              <View style={styles.optionsGrid}>
                {attachmentOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.optionButton}
                    onPress={() => handleOptionPress(option.id)}
                  >
                    <View style={[styles.iconCircle, { backgroundColor: option.color }]}>
                      <Ionicons name={option.icon} size={28} color="#fff" />
                    </View>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  optionButton: {
    width: width / 3.5,
    alignItems: 'center',
    marginVertical: 12,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default AttachmentBottomSheet;
