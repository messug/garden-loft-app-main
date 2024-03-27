import { View, Text, KeyboardAvoidingView, ActivityIndicator, Button, StyleSheet, Image} from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native'

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const HomePage = ({navigation}: RouterProps) => {
  return (
    <View style={styles.container}>
    <KeyboardAvoidingView behavior="padding"> 
    <Image source={require('../../../assets/images/garden-loft-logo2.png')} style={{ width: 355, height: 172 }} />
     <Text style={styles.welcome}>Welcome Garden Loft Residents</Text>
     <Text style={styles.welcome}>Please ensure you have the following apps downloaded:</Text>
     <Image source={require('../../../assets/images/zoom.png')} style={{ width: 140, height: 140, borderRadius: 20, }} />

     <Button title="Go To Login Page" onPress={() => navigation.navigate('login')} />
        


     
     {/* {loading ? (
       <ActivityIndicator size="large" color="#0000ff" />
     ) : (
       <>
         <Button title="Login" onPress={signIn} />
         <Button title="Create Account" onPress={signUp} />
       </>
     )} */}
     </KeyboardAvoidingView>
   </View>
  )
}

export default HomePage

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    // flex: 1,
    marginHorizontal: 20,
    backgroundColor: "#FCF8E3",
  },
  input: {
    borderColor: "black",
    backgroundColor: "white",
    padding: 30,
  },
  welcome: {
    fontSize: 40,
    color: "grey",
    
  },
});


