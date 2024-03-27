import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Dimensions,
  Image,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/FirebaseConfig";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import {signInWithEmailAndPassword} from "@firebase/auth";
import { doc, setDoc} from 'firebase/firestore';



const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      console.log(response);
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

//   const signUp = async () => {
//     setLoading(true);
//     try {
//       //create User and get response:
//       const response = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       console.log(response);
// //Get the user record from the response
// const user = response.user;

// //Add Sign-up Data to Firestore Database
// //Ensure you have a firestore instance ('db') initialized and imported
// setDoc(doc(FIRESTORE_DB, "users", user.uid), {
//   Name: email, 
//   })
//   .then(() => alert('data uploaded successfully'));
//       alert("Check your email");
//     } catch (error: any) {
//       console.log(error);
//       alert("Sign in failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
  
//   };
const signUp = async () => {
  setLoading(true); // Start loading
  try {
    // Attempt to create a new user with email and password
    const response = await createUserWithEmailAndPassword(
      auth,
      email.trim(), // Remove any leading/trailing whitespace
      password
    );
    // Extract user info from the response
    const user = response.user;
    // Save the user's email to Firestore under a collection "users" with the user's UID as the document ID
    await setDoc(doc(FIRESTORE_DB, "users", user.uid), {
      email: email, // Use the email from state
      name: name,
    });
    alert('Account created successfully! Check your email.');
  } catch (error) {
    console.error(error);
    alert("Sign up failed: " + error.message); // Show error message
  } finally {
    setLoading(false); // Stop loading irrespective of success or failure
  }
};


  return (
    
    <View style={styles.container}>
     <KeyboardAvoidingView behavior="padding"> 
     {/* <Image source={require('../../../assets/images/garden-loft-logo2.png')} style={{ width: 355, height: 172, alignSelf: 'center', marginBottom: 30,}} /> */}
      <Text style={styles.welcome}>Welcome Garden Loft Residents</Text>
      <TextInput
        value={name}
        style={styles.input}
        placeholder="name"
        autoCapitalize="none"
        onChangeText={(text) => setName(text)}
      ></TextInput>
      <TextInput
        value={email}
        style={styles.input}
        placeholder="email"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      ></TextInput>
      <TextInput 
       
        secureTextEntry={true}
        value={password}
        style={styles.input}
        placeholder="password"
        autoCapitalize="none"
        onChangeText={(text) => setPassword(text)}
      ></TextInput>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Login" onPress={signIn} />
          <Button title="Create Account" onPress={signUp} />
        </>
      )}
      </KeyboardAvoidingView>
    </View>
  );
      };

export default Login;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: "#FCF8E3",
    width: viewportWidth * 1, // Adjusted to show 3 cards at a time
    height: viewportHeight * 1, // Adjusted to fit the content
    alignSelf: 'center',
  },
  input: {
    borderColor: "black",
    backgroundColor: "white",
    padding: 30,
    width: viewportWidth * 0.4, // Adjusted to show 3 cards at a time
    height: viewportHeight * 0.1, // Adjusted to fit the content
    alignSelf: 'center',
    borderRadius: 30,
    marginBottom: 30,
  
  },
  welcome: {
    fontSize: 40,

    color: "#f09030",
    alignSelf: 'center',
    marginBottom: 30,
    
  },
  
});
