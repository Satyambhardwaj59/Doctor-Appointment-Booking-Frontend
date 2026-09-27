/**
 * WebRTC utility functions.
 * Pure functions — no React, no side effects beyond RTCPeerConnection setup.
 */

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
  iceCandidatePoolSize: 10,
};

/**
 * Create a new RTCPeerConnection with bundled STUN servers.
 */
export const createPeerConnection = (config?: RTCConfiguration): RTCPeerConnection => {
  return new RTCPeerConnection({ ...RTC_CONFIG, ...config });
};

/**
 * Add all tracks from a MediaStream to a peer connection.
 */
export const addTracksToConnection = (
  pc: RTCPeerConnection,
  stream: MediaStream
): void => {
  stream.getTracks().forEach((track) => {
    pc.addTrack(track, stream);
  });
};

/**
 * Create an SDP offer for the peer connection.
 */
export const createOffer = async (pc: RTCPeerConnection): Promise<RTCSessionDescriptionInit> => {
  const offer = await pc.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  });
  await pc.setLocalDescription(offer);
  return offer;
};

/**
 * Create an SDP answer for the peer connection.
 */
export const createAnswer = async (pc: RTCPeerConnection): Promise<RTCSessionDescriptionInit> => {
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  return answer;
};

/**
 * Safely close a peer connection and clean up.
 */
export const closePeerConnection = (pc: RTCPeerConnection | null): void => {
  if (!pc) return;
  try {
    pc.getSenders().forEach((sender) => {
      if (sender.track) sender.track.stop();
    });
    pc.close();
  } catch {
    // Already closed
  }
};

/**
 * Replace a video sender's track (used for screen share toggle).
 */
export const replaceVideoTrack = async (
  pc: RTCPeerConnection,
  newTrack: MediaStreamTrack
): Promise<void> => {
  const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
  if (sender) {
    await sender.replaceTrack(newTrack);
  }
};
