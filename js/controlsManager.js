import * as THREE from "three";
import TWEEN from "tween";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import {
  RemoveObjectCommand,
  TransformCommand,
  AddObjectCommand,
  SetLockCommand,
} from "./command.js";

const VIEW_POSITIONS = {
  // default camera position
  top: { pos: [0, 15, 0.01], target: [0, 0, 0] },
  front: { pos: [0, 2, 15], target: [0, 2, 0] },
  left: { pos: [-15, 2, 0], target: [0, 2, 0] },
  perspective: { pos: [10, 8, 10], target: [0, 2, 0] },
};

export class ControlsManager {
  constructor(app) {
    this.app = app;
    this.orbitControls = null;
    this.transformControls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.originalTransform = null;
    this.justFinishedDragging = false;
    this.keyStates = {};
    this.moveSpeed = 5.0;
    this.clock = new THREE.Clock(); // for calc frame-rate
    this.isSnapping = false;
    this.initialDistance = 0;
    this.zoomStep = 1.1;
    this.isWalkViewActive = false;
    this.clipboardObject = null;
  }

  init() {
    // run once, at the beginning of the app lifecycle
    this.orbitControls = new OrbitControls( //create instant of orbit controls linking it to the camera and the renderer's canvas.
      this.app.camera,
      this.app.renderer.domElement
    );

    this.orbitControls.enableDamping = false;
    this.orbitControls.rotateSpeed = 0.5;
    this.orbitControls.panSpeed = 0.5;
    this.orbitControls.zoomSpeed = 0.8;
    // Sets the initial point the camera will orbit around.
    this.orbitControls.target.set(0, 2, 0);

    // for zoom percentage calculation
    this.initialDistance = this.app.camera.position.distanceTo(
      this.orbitControls.target
    );

    // the gizmo used to manipulate objects.
    this.transformControls = new TransformControls(
      this.app.camera,
      this.app.renderer.domElement
    );
    this.app.scene.add(this.transformControls);
    this.bindEventListeners();
  }

  // Method to zoom in
  zoomIn() {
    if (this.isWalkViewActive) return;
    this.app.camera.position.lerp(this.orbitControls.target, 0.1);
    this.orbitControls.update();
  }

  // Method to zoom out
  zoomOut() {
    if (this.isWalkViewActive) return;
    const zoomOutFactor = 1.1; // How much to zoom out per click
    const direction = new THREE.Vector3();

    // Get the direction vector from the target to the camera
    direction.subVectors(this.app.camera.position, this.orbitControls.target);
    // Scale that vector to move the camera
    direction.multiplyScalar(zoomOutFactor);
    this.app.camera.position.copy(this.orbitControls.target).add(direction);
    this.orbitControls.update();
  }

  // resetZoomBaseline() {
  //   // Recalculate the initial distance based on the camera's current position
  //   this.initialDistance = this.app.camera.position.distanceTo(
  //     this.orbitControls.target
  //   );

  //   // Immediately update the UI to reflect this new baseline.
  //   this.app.uiManager.updateZoomDisplay();
  // }

  getCurrentZoomPercentage() {
    const currentDistance = this.app.camera.position.distanceTo(
      this.orbitControls.target
    );
    if (currentDistance === 0) return Infinity;
    const percentage = (this.initialDistance / currentDistance) * 100;
    return Math.round(percentage);
  }

  toggleSnapping() {
    this.isSnapping = !this.isSnapping;

    if (this.isSnapping) {
      this.transformControls.translationSnap = 0.5; // Snap to 50cm increments
      this.transformControls.rotationSnap = THREE.MathUtils.degToRad(15); // Snap to 15-degree increments
      this.transformControls.scaleSnap = 0.1; // Snap to 10% scale increments
    } else {
      this.transformControls.translationSnap = null;
      this.transformControls.rotationSnap = null;
      this.transformControls.scaleSnap = null;
    }

    return this.isSnapping;
  }

  resetOrbitControls() {
    this.orbitControls.enablePan = true;
    this.orbitControls.enableZoom = true;
    this.isWalkViewActive = false;
  }

  setCameraView(viewKey) {
    // reset the controls when switching views
    if (this.isWalkViewActive) {
      this.resetOrbitControls();
    }

    // Animate the camera to a predefined view.
    return new Promise((resolve) => {
      // promise that resolves when the animation is complete.

      const view = VIEW_POSITIONS[viewKey];
      if (!view) {
        resolve();
        return;
      }

      const startPos = this.app.camera.position.clone();
      const endPos = new THREE.Vector3(...view.pos);
      const startTarget = this.orbitControls.target.clone();
      const endTarget = new THREE.Vector3(...view.target);
      TWEEN.removeAll();
      new TWEEN.Tween({ t: 0 })
        .to({ t: 1 }, 750)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(({ t }) => {
          this.app.camera.position.copy(startPos).lerp(endPos, t);
          this.orbitControls.target.copy(startTarget).lerp(endTarget, t);
          this.orbitControls.update();
        })
        .onComplete(() => {
          resolve();
        })
        .start();
    });
  }

