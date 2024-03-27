import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Button,
  Linking,
} from "react-native";
import axios from "axios";
import Carousel, { CarouselStatic } from "react-native-snap-carousel";
import moment from "moment-timezone";
import { FontAwesome } from "@expo/vector-icons";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

interface EventItem {
  item: string;
  startDate: Date;
  endDate?: Date;
}

const Activities: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://api.signupgenius.com/v2/k/signups/report/filled/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09"
        );
        if (!response.data.success) {
          throw new Error("Failed to retrieve signed-up activities.");
        }
        const currentTime = new Date();
        const eventData = response.data.data.signup.map((item: any) => ({
          item: item.item,
          startDate: moment
            .tz(item.startdatestring.replace(/-/g, "T"), "YYYY/MM/DD HH:mm", "")
            .toDate(),
          endDate: item.enddatestring
            ? moment
                .tz(
                  item.enddatestring.replace(/-/g, "T"),
                  "YYYY/MM/DD HH:mm:ss",
                  ""
                )
                .toDate()
            : undefined,
          // Fetches Zoom link from Sign Up Genius
          zoomLink:
            item.location === "Zoom Meeting"
              ? "https://us06web.zoom.us/j/87666824017?pwd=RUZLSFVabjhtWjJVSm1CcDZsZXcrUT09"
              : null,
        }))
        .filter((event: EventItem) => event.startDate > currentTime); //Filter out past events
        // Sort events array by startDate in chronological order
        eventData.sort((a, b) => a.startDate - b.startDate);
        setEvents(eventData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching signed-up activities:", error.message);
        setError(
          "Failed to retrieve signed-up activities. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  // Use to Scroll Carousel
  const scrollViewRef = useRef<CarouselStatic<EventItem> | null>(null);

  const scrollToNext = () => {
    if (scrollViewRef.current) {
      const currentIndex = scrollViewRef.current.currentIndex || 0;
      const nextIndex = currentIndex + 1;
      scrollViewRef.current.snapToItem(nextIndex, true, true);
    }
  };

  const scrollToPrevious = () => {
    if (scrollViewRef.current) {
      const currentIndex = scrollViewRef.current.currentIndex || 0;
      const prevIndex = currentIndex - 1;
      scrollViewRef.current.snapToItem(prevIndex, true, true);
    }
  };

  const navigateToZoomLink = (event: EventItem) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Renders modal to Activities start times
  const renderModalContent = (event: EventItem) => {
    const currentTime = new Date();
    const tenMinutesBeforeStartTime = new Date(event.startDate);
    tenMinutesBeforeStartTime.setMinutes(
      tenMinutesBeforeStartTime.getMinutes() - 10
    );

    if (event.endDate && currentTime > event.endDate) {
      return <Text>Event ended.</Text>;
    } else if (currentTime < tenMinutesBeforeStartTime) {
      return <Text>Event has not started yet.</Text>;
    } else if (
      currentTime >= tenMinutesBeforeStartTime &&
      currentTime < event.endDate
    ) {
      return (
        <Button
          title="Join Now"
          onPress={() => {
            Linking.openURL(selectedEvent.zoomLink);
          }}
        />
      );
    } else if (event.startDate <= currentTime && currentTime < event.endDate) {
      return <Button title="Event in progress" disabled />;
    } else {
      return null; // Event has ended
    }
  };

  // Renders carousel card items
  const renderItem = ({ item, index }: { item: EventItem; index: number }) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.cardContainer,
        { backgroundColor: index === activeIndex + 3 ? "#f3b718" : "#f09030" },
      ]}
      onPress={() => navigateToZoomLink(item)}
    >
      <Text style={styles.cardText}>{item.item}</Text>
      <Text style={styles.cardTextTime}>
        {moment(item.startDate).format("dddd MMMM Do, h:mm a")}
      </Text>
    </TouchableOpacity>
  );
  // Handles carousel navigation snap style
  const handleSnapToItem = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : error ? (
        <Text style={styles.loading}>Error: {error}</Text>
      ) : (
        <>
          <Carousel
            data={events}
            layout={"default"}
            renderItem={renderItem}
            sliderWidth={Math.round(viewportWidth * 0.9)}
            itemWidth={Math.round(viewportWidth * 0.3)}
            loop={true}
            useScrollView={true}
            activeSlideAlignment="center"
            ref={scrollViewRef}
            inactiveSlideScale={0.8}
            inactiveSlideOpacity={1}
            onSnapToItem={(index) => handleSnapToItem(index)} // Handle snapping logic
          />
          {/* Prompt Below */}
          {/* <Text style={styles.prompt}>
            {events[activeIndex].prompt && events[activeIndex].prompt}
          </Text> */}

          <TouchableOpacity style={styles.arrowLeft} onPress={scrollToPrevious}>
            <FontAwesome name="angle-left" size={124} color="rgb(45, 62, 95)" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.arrowRight} onPress={scrollToNext}>
            <FontAwesome
              name="angle-right"
              size={124}
              color="rgb(45, 62, 95)"
            />
          </TouchableOpacity>

          {isModalOpen && selectedEvent && (
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                <Text>{selectedEvent.item}</Text>
                {selectedEvent.endDate && (
                  <Text>
                    End Date:{" "}
                    {moment(selectedEvent.endDate).format(
                      "dddd MMMM Do, h:mm a"
                    )}
                  </Text>
                )}
                {renderModalContent(selectedEvent)}
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <Text>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 290,
    alignItems: "center",
  },
  cardContainer: {
    width: viewportWidth * 0.3, // Adjusted to show 3 cards at a time
    height: viewportHeight * 0.3, // Adjusted to fit the content
    backgroundColor: "#f09030",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    flexDirection: "column",
    gap: 10,
  },
  cardText: {
    fontSize: 30, // Adjusted font size
    color: "#393939",
    fontWeight: "700",
    textAlign: "center",
  },
  cardTextTime: {
    fontSize: 20, // Adjusted font size
    color: "#393939",
    fontWeight: "600",
    textAlign: "center",
  },
  loading: {
    fontSize: 30,
    marginTop: 30,
    color: "#746E6E",
  },
  prompt: {
    fontSize: 20,
    marginBottom: 15,
  },
  arrowLeft: {
    position: "absolute",
    top: "40%",
    left: -17,
    transform: [{ translateY: -50 }],
  },
  arrowRight: {
    position: "absolute",
    top: "40%",
    right: -25,
    transform: [{ translateY: -50 }],
  },
  modalContainer: {
    position: "absolute",
    top: "30%",
    // left: "74%",
    transform: [
      { translateX: -viewportWidth * 0.01 }, //for ios is 0.4
      { translateY: -viewportWidth * 0.2 },
    ],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    borderRadius: 10,
  },
  modal: {
    backgroundColor: "white",
    padding: 60,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "lightgray",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default Activities;
