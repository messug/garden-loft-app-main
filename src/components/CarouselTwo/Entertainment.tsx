import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FIRESTORE_DB } from "@/FirebaseConfig";
import { doc, getDoc } from 'firebase/firestore';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');



const Entertainment = () => {
  const [contacts, setContacts] = useState([
    { id: 'goldenGirls', name: 'Golden Girls', prompt: 'Watch Golden Girls?' },
    { id: 'jeopardy', name: 'Jeopardy', prompt: 'Watch Jeopardy?' },
    { id: 'Wheel Of Fortune', name: 'Jeopardy', prompt: 'Watch Wheel Of Fortune?' },
    { id: 'Jamie Oliver', name: 'Jeopardy', prompt: 'Watch Jamie Oliver Cooking?' },
    // Add more shows with their unique Firestore document IDs
  ]);

  const [youtubeId, setYoutubeId] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchAndPlayVideo = async (docId) => {
    const docRef = doc(FIRESTORE_DB, "entertainment", docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setYoutubeId(docSnap.data().youtubeId); // Assuming the document contains a field `youtubeId`
      setIsModalVisible(true); // Open the modal to play video
    } else {
      console.log("No such document!");
    }
  };

  const handleSnapToItem = (index: number) => {
        setActiveIndex(index);
      };

      const scrollViewRef = useRef<ScrollView>(null);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.id}
     
      style={[styles.cardContainer,{
                backgroundColor: index === activeIndex + 3 ? "#f3b718" : "#f09030",
              },]}
      onPress={() => fetchAndPlayVideo(item.id)}
    >
      <MaterialCommunityIcons name="television-play" size={94} color="white" />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <Carousel
        layout={'default'}
        data={contacts}
        renderItem={renderItem}
        sliderWidth={viewportWidth * 0.9}
        itemWidth={viewportWidth * 0.3}
        onSnapToItem={(index) => setActiveIndex(index)}
      /> */}
      <Carousel
        layout={'default'}
        data={contacts}
        renderItem={renderItem}
        sliderWidth={Math.round(viewportWidth * 0.90)}
        itemWidth={Math.round(viewportWidth * 0.3)}
        loop={true}
        useScrollView={true}
        activeSlideAlignment="center"
        ref={scrollViewRef}
        inactiveSlideScale={0.8}
        inactiveSlideOpacity={1}
        onSnapToItem={(index) => handleSnapToItem(index)} // Handle snapping logic
      />
      <Text style={styles.prompt}>{contacts[activeIndex]?.prompt}</Text>

      <TouchableOpacity style={styles.arrowLeft} onPress={() => scrollViewRef.current?.snapToPrev()}>
        <FontAwesome name="angle-left" size={124} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.arrowRight} onPress={() => scrollViewRef.current?.snapToNext()}>
        <FontAwesome name="angle-right" size={124} color="rgb(45, 62, 95)" />
      </TouchableOpacity>

      {/* Modal for YouTube Player */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(!isModalVisible)}
          >
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          {youtubeId && (
            <YoutubePlayer
              height={viewportHeight * 0.8}
              width={viewportWidth * 0.8}
              videoId={youtubeId}
              play={true}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    height: 290,
  
  },
  cardContainer: {
    width: viewportWidth * 0.3,
    height: viewportHeight * 0.3,
    backgroundColor: '#f09030',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cardText: {
    fontSize: 36,
    color: '#393939',
    fontWeight: '700',
   
  },
  prompt: {
    fontSize: 30,
    color: '#393939',
    fontWeight: '700',
    marginTop: 15,
  },
  arrowLeft: {
        position: 'absolute',
        top: '40%',
        left: -17,
        transform: [{ translateY: -50 }],
      },
      arrowRight: {
        position: 'absolute',
        top: '40%',
        right: -25,
        transform: [{ translateY: -50 }],
      },
  modalView: {
    margin: 20,
    marginTop: 30,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 3,
    paddingTop: 90,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
});

export default Entertainment;

