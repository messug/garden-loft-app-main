import { StyleSheet, Alert, View } from "react-native";

import CarouselOne from "@/src/components/CarouselOne/CarouselOne";
import HelpButton from "@/src/components/HelpButton/HelpButton";
//Create Navigation Stacks
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "@/src/components/Login/Login";
import { User, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import HomePage from "@/src/components/HomePage/HomePage";
// App.js or your main component
// import messaging from '@react-native-firebase/messaging';

// useEffect(() => {
//   const unsubscribe = messaging().onMessage(async remoteMessage => {
//     Alert.alert('Incoming Call', `${remoteMessage.notification.title}`, [
//       { text: 'Answer', onPress: () => handleAnswerCall(remoteMessage.data.callId) },
//       { text: 'Decline', onPress: () => handleDeclineCall(remoteMessage.data.callId) },
//     ]);
//   });

//   return unsubscribe;
// }, []);

// const handleAnswerCall = (callId) => {
//   // Navigate to the call screen and use the callId to retrieve call details
// };

// const handleDeclineCall = (callId) => {
//   // Send a message to the backend to decline the call
// };



// import LoginSignUp from '@/src/components/CarouselTwo/LoginSignUp';
// import Activities from '@/src/components/CarouselTwo/Activities';

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

// function InsideLayout() {
//   return (
//     // <InsideStack.Navigator>
//     // <InsideStack.Screen name='login' component={Login} />
//     // {/* <InsideStack.Screen name='homepage' component={HomePage} /> */}
//     // </InsideStack.Navigator>
//   // )
// }

export default function TabOneScreen() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      // console.log('user', user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login">
      
        <>
          {user ? (
            <Stack.Screen 
            options={{ headerShown: false }} name="Garden Loft Home" 
            component={InsideApp} />
          ) : (
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          )}
        </>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function InsideApp() {
  return (
    <View style={styles.container}>
      <HelpButton />
      <CarouselOne />
    {/* <HomePage /> */}
    </View>



  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCF8E3",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
