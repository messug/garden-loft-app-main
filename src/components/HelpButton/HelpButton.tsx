import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Button } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { TwilioVoice } from 'react-native-twilio-programmable-voice'; // Import Twilio Voice SDK
import * as Linking from 'expo-linking';
import React, { useState, useRef,useEffect } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig';
import {collection, getDocs} from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");


const HelpButton: React.FC = (() => {
  //fetch data info into welcome 'name'
  const [userInfo, setUserInfo] = useState<any |undefined>(null);

    //fetch data from firestore and display
    // const getData = async () => {
    //   const querySnapshot = await getDocs(collection(FIRESTORE_DB, "users"));
    //   querySnapshot.forEach((doc) => {
    //     // console.log(doc.id, " =>", doc.data());
    //     setUserInfo(doc.data());
    //   })};
    
    //   useEffect(() => {
    //     getData();
    //   },[]);

    const getCurrentUserData = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userRef = doc(FIRESTORE_DB, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          console.log("User data:", userSnap.data());
          setUserInfo(userSnap.data()); // Assuming 'email' is a field in your document
        } else {
          console.log("No such document!");
        }
      }
    };
  
    useEffect(() => {
      getCurrentUserData();
    }, []); 


  const handleCallSupport = async () => {
    try {
      // Replace with your Twilio access token
      const accessToken = 'YOUR_TWILIO_ACCESS_TOKEN';

      // Call Twilio Voice SDK to make the call
      await TwilioVoice.connect({ To: '+14035102393', accessToken });

    } catch (error) {
      console.error('Error making call:', error);
      // Handle errors gracefully (e.g., display an error message to the user)
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/garden-loft-logo2.png')} style={{ width: 155, height: 72 }} />
      <TouchableOpacity onPress={handleCallSupport} style={{ backgroundColor: '#59ACCE', padding: 5, paddingLeft: 10, borderRadius: 7, flexDirection: "row", }}>
        <MaterialCommunityIcons name="phone-classic" size={52} color="#f3b718" />
        <Text style={{ color: '#2E3E5E', fontSize: 30, padding: 10, }}>Call Support</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.logOut} onPress={() => FIREBASE_AUTH.signOut() }><Text style={styles.logOut}>Log Out</Text></TouchableOpacity> */}
      <Text style={styles.logOut}>Welcome {userInfo?.name}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: viewportWidth * 0.95,
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 15,
  },
  logOut: {
    // backgroundColor: '#59ACCE', 
    color: '#2E3E5E', 
    fontSize: 30, 
    padding: 10, 
    borderRadius: 7}
});

export default HelpButton;
