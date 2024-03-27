import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import VideoCall from "../CarouselTwo/VideoCall";
import Activities from "../CarouselTwo/Activities";
import Lights from "../CarouselTwo/Lights";
import Entertainment from "../CarouselTwo/Entertainment";
import Gallery from "../CarouselTwo/Gallery";
import GLCommunity from "../CarouselTwo/GLCommunity";
import { FIRESTORE_DB } from "@/FirebaseConfig";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

interface Item {
  title: string;
  icon: string;
  component?: JSX.Element;
  prompt: string;
}

const data: Item[] = [
  {
    title: "ACTIVITIES",
    icon: "weight-lifter",
    component: <Activities />,
    prompt: "Join an Activity?",
  },
  {
    title: "VIDEO CALL",
    icon: "phone",
    component: <VideoCall />,
    prompt: "Make a Video Call?",
  },
  {
    title: "GARDEN LOFT",
    icon: "home-group-plus",
    component: <GLCommunity />,
    prompt: "Meet Garden Loft Members?",
  },
  {
    title: "ENTERTAINMENT",
    icon: "movie-open-star",
    component: <Entertainment />,
    prompt: "Watch Entertainment?",
  },
  {
    title: "GALLERY",
    icon: "camera-burst",
    component: <Gallery />,
    prompt: "View Gallery?",
  },
  {
    title: "LIGHTS",
    icon: "lightbulb",
    component: <Lights />,
    prompt: "Change Lights?",
  },
];

const Home: React.FC = () => {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollViewRef = useRef<Carousel<Item>>(null);

  const handleSnapToItem = (index: number) => {
    setActiveIndex(index);
  };




  const renderItem = ({ item, index }: { item: Item; index: number }) => (
    <TouchableOpacity onPress={() => handleCardPress(item, index)}>
      <View
        style={[
          styles.item,
          {
            backgroundColor: index === activeIndex + 3 ? "#f3b718" : "#909090",
          },
        ]}
      >
        <MaterialCommunityIcons
          style={[
            styles.icon,
            {
              color: index === activeIndex + 3 ? "black" : "#f3b718",
            },
          ]}
          name={item.icon}
          size={82}
          color="#f3b718"
        />

        <Text
          style={[
            styles.title,
            {
              color: index === activeIndex + 3 ? "black" : "#f3b718",
            },
          ]}
        >
          {item.title}
        </Text>
      </View>
      {/* <Text>{item.page}</Text> */}
    </TouchableOpacity>
  );

  const handleCardPress = (item: Item, index: number) => {
    if (item.component) {
      // Render component if available
      
      // setShowVideoCall(false);
    } else {
      // setShowVideoCall(item.title === "VIDEO CALL");
    }
    scrollViewRef.current?.snapToItem(index);
  };

  return (
    <View style={styles.container}>
      <Carousel style={styles.carousel1}
        layout={"default"}
        data={data}
        renderItem={renderItem}
        sliderWidth={Math.round(viewportWidth * 0.85)}
        itemWidth={Math.round(viewportWidth * 0.17)}
        loop={true}
        useScrollView={true}
        activeSlideAlignment="center"
        ref={scrollViewRef}
        inactiveSlideScale={0.8} // Scale of inactive slides
        inactiveSlideOpacity={1}
        onSnapToItem={(index) => handleSnapToItem(index)} // Handle snapping logic
      />
      {/* Prompt */}
      <Text style={styles.prompt}>{data[activeIndex].prompt && data[activeIndex].prompt}</Text>
      
      {/* Bottom component */}
      <Text style={styles.carousel2}>{data[activeIndex].component && data[activeIndex].component}</Text>
      
      {/* Arrow Keys */}
      <TouchableOpacity
        style={styles.arrowLeft}
        onPress={() => scrollViewRef.current?.snapToPrev()}
      >
        <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.arrowRight}
        onPress={() => scrollViewRef.current?.snapToNext()}
      >
        <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "column",
    gap: 5,
  },carousel1: {
    
  },carousel2: {
    marginBottom: -40,
  },
prompt: {
    fontSize: 30,
    marginBottom: 15,
  },
  item: {
    width: viewportWidth * 0.17,
    height: viewportHeight * 0.25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
    flexDirection: "column",
    gap: 30,
    paddingHorizontal: 10,

    shadowColor: "#000000",
    shadowOffset: {
      width: 8,
      height: 7,
    },
    shadowOpacity:  0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  title: {
    fontSize: 19,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#f3b718",
  },
  arrowLeft: {
    position: "absolute",
    top: "12%",
    left: 0,
    transform: [{ translateY: -10 }],
  },
  arrowRight: {
    position: "absolute",
    top: "12%",
    right: -10,
    transform: [{ translateY: -10 }],
  },
  cardPage: {
    flexDirection: "column",
    gap: 80,
  },
  icon: {},
});

export default Home;


