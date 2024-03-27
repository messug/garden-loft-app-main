import firestore from '@react-native-firebase/firestore';

interface Offer {
  sdp: string;
  type: string;
}

interface Answer {
  sdp: string;
  type: string;
}

class Signaling {
  private localPeerId: string;
  private remotePeerId: string;
  private db = firestore();

  constructor(localPeerId: string, remotePeerId: string) {
    this.localPeerId = localPeerId;
    this.remotePeerId = remotePeerId;
  }

  public sendOffer(offer: RTCSessionDescriptionInit): void {
    const offerData: Offer = {
      sdp: offer.sdp!,
      type: offer.type,
    };
    this.db.collection('calls').doc(this.localPeerId).set({
      offer: offerData,
      from: this.localPeerId,
      to: this.remotePeerId,
    });
  }

  public listenForAnswer(setRemoteDescription: (answer: RTCSessionDescriptionInit) => void): void {
    this.db.collection('calls').doc(this.remotePeerId)
      .onSnapshot(docSnapshot => {
        const data = docSnapshot.data();
        if (data && data.answer && data.to === this.localPeerId) {
          const answer: Answer = data.answer;
          setRemoteDescription({ type: answer.type as RTCSdpType, sdp: answer.sdp });
        }
      });
  }

  // Implement more methods for handling candidates, etc.
}

export default Signaling;
