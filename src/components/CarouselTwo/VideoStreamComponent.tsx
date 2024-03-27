import React from 'react';
import { RTCView } from 'react-native-webrtc';
import { StyleSheet, View } from 'react-native';

const VideoStreamComponent = ({ localStream, remoteStream }) => {
  return (
    <View style={styles.streamsContainer}>
      {localStream && (
        <RTCView streamURL={localStream.toURL()} style={styles.localStream} />
      )}
      {remoteStream && (
        <RTCView streamURL={remoteStream.toURL()} style={styles.fullScreen} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  streamsContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  fullScreen: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 0,
  },
  localStream: {
    width: 150,
    height: 200,
    position: 'absolute',
    zIndex: 1,
    bottom: 10,
    right: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
});

export default VideoStreamComponent;