  async setWalkView() {
    const roomDims = this.app.sceneManager.roomDimensions; // Get the dimensions (width, height, length) of the current room from the SceneManager.
    if (!roomDims) {
      console.warn("Cannot enter walk view: No room has been generated.");
      return;
    }
    const eyeLevel = 1; // Standard eye-level height in meters.
    const entryPointZ = roomDims.length / 2 + 1.5; // Start 1.5m inside the front wall.
    const endPos = new THREE.Vector3(0, eyeLevel, entryPointZ);
    const endTarget = new THREE.Vector3(0, eyeLevel, 0);
    // .clone() is used to create a copy
    const startPos = this.app.camera.position.clone();
    const startTarget = this.orbitControls.target.clone();

    // Animate transition using TWEEN.js
    return new Promise((resolve) => {
      TWEEN.removeAll();
      new TWEEN.Tween({ t: 0 })
        .to({ t: 1 }, 1000) // 1-second animation duration
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(({ t }) => {
          // 't' goes from 0 to 1. .lerp()  every frame
          this.app.camera.position.copy(startPos).lerp(endPos, t);
          this.orbitControls.target.copy(startTarget).lerp(endTarget, t);
          this.orbitControls.update();
        })
        .onComplete(() => {
          // After the animation, ensure the controls are update
          this.orbitControls.update();
          resolve();
        })
        .start();
    });
  }

  focusOnSelectedObject() {
    // F key
    const object = this.transformControls.object;
    if (!object) return;
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.app.camera.fov * (Math.PI / 180); // clac how far the camera needs to be to see the whole object.
    let cameraDistance = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
    cameraDistance *= 1.7; // add padding
    const direction = new THREE.Vector3() // calc new cam pos
      .subVectors(this.app.camera.position, this.orbitControls.target)
      .normalize();
    const newCameraPos = new THREE.Vector3()
      .copy(center)
      .addScaledVector(direction, cameraDistance);
    const startPos = this.app.camera.position.clone(); // animate the camera moving
    const startTarget = this.orbitControls.target.clone();
    TWEEN.removeAll();
    new TWEEN.Tween({ t: 0 })
      .to({ t: 1 }, 500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(({ t }) => {
        this.app.camera.position.copy(startPos).lerp(newCameraPos, t);
        this.orbitControls.target.copy(startTarget).lerp(center, t);
        this.orbitControls.update();
      })
      .start();
  }

  //set all event listeners for user input
  bindEventListeners() {
    this.app.renderer.domElement.addEventListener("click", (e) =>
      this.onCanvasClick(e)
    );
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));

    // Listen for when the user starts or stops dragging the transform gizmo.
    this.transformControls.addEventListener("dragging-changed", (event) => {
      this.orbitControls.enabled = !event.value; //Disable camera orbiting while dragging an object.
      if (!event.value) {
        // When dragging ends...
        this.onTransformEnd(); // Finalize the transformation for the undo history.
        this.justFinishedDragging = true;
      }
    });

    this.orbitControls.addEventListener("change", () => {
      // when cam move, the percentage chg
      this.app.uiManager.updateZoomDisplay();
    });

    this.transformControls.addEventListener("mouseDown", () => {
      this.onTransformStart(); //when click the transform gizmo
    });

