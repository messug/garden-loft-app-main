import firestore from '@react-native-firebase/firestore';
import { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, mediaDevices } from 'react-native-webrtc';

class WebRTCService {
  private configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  private peerConnection: RTCPeerConnection;
  private callId: string; // Unique identifier for the call
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;

  constructor(callId: string) {
    this.callId = callId;
    this.peerConnection = new RTCPeerConnection(this.configuration);
    this.initializeListeners();
  }

  private async initializeListeners() {
    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        this.sendIceCandidate(event.candidate);
      }
    };

    this.peerConnection.ontrack = event => {
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        // Here you could inform your application to display the remote stream
      }
    };

    // Listen for Firestore updates to the call document for this callId
    firestore().collection('calls').doc(this.callId).onSnapshot(snapshot => {
      const data = snapshot.data();
      if (data) {
        // Handle new ICE candidates from remote
        if (data.iceCandidates) {
          data.iceCandidates.forEach((candidate: RTCIceCandidate) => {
            this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          });
        }
        // Handle remote offer or answer
        if (data.offer && !data.answer) {
          this.handleRemoteOffer(data.offer);
        } else if (data.answer) {
          this.handleRemoteAnswer(data.answer);
        }
      }
    });
  }

  private async sendIceCandidate(candidate: RTCIceCandidate) {
    await firestore().collection('calls').doc(this.callId).update({
      iceCandidates: firestore.FieldValue.arrayUnion(candidate.toJSON()),
    });
  }

  public async initiateCall() {
    this.localStream = await mediaDevices.getUserMedia({ video: true, audio: true });
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream!);
    });
    // Here you could inform your application to display the local stream
    await this.createOffer();
  }

  private async createOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    await firestore().collection('calls').doc(this.callId).set({
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
      iceCandidates: [],
    });
  }

  private async handleRemoteOffer(offer: RTCSessionDescription) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    await firestore().collection('calls').doc(this.callId).update({
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    });
  }

  private async handleRemoteAnswer(answer: RTCSessionDescription) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  public closeCall() {
    this.peerConnection.close();
    // Optionally clean up local and remote streams
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    // Clean up Firestore document if necessary
    firestore().collection('calls').doc(this.callId).delete(); // Consider only deleting if you are the call initiator
    // Reset local and remote streams
    this.localStream = null;
    this.remoteStream = null;
  }

  // Additional utility methods can be added here (e.g., toggle camera, switch audio output)
}

export default WebRTCService;
