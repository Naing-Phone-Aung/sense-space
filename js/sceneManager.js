function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
}
import { CONFIG } from "./config.js";

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { AddObjectCommand } from "./command.js";
export class SceneManager {
  constructor(app) {
    this.app = app; //reference to the main
    this.gltfLoader = new GLTFLoader(); // for glb,gltf format
    this.textureLoader = new THREE.TextureLoader(); //for image textures
    this.selectableObjects = []; //an array to keep track of all the interactable objects (e.g, sofas, tables, chairs)
    this.walls = [];
    this.floor = null;
    this.roof = null;
    this.roomDimensions = null;
    this.raycaster = new THREE.Raycaster(); //to detect what 3D object the mouse is pointing at
    this.mouse = new THREE.Vector2(); //to store mouse position in normalized device coordinates (-1 to 1)
    this.previewModel = null; //for drag and drop
    this.defaultWallMaterial = new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      roughness: 1,
      transparent: true,
      opacity: 1.0,
    });
  }

  async captureThumbnail() {
    this.app.controlsManager.deselectObject();
    await this.app.controlsManager.setCameraView("top");
    return new Promise((resolve) => {
      // wait for the next frame
      requestAnimationFrame(() => {
        this.app.renderer.render(this.app.scene, this.app.camera);
        const dataURL = this.app.renderer.domElement.toDataURL("image/png"); // capture as image
        resolve(dataURL);
      });
    });
  }

  update() {
    // called every frame
    this.updateWallVisibility();
    this.updateRoofVisibility();
  }

  async loadProjectFromId(projectId) {
    const userInfoString = getCookie("user_info");
    const token = getCookie("token");

    if (!userInfoString || !token) {
      showToast("Authentication failed. Please log in.", "error");
      this.generateInitialRoom();
      return;
    }

    try {
      const user = JSON.parse(userInfoString);
      const API_URL = `${CONFIG.API_BASE_URL}/get_project.php?id=${projectId}&user_id=${user.id}`;

      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: "Failed to load project file." }));
        throw new Error(error.message || "Failed to load project file.");
      }

      const projectData = await response.json();
      this.gltfLoader.load(
        projectData.preSignedUrl,
        (gltf) => {
          // Clear everything from the current scene.
          this.clearScene();

          // Transfer all children from the loaded GLB scene to our main scene.
          while (gltf.scene.children.length > 0) {
            this.app.scene.add(gltf.scene.children[0]);
          }

          this.app.scene.children.forEach((object) => {
            this.app.scene.traverse((child) => {
              if (child.userData.isWall) {
                if (
                  child.userData.normal &&
                  typeof child.userData.normal === "object"
                ) {
                  child.userData.normal = new THREE.Vector3(
                    child.userData.normal.x,
                    child.userData.normal.y,
                    child.userData.normal.z
                  );
                }
                if (!this.walls.includes(child)) {
                  this.walls.push(child);
                }
              } else if (child.userData.isFloor) {
                this.floor = child;
              } else if (child.userData.isRoof) {
                this.roof = child;
              } else if (child.userData.isSelectable) {
                if (!this.selectableObjects.includes(child)) {
                  this.selectableObjects.push(child);
                }
              }
            });
          });

          const roomData =
            gltf.userData.room ||
            (gltf.asset && gltf.asset.extras ? gltf.asset.extras.room : null);
          if (roomData) {
            this.roomDimensions = roomData;
          } else {
            this.roomDimensions = { width: 10, height: 3, length: 10 };
          }

          this.app.uiManager.dom.projectTitle.value =
            projectData.project_name || "Untitled";

          showToast("Project loaded successfully.", "success");
        },
        undefined,
        (error) => {
          console.error("Error loading GLB from pre-signed URL:", error);
          showToast("Could not load the 3D project model.", "error");
          this.generateInitialRoom();
        }
      );
    } catch (error) {
      console.error("Failed to load project:", error);
      showToast(error.message, "error");
      this.generateInitialRoom();
    }
  }

  createPreviewModel(modelUrl) {
    if (this.previewModel) {
      //if the preview model alr exists, remove it first.
      this.removePreviewModel();
    }
    this.gltfLoader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        model.traverse((node) => {
          if (node.isMesh) {
            //previews do not cast shadow
            node.castShadow = false;
            const previewMaterial = node.material.clone();
            previewMaterial.transparent = true;
            previewMaterial.opacity = 0.6;
            node.material = previewMaterial;
          }
        });

        const box = new THREE.Box3().setFromObject(model); //get the bounding box of the entire model
        const center = box.getCenter(new THREE.Vector3()); // find the center of that box.;
        model.children.forEach((child) => child.position.sub(center)); // move all children so that the group's origin is at the geometric center.
        model.position.add(center); //  move the parent group back, so the model appears in its original spot but pivots from the center.
        model.visible = false; // hide the model initially. It will become visible when the user starts dragging.
        this.previewModel = model;
        this.app.scene.add(this.previewModel);
      },
      undefined,
      (error) => {
        console.error("Failed to load preview model:", error);
      }
    );
  }

  updatePreviewModelPosition(dragEvent) {
    //updates the position of the preview model to follow the mouse cursor
    if (!this.previewModel) return; //if no preview model currently active, thendo nothing
    this.previewModel.visible = true;
    // convert mouse coordinates to 3D space and find the point on the floor.
    const rect = this.app.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((dragEvent.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((dragEvent.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.app.camera);
    const targets = this.floor ? [this.floor] : [];
    const intersects = this.raycaster.intersectObjects(targets, false);
    let dropPosition = new THREE.Vector3(0, 0, 0);
    if (intersects.length > 0) {
      dropPosition.copy(intersects[0].point);
    } else {
      this.raycaster.ray.intersectPlane(
        new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
        dropPosition
      );
    }
    if (this.floor) {
      dropPosition.y = Math.max(dropPosition.y, 0);
    }
    this.previewModel.position.copy(dropPosition);
    this.previewModel.position.y = 0.4; // that's the height of the floor
  }

  removePreviewModel() {
    //remove preview model from scene
    if (this.previewModel) {
      this.app.scene.remove(this.previewModel);
      this.previewModel = null;
    }
  }

  // adds a final, solid model to the scene where the user dropped it
  addModelAtDropPoint(modelUrl, dropEvent) {
    this.removePreviewModel(); // clean the semi-transparent model
    // same logic as in updatePreviewModelPosition
    const rect = this.app.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((dropEvent.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((dropEvent.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.app.camera);
    const targets = this.floor ? [this.floor] : [];
    const intersects = this.raycaster.intersectObjects(targets);
    let dropPosition = new THREE.Vector3(0, 0, 0);
    if (intersects.length > 0) {
      dropPosition.copy(intersects[0].point);
    } else {
      this.raycaster.ray.intersectPlane(
        new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
        dropPosition
      );
    }
    if (this.floor) {
      //ensure it's not below the ground
      dropPosition.y = Math.max(dropPosition.y, 0);
    }
    this.app.audioManager.playDropSound();
    //    calculated position where it should be placed.
    const transform = { position: dropPosition };
    this.loadModel({ url: modelUrl, transform: transform });
  }

  //  loads 3D model from the user computer.
  loadModelFromFile(event) {
    const file = event.target.files[0];
    if (file) {
      this.loadModel({ file: file });
    }
    if (event) event.target.value = ""; // Reset the input
  }

  loadSceneFromUrl(url) {
    // for room template
    if (!url) return;

    this.gltfLoader.load(
      url,
      (gltf) => {
        this.clearScene(); // clear the current scene first

        const loadedScene = gltf.scene;
        while (loadedScene.children.length > 0) {
          const object = loadedScene.children[0];
          this.app.scene.add(object);

          // Restore object properties and categories
          if (object.userData.isFloor) {
            this.floor = object;
          } else if (object.userData.isWall) {
            this.walls.push(object);
          } else if (object.userData.isRoof) {
            this.roof = object;
          } else {
            object.userData.isSelectable = true;
            this.selectableObjects.push(object);
          }
        }

        // Reconstruct room dimensions from the loaded geometry
        if (this.floor) {
          const floorBox = new THREE.Box3().setFromObject(this.floor);
          const floorSize = floorBox.getSize(new THREE.Vector3());
          let roomHeight = 3; // Default height
          if (this.walls.length > 0) {
            const wallBox = new THREE.Box3().setFromObject(this.walls[0]);
            roomHeight = wallBox.getSize(new THREE.Vector3()).y;
          }
          this.roomDimensions = {
            width: floorSize.x,
            height: roomHeight,
            length: floorSize.z,
          };
        }
        showToast("Template loaded successfully!", "success");
      },
      undefined,
      (error) => {
        console.error(
          "An error happened while loading the template GLB:",
          error
        );
        showToast("Could not load the selected template.", "error");
      }
    );
  }

  loadSceneFromFile(event) {
    // import btn
    //load the entire scene from a GLB file. replacing the current one.
    const file = event.target.files[0];
    if (!file) return;
    const fileURL = URL.createObjectURL(file);
    this.gltfLoader.load(
      fileURL,
      (gltf) => {
        this.clearScene();

        const loadedScene = gltf.scene; // add all objects from the file into our scene.
        while (loadedScene.children.length > 0) {
          const object = loadedScene.children[0];
          this.app.scene.add(object);

          // Check the object's saved data and put it back in the right array.
          if (object.userData.isFloor) {
            this.floor = object;
          } else if (object.userData.isWall) {
            this.walls.push(object);
          } else if (object.userData.isRoof) {
            this.roof = object;
          } else {
            // If it's not part of the room, it's a selectable model
            object.userData.isSelectable = true;
            this.selectableObjects.push(object);
          }
        }

        // After categorizing all objects, if a floor was found,
        // reconstruct the roomDimensions needed for visibility culling.
        if (this.floor) {
          const floorBox = new THREE.Box3().setFromObject(this.floor);
          const floorSize = floorBox.getSize(new THREE.Vector3());

          let roomHeight = 3; // Use a sensible default height.
          if (this.walls.length > 0) {
            // Get height from the first wall found.
            const wallBox = new THREE.Box3().setFromObject(this.walls[0]);
            const wallSize = wallBox.getSize(new THREE.Vector3());
            roomHeight = wallSize.y;
          }

          this.roomDimensions = {
            width: floorSize.x,
            height: roomHeight,
            length: floorSize.z,
          };
        }
        URL.revokeObjectURL(fileURL);
      },
      undefined,
      (error) => {
        console.error("An error happened while loading the scene GLB:", error);
        alert(
          "Could not load scene file. It might be corrupted or in the wrong format."
        );
        URL.revokeObjectURL(fileURL);
      }
    );
    if (event) event.target.value = "";
  }

  async loadModel({ url, file, transform }) {
    const limitIsActive = this.app.authManager.isModelLimitEnforced();
    const maxModels = 10;

    if (limitIsActive && this.selectableObjects.length >= maxModels) {
      this.app.uiManager.showModelLimitModal();
      this.removePreviewModel();
      return;
    }

    const modelUrl = file ? URL.createObjectURL(file) : url;
    const fileName = file
      ? file.name
      : url
      ? url.split("/").pop()
      : "Loaded Object";
    if (!modelUrl) return;
    this.gltfLoader.load(
      modelUrl,
      (gltf) => {
        //exe when the model has loaded
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.children.forEach((child) => child.position.sub(center));
        model.position.add(center);
        model.userData = { isSelectable: true, fileName: fileName };
        //add shadows to model
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        if (transform) {
          //apply initial transform but if a transform was provided (like the position from drag-and-drop), apply it.
          if (transform.position) model.position.copy(transform.position);
          if (transform.quaternion) model.quaternion.copy(transform.quaternion);
          if (transform.scale) model.scale.copy(transform.scale);
        }
        //lift it slightly off the ground
        model.position.y = 0.4;
        const command = new AddObjectCommand(this.app, model);
        this.app.undoManager.execute(command);
        this.app.controlsManager.selectObject(model);
        if (file) URL.revokeObjectURL(modelUrl);
      },
      undefined,
      (error) => {
        console.error(
          `An error happened during GLTF loading for ${fileName}`,
          error
        );
      }
    );
  }

  async exportGLB() {
    // export as glb file format
    return new Promise(async (resolve, reject) => {
      this.app.controlsManager.deselectObject();
      await this.app.controlsManager.setCameraView("top");

      const exporter = new GLTFExporter();
      const objectsToExport = []; //gather all objects
      this.selectableObjects.forEach((obj) => objectsToExport.push(obj));
      if (this.floor) objectsToExport.push(this.floor);
      if (this.roof) objectsToExport.push(this.roof);
      this.walls.forEach((wall) => objectsToExport.push(wall));
      if (this.app.ambientLight) objectsToExport.push(this.app.ambientLight);
      if (this.app.hemiLight) objectsToExport.push(this.app.hemiLight);
      if (this.app.directionalLight)
        objectsToExport.push(this.app.directionalLight);

      const exportScene = new THREE.Scene();
      objectsToExport.forEach((obj) => exportScene.add(obj.clone()));

      //add room dimensions as metadata to the file.
      if (this.roomDimensions) {
        exportScene.userData.room = this.roomDimensions;
      }

      const options = { binary: true, embedImages: true };
      const projectTitle =
        this.app.uiManager.dom.projectTitle.value.trim() || "scene";
      const finalFilename = projectTitle.toLowerCase().endsWith(".glb")
        ? projectTitle
        : `${projectTitle}.glb`;

      try {
        exporter.parse(
          exportScene,
          (result) => {
            const blob = new Blob([result], {
              type: "application/octet-stream",
            });
            // Resolve the promise with the data the UIManager needs
            resolve({ blob, filename: finalFilename });
          },
          (error) => {
            console.error("GLTFExporter parsing error:", error);
            reject(error);
          },
          options
        );
      } catch (error) {
        console.error("Error during GLTF export preparation:", error);
        reject(error);
      }
    });
  }

  async saveScene(filename) {
    //for export to glb
    this.app.controlsManager.deselectObject(); //deselect any selected object
    await this.app.controlsManager.setCameraView("top");
    const exporter = new GLTFExporter();
    const objectsToExport = []; //gateher all objects to export
    this.selectableObjects.forEach((obj) => objectsToExport.push(obj));
    if (this.floor) objectsToExport.push(this.floor); // `true` for a single, compact .glb file.
    if (this.roof) objectsToExport.push(this.roof); // `true` to pack textures inside the .glb file.
    this.walls.forEach((wall) => objectsToExport.push(wall));
    const options = { binary: true, embedImages: true };
    const exportScene = new THREE.Scene();
    exportScene.name = "MySpaceScene";
    objectsToExport.forEach((obj) => exportScene.add(obj.clone()));

    // We no longer save room dimensions to metadata, as the geometry is the source of truth.

    let finalFilename = (filename || "myspace-scene").trim();
    if (!finalFilename.toLowerCase().endsWith(".glb")) {
      if (finalFilename.toLowerCase().endsWith(".gltf")) {
        finalFilename = finalFilename.slice(0, -5);
      }
      finalFilename += ".glb"; //file logic
    }
    exporter.parse(
      exportScene,
      (result) => {
        //the download logic
        const blob = new Blob([result], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = finalFilename;
        document.body.appendChild(a);
        a.click(); // Programmatically click the link to trigger the download
        document.body.removeChild(a);
        URL.revokeObjectURL(url); //clean up
      },
      (error) => {
        console.error("An error occurred during GLTF export:", error);
      },
      options
    );
  }

  clearScene() {
    //reset the scene to empty state
    this.app.controlsManager.deselectObject();
    this.removePreviewModel();
    // Remove all managed objects from the Three.js scene.
    [...this.selectableObjects, ...this.walls, this.floor, this.roof].forEach(
      (obj) => {
        if (obj) this.app.scene.remove(obj);
      }
    );
    // Reset all tracking arrays and properties.
    this.selectableObjects = [];
    this.walls = [];
    this.floor = null;
    this.roof = null;
    this.app.undoManager.clear(); // Clear the undo/redo history also
    this.roomDimensions = null;
  }

  removeSelectableObject(object) {
    const index = this.selectableObjects.indexOf(object);
    if (index > -1) {
      this.selectableObjects.splice(index, 1);
    }
  }

  resetObjectTexture(object) {
    if (!object || !object.material) return;

    if (object.userData.isWall) {
      // Revert to a clone of the default wall material
      object.material = this.defaultWallMaterial.clone();
    } else if (object.userData.isFloor) {
      // Re-create the default floor material
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xb6b5b4,
        roughness: 0.8,
      });
      object.material = floorMaterial;
    }
    // After resetting, we need to refresh the UI to reflect the change
    this.app.uiManager.updateSurfaceInspectorUI(object);
  }

  applyTextureAtDropPoint(textureUrl, dropEvent) {
    // It applies a texture to an object (like a wall or floor) at the location of a mouse drop event.
    const rect = this.app.renderer.domElement.getBoundingClientRect(); // Get the position and size of the canvas element in the browser window.
    this.mouse.x = ((dropEvent.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((dropEvent.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.app.camera);
    const objectsToIntersect = [...this.walls];
    if (this.floor) {
      objectsToIntersect.push(this.floor);
    }

    // Perform the raycast to find all objects that intersect with the ray.
    // The 'false' argument means it will not check descendants of the objects in the list.
    const intersects = this.raycaster.intersectObjects(
      objectsToIntersect,
      false
    );

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      // Call the method to apply the specified texture to the object that was hit.
      this.app.audioManager.playDropSound();

      this.applyTextureToObject(intersectedObject, textureUrl);
    }
  }

  applyTextureToWall(wall, textureUrl) {
    //can ignore this method
    this.applyTextureToObject(wall, textureUrl);
  }

  applyTextureToObject(object, textureUrl) {
    //  for loading a texture and applying it to a 3D object's material.
    if (!object || !object.isMesh) return;

    this.textureLoader.load(
      textureUrl,
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping; // Repeat the texture in both directions
        texture.wrapT = THREE.RepeatWrapping; // Repeat the texture in both directions
        texture.colorSpace = THREE.SRGBColorSpace; // Set the color space to SRGB for more accurate color rendering.

        // Initialize texture repeat values. This controls how many times the texture tiles across the surface.
        let repeatX = 1;
        let repeatY = 1;

        // Use a bounding box to determine the size of the object for correct texture tiling.
        const geometryBox = new THREE.Box3().setFromObject(object);
        const size = geometryBox.getSize(new THREE.Vector3());

        if (object.userData.isWall) {
          //wall texture
          const wallNormal = object.userData.normal;
          // If the wall faces mostly along the Z-axis (front/back walls)
          if (Math.abs(wallNormal.z) > 0.9) {
            repeatX = size.x;
            repeatY = size.y;
          }
          // Otherwise, it's a side wall (left/right) facing the X-axis
          else {
            repeatX = size.z; // Use DEPTH for side walls
            repeatY = size.y;
          }
        } else if (object.userData.isFloor) {
          // For the floor, use its width and depth for tiling.
          repeatX = size.x;
          repeatY = size.z;
        }
        texture.repeat.set(repeatX, repeatY);

        const newMaterial = object.material.clone();
        newMaterial.map = texture;
        newMaterial.color.set(0xffffff);
        newMaterial.needsUpdate = true;

        object.material = newMaterial; // Replace the object's old material with the new one we just created.
      },
      undefined,
      (error) => {
        console.error("An error occurred loading the texture:", error);
      }
    );
  }

  generateInitialRoom() {
    // Determine which unit tab is currently active
    const meterTab = document.getElementById("meter-tab");
    const isFeet = meterTab
      ? meterTab.getAttribute("aria-selected") !== "true"
      : false;

    let length, width, height;

    if (isFeet) {
      // Get values from the 'Feet' inputs using their new, unique IDs
      length =
        parseFloat(document.getElementById("GetFloorLengthFeet").value) || 15;
      width =
        parseFloat(document.getElementById("GetFloorWidthFeet").value) || 15;
      height =
        parseFloat(document.getElementById("GetWallHeightFeet").value) || 6;

      // Convert feet to meters for the 3D scene
      const FEET_TO_METERS = 0.3048;
      length *= FEET_TO_METERS;
      width *= FEET_TO_METERS;
      height *= FEET_TO_METERS;
    } else {
      // Get values from the 'Meters' inputs using their new, unique IDs
      length =
        parseFloat(document.getElementById("GetFloorLengthMeters").value) || 5;
      width =
        parseFloat(document.getElementById("GetFloorWidthMeters").value) || 5;
      height =
        parseFloat(document.getElementById("GetWallHeightMeters").value) || 2;
    }

    // Create the room with the calculated dimensions (always in meters)
    this.createRoom(width, height, length);
    this.app.controlsManager.orbitControls.target.set(0, height / 2, 0);
  }

  createRoom(sizeX, sizeY, sizeZ) {
    this.clearScene();
    this.roomDimensions = { width: sizeX, height: sizeY, length: sizeZ };
    const wallThickness = 0.2;
    const ceilingFloorThickness = 0.1;
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xb6b5b4,
      roughness: 0.8,
    });

    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      roughness: 0.8,
      transparent: true,
      opacity: 1.0,
    });
    const floorGeometry = new THREE.BoxGeometry(
      sizeX,
      ceilingFloorThickness,
      sizeZ
    );
    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor.position.y = -ceilingFloorThickness / 2;
    this.floor.receiveShadow = true;
    this.floor.userData = { isFloor: true, isSelectable: true };
    this.app.scene.add(this.floor);

    const roofGeometry = new THREE.BoxGeometry(
      sizeX,
      ceilingFloorThickness,
      sizeZ
    );
    this.roof = new THREE.Mesh(roofGeometry, roofMaterial);
    this.roof.position.y = sizeY + ceilingFloorThickness / 2; // position the roof above the floor
    this.roof.userData.isRoof = true;
    this.app.scene.add(this.roof);
    const wallHeight = sizeY; // Prepare variables for creating the walls.
    const halfWallHeight = wallHeight / 2;

    // Use a data-driven approach to define the properties of the four walls. This avoids repetitive code
    const wallsData = [
      {
        // wall 1 (back wall)
        geo: new THREE.BoxGeometry(sizeX, wallHeight, wallThickness),
        pos: new THREE.Vector3(
          0,
          halfWallHeight,
          sizeZ / 2 - wallThickness / 2
        ),
        norm: new THREE.Vector3(0, 0, -1),
      },
      {
        // wall 2 (front wall)
        geo: new THREE.BoxGeometry(sizeX, wallHeight, wallThickness),
        pos: new THREE.Vector3(
          0,
          halfWallHeight,
          -sizeZ / 2 + wallThickness / 2
        ),
        norm: new THREE.Vector3(0, 0, 1),
      },
      {
        // wall 3 (left)
        geo: new THREE.BoxGeometry(wallThickness, wallHeight, sizeZ),
        pos: new THREE.Vector3(
          -sizeX / 2 + wallThickness / 2,
          halfWallHeight,
          0
        ),
        norm: new THREE.Vector3(1, 0, 0),
      },
      {
        // wall 3 (right)
        geo: new THREE.BoxGeometry(wallThickness, wallHeight, sizeZ),
        pos: new THREE.Vector3(
          sizeX / 2 - wallThickness / 2,
          halfWallHeight,
          0
        ),
        norm: new THREE.Vector3(-1, 0, 0),
      },
    ];
    // Loop through the wall data to create each wall mesh
    wallsData.forEach((data) => {
      const wall = new THREE.Mesh(data.geo, this.defaultWallMaterial.clone());
      wall.position.copy(data.pos);
      wall.userData = { isWall: true, isSelectable: true, normal: data.norm };
      wall.castShadow = false;
      wall.receiveShadow = false;
      this.walls.push(wall);
      this.app.scene.add(wall);
    });
  }

  //  based on the camera's position, allow to see inside the room from above
  updateRoofVisibility() {
    if (!this.roof || !this.roomDimensions) return;
    const camPos = this.app.camera.position;
    const dims = this.roomDimensions;
    const isInside =
      camPos.x > -dims.width / 2 &&
      camPos.x < dims.width / 2 &&
      camPos.y > 0 &&
      camPos.y < dims.height &&
      camPos.z > -dims.length / 2 &&
      camPos.z < dims.length / 2;
    const targetOpacity = isInside ? 1.0 : 0.0;
    this.roof.material.opacity +=
      // Set the target opacity: If outside, the roof should be transparent (0.0). If inside, it should be opaque (1.0).
      (targetOpacity - this.roof.material.opacity) * 0.1;
    this.roof.visible = this.roof.material.opacity > 0.01;
  }

  // makes walls transparent when they are between the camera and the center of the room
  updateWallVisibility() {
    if (!this.app.camera) return;
    const cameraToWallVector = new THREE.Vector3(); // Create a single Vector3 to reuse in the loop, which is more memory efficient
    this.walls.forEach((wall) => {
      cameraToWallVector // Calculate the direction vector from the camera to the wall's center.
        .subVectors(wall.position, this.app.camera.position)
        .normalize();
      // If dot < 0, the camera is on the "inside" of the wall, looking at its front face.
      const dot = cameraToWallVector.dot(wall.userData.normal);
      wall.visible = dot <= 0.1; // If the dot product is negative, the wall is facing the camera.
    });
  }
}
