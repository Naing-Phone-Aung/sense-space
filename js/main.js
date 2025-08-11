import * as THREE from "three";
import TWEEN from "tween";
import { UndoManager } from "./command.js";
import { AudioManager } from "./audioManager.js";
import { UIManager } from "./uiManager.js";
import { SceneManager } from "./sceneManager.js";
import { ControlsManager } from "./controlsManager.js";
import { AuthManager } from "./authManager.js";

class EditorApp {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.undoManager = new UndoManager(this);
    this.uiManager = new UIManager(this);
    this.sceneManager = new SceneManager(this);
    this.controlsManager = new ControlsManager(this);
    this.audioManager = new AudioManager(this);
    this.authManager = new AuthManager(this);
    this.ambientLight = null;
    this.directionalLight = null;
    this.hemiLight = null;
    this.dirLightHelper = null;
    this.hemiLightHelper = null;
    this.lightGridHelper = null;
    this.darkGridHelper = null;
    this.init();
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectIdFromUrl = urlParams.get("project_id");
    const templateUrlFromUrl = urlParams.get("template_url"); 
    this.renderer.setSize(
      this.uiManager.dom.container.clientWidth,
      this.uiManager.dom.container.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.uiManager.dom.container.appendChild(this.renderer.domElement);

   
    this.scene.background = new THREE.Color(0xf0f0f0);
    this.camera.position.set(10, 8, 10);

   
    this.ambientLight = new THREE.AmbientLight(0xfafafa, 0.5);
    this.scene.add(this.ambientLight);
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    this.hemiLight.position.set(0, 50, 0);
    this.scene.add(this.hemiLight);
    this.directionalLight = new THREE.DirectionalLight(0xfafafa, 1);
    this.directionalLight.position.set(5, 50, 5);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(2048, 2048);
    this.directionalLight.shadow.bias = -0.0001;
    this.directionalLight.shadow.normalBias = 0.05;
    this.scene.add(this.directionalLight);
    this.ambientLight = new THREE.AmbientLight(0xfafafa, 1.0);
    this.scene.add(this.ambientLight);
    this.hemiLightHelper = new THREE.HemisphereLightHelper(this.hemiLight, 10);
    this.dirLightHelper = new THREE.DirectionalLightHelper(
      this.directionalLight,
      10
    );

  
    this.lightGridHelper = new THREE.GridHelper(100, 60, 0xbebebe, 0xd7d7d7);
    this.lightGridHelper.position.y = -0.1;
    this.darkGridHelper = new THREE.GridHelper(100, 60, 0x444444, 0x2c2c2c);
    this.darkGridHelper.position.y = -0.1;
    this.scene.add(this.lightGridHelper);

    
    this.controlsManager.init();
    this.uiManager.init();
    this.audioManager.init();

    
    if (projectIdFromUrl) {
      this.currentProjectId = projectIdFromUrl;
      this.sceneManager.loadProjectFromId(projectIdFromUrl);
    } else if (templateUrlFromUrl) {
      this.sceneManager.loadSceneFromUrl(templateUrlFromUrl);
    } else {
      this.sceneManager.generateInitialRoom();
    }

    window.addEventListener("resize", () => this.onWindowResize());
    this.animate();
  }

  setBackgroundColor(color) {
    this.scene.background.set(color);
    if (color === 0x1a1a1a) {
      this.scene.remove(this.lightGridHelper);
      this.scene.add(this.darkGridHelper);
    } else {
      this.scene.remove(this.darkGridHelper);
      this.scene.add(this.lightGridHelper);
    }
  }

  resetLighting() {
    if (this.hemiLight) {
      this.hemiLight.color.set(0xffffff);
      this.hemiLight.groundColor.set(0xffffff);
    }
    if (this.directionalLight) {
      this.directionalLight.color.set(0xfafafa);
    }
    this.uiManager.updateLightingInspectorUI();
  }

  toggleHemiLight() {
    if (this.hemiLight) {
      this.hemiLight.visible = !this.hemiLight.visible;
      this.hemiLightHelper.visible = this.hemiLight.visible;
      return this.hemiLight.visible;
    }
    return false;
  }

  toggleDirLight() {
    if (this.directionalLight) {
      this.directionalLight.visible = !this.directionalLight.visible;
      this.dirLightHelper.visible = this.directionalLight.visible;
      return this.directionalLight.visible;
    }
    return false;
  }

  onWindowResize() {
    this.camera.aspect =
      this.uiManager.dom.container.clientWidth /
      this.uiManager.dom.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.uiManager.dom.container.clientWidth,
      this.uiManager.dom.container.clientHeight
    );
  }

  animate(time) {
    requestAnimationFrame((t) => this.animate(t));
    TWEEN.update(time);
    this.controlsManager.update();
    this.sceneManager.update();
    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new EditorApp();
});