    // change to the object being transformed (position, rotation, or scale).
    this.transformControls.addEventListener("objectChange", () => {
      if (this.transformControls.object) {
        this.app.uiManager.updateInspector(this.transformControls.object); // chg inspector value
      }
    });
  }

  // handles smooth movment based on which keys are held down.
  handleCameraMovement(delta) {
    const moveDistance = this.moveSpeed * delta;
    const camera = this.app.camera;
    const controls = this.orbitControls;
    // get the direction the camera is currently looking.
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3()
      .crossVectors(forward, camera.up)
      .normalize();
    if (this.keyStates["w"]) {
      camera.position.addScaledVector(forward, moveDistance);
      controls.target.addScaledVector(forward, moveDistance);
    }
    if (this.keyStates["s"]) {
      camera.position.addScaledVector(forward, -moveDistance);
      controls.target.addScaledVector(forward, -moveDistance);
    }
    if (this.keyStates["a"]) {
      camera.position.addScaledVector(right, -moveDistance);
      controls.target.addScaledVector(right, -moveDistance);
    }
    if (this.keyStates["d"]) {
      camera.position.addScaledVector(right, moveDistance);
      controls.target.addScaledVector(right, moveDistance);
    }
    if (this.keyStates["q"]) {
      camera.position.y += moveDistance;
      controls.target.y += moveDistance;
    }
    if (this.keyStates["e"]) {
      camera.position.y -= moveDistance;
      controls.target.y -= moveDistance;
    }
  }

  update() {
    //called every frame
    const delta = this.clock.getDelta(); // get time since last frame.
    this.handleCameraMovement(delta);
    this.orbitControls.update();
  }

  onKeyDown(event) {
    //esp for shortcut
    if (document.activeElement.tagName === "INPUT") return; // ingnore if typing in input fields
    this.keyStates[event.key.toLowerCase()] = true;

    // for Ctrl + ..
    if (event.ctrlKey || event.metaKey) {
      // metaKey for command key on mac
      const key = event.key.toLowerCase();
      if (key === "z") {
        this.app.undoManager.undo();
      } else if (key === "y") {
        this.app.undoManager.redo();
      } else if (key === "c") {
        if (this.transformControls.object) {
          this.clipboardObject = this.transformControls.object;
          showToast("Object copied to clipboard.", "success");
        }
      } else if (key === "v") {
        if (this.clipboardObject) {
          const clonedObject = this.clipboardObject.clone();
          clonedObject.traverse((node) => {
            if (node.isMesh) {
              node.material = node.material.clone();
            }
          });

          clonedObject.position.add(new THREE.Vector3(0.5, 0, 0.5)); // offset a bit

          const command = new AddObjectCommand(this.app, clonedObject);
          this.app.undoManager.execute(command); // add to undo history
          this.selectObject(clonedObject); //auto select new obj
        }
      }
      return;
    }

    switch (event.key.toLowerCase()) {
      case "r":
        const currentMode = this.transformControls.getMode();
        switch (currentMode) {
          case "translate":
            this.transformControls.setMode("rotate");
            break;
          case "rotate":
            this.transformControls.setMode("scale");
            break;
          case "scale":
            this.transformControls.setMode("translate");
            break;
        }
        break;
      case "f":
        if (this.transformControls.object) {
          this.focusOnSelectedObject();
        }
        break;
      case "delete":
      case "backspace":
        if (this.transformControls.object) {
          const command = new RemoveObjectCommand(
            this.app,
            this.transformControls.object
          );
          this.app.undoManager.execute(command);
        }
        break;
      case "escape":
        this.deselectObject();
        break;
    }
  }

  onKeyUp(event) {
    this.keyStates[event.key.toLowerCase()] = false; // to stop moving the camera.
  }

  onCanvasClick(event) {
    // handle obj selection via mouse click
    if (this.justFinishedDragging) {
      this.justFinishedDragging = false; //
      return;
    }
    if (this.transformControls.dragging) return; // if the user is currently dragging the move/rotate/scale  gizmo, do nothing.

    // get the size and position of the canvas on the webpage.
    const rect = this.app.renderer.domElement.getBoundingClientRect();
    // convert the mouse's X and Y pixel coordinates to Three.js's normalized device coordinates (a range from -1 to +1).
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.app.camera);

    const allPotentialTargets = [
      ...this.app.sceneManager.selectableObjects,
      ...this.app.sceneManager.walls,
    ];
    if (this.app.sceneManager.floor) {
      allPotentialTargets.push(this.app.sceneManager.floor);
    }

    // filter the list to include obj that currently visible on screen
    const visibleTargets = allPotentialTargets.filter((obj) => obj.visible);
    const intersects = this.raycaster.intersectObjects(visibleTargets, true);

    // This variable will hold the final object we determine to be selected.
    let foundObject = null;
    if (intersects.length > 0) {
      // if the ray hit one or more objects
      let object = intersects[0].object; // get the closest object that was hit.
      while (object) {
        if (object.userData.isSelectable) {
          foundObject = object;
          break;
        }
        object = object.parent; // If not, move up to the parent object and check again.
      }
    }

    if (foundObject) {
      this.selectObject(foundObject);
    } else {
      this.deselectObject();
    }
  }
  selectObject(object) {
    if (object) {
      this.transformControls.detach(); // Detach the transform gizmo from any previously selected object.

      if (
        !object.userData.isWall &&
        !object.userData.isFloor &&
        !object.userData.isLocked
      ) {
        this.transformControls.attach(object);
      }

      this.app.uiManager.updateInspector(object);
    }
  }

  deselectObject() {
    this.transformControls.detach();
    this.app.uiManager.updateInspector(null); // tell the UIManager to clear the inspector panel by passing `null`.
  }

  onTransformStart() {
    // called when the user starts dragging the transform gizmo
    const object = this.transformControls.object;
    if (!object) return;
    // to create a copy, not a reference.
    this.originalTransform = {
      position: object.position.clone(),
      quaternion: object.quaternion.clone(),
      scale: object.scale.clone(),
    };
  }

  //  when the user finishes dragging the transform gizmo
  onTransformEnd() {
    const object = this.transformControls.object;
    if (!object || !this.originalTransform) return;
    const newTransform = {
      // Capture the new state of the object after the transformation
      position: object.position.clone(),
      quaternion: object.quaternion.clone(),
      scale: object.scale.clone(),
    };

    const command = new TransformCommand( // the object that was changed, its state before, and its state after
      this.app,
      object,
      this.originalTransform, // before state
      newTransform // after state
    );

    //allow the user to undo the transform
    this.app.undoManager.execute(command);
    this.originalTransform = null;
  }
}
