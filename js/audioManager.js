import * as THREE from "three";

export class AudioManager {
  constructor(app) {
    this.app = app;
    this.listener = null; // the central audi listener attachhed to the camera
    this.musicTracks = {}; // use an object to store loaded tracks
    this.currentMusic = null; //track the currently playing music
    this.dropSound = null; // to hold the drop sound effect
    this.audioLoader = new THREE.AudioLoader();
    this.isEffectsSoundEnabled = false;
  }

  // initialize the audio system
  // create the audio listener and attach it to the camera
  // load user settings and pre-load all necessary audio files
  init() {
    this.loadSettings();
    this.listener = new THREE.AudioListener();
    this.app.camera.add(this.listener);
    this.dropSound = new THREE.Audio(this.listener); // Initialize the Audio object for the drop sound.
    this.loadAllSounds(); // Load all required music tracks and sound effects into memory for quick playback.
  }

  loadAllSounds() {
   // preload all music tracks
    this.loadMusicTrack(
      "Evening Improvisation",
      "/public/assets/Sounds/Music/Evening-Improvisation-with-Ethera(chosic.com).mp3"
    );
    this.loadMusicTrack(
      "Heavy Rain",
      "/public/assets/Sounds/Music/Heavy_rain-500audio.mp3"
    );
    this.loadMusicTrack(
      "Beautiful Dreamer",
      "/public/assets/Sounds/Music/Stephen_Foster_-_Beautiful_Dreamer(chosic.com).mp3"
    );
    this.loadMusicTrack(
      "Sunset Landscape",
      "/public/assets/Sounds/Music/Sunset-Landscape(chosic.com).mp3"
    );

    this.audioLoader.load(
      "/public/assets/Sounds/Effects/drop_sound_effect.mp3",
      (buffer) => {
        // callback function on successful load
        this.dropSound.setBuffer(buffer); 
        this.dropSound.setLoop(false); // no loop
        this.dropSound.setVolume(0.8);
      },
      undefined,
      (error) => console.error("Error loading drop sound file:", error)
    );
  }

  // loads a single music track from a URL and stores it in the musicTracks object.
  loadMusicTrack(name, url) {
    const sound = new THREE.Audio(this.listener);
    this.audioLoader.load(
      url,
      (buffer) => {
        sound.setBuffer(buffer); // music traks should loop
        sound.setLoop(true);
        sound.setVolume(1);
        this.musicTracks[url] = sound; 
      },
      undefined,
      (error) => console.error(`Error loading music file: ${name}`, error)
    );
  }

  // play a music track identified by its URL
  playMusic(url) {
    if (this.currentMusic && this.currentMusic.isPlaying) {
      this.currentMusic.stop();
    }
    const selectedTrack = this.musicTracks[url];
    if (selectedTrack) {
        selectedTrack.play();
        this.currentMusic = selectedTrack;
    }
  }

  //pause the currently playing music
  pauseMusic() {
    if (this.currentMusic && this.currentMusic.isPlaying) {
      this.currentMusic.pause();
    }
  }

  // load sound settings from the browser's localStorage
  loadSettings() {
    const settingsString = localStorage.getItem("sense-app-settings");
    if (settingsString) {
      const settings = JSON.parse(settingsString);
      if (typeof settings.soundEffects !== "undefined") {
        this.isEffectsSoundEnabled = settings.soundEffects;
      }
    }
  }

  // sets the user's preference for sound effects and saves it to localStorage
  setEffectsSoundEnabled(isEnabled) {
    this.isEffectsSoundEnabled = isEnabled;
    const settings = {
      soundEffects: isEnabled,
    };
    localStorage.setItem("sense-app-settings", JSON.stringify(settings));
    if (isEnabled) {
      this.playDropSound();
    }
  }

  // for this drop sound effect
  playDropSound() {
    // check the user's preference before playing
    if (!this.isEffectsSoundEnabled) return;

    // ensure the sound is loaded and play it
    if (this.dropSound && this.dropSound.buffer) {
      // if it's already playing, stop and restart it to handle rapid drops
      if (this.dropSound.isPlaying) {
        this.dropSound.stop();
      }
      this.dropSound.play();
    }
  }

  //stop all current playing music
  stopAll() {
    if (this.currentMusic && this.currentMusic.isPlaying) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }
}