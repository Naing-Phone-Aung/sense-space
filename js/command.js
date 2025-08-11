import * as THREE from "three";

export class UndoManager {
  constructor() {
    this.undoStack = []; //save it to the undo history
    this.redoStack = []; //clear redo history
  }

  execute(command) {
    //run the command
    command.execute();
    this.undoStack.push(command);
    this.redoStack.length = 0;
  }

  undo() {
    const command = this.undoStack.pop();
    if (command) {
      command.undo(); //run the command's action
      this.redoStack.push(command);
    }
  }

  redo() {
    const command = this.redoStack.pop();
    if (command) {
      command.execute(); //run the command's action
      this.undoStack.push(command);
    }
  }

  clear() {
    //clear the history when refresh
    this.undoStack.length = 0;
    this.redoStack.length = 0;
  }
}

export class Command {
  //base class for all commands
  constructor(app) {
    this.app = app;
  }
  execute() {}
  undo() {}
}

export class SetLockCommand extends Command {
  // Command for locking/unlocking an object
  constructor(app, object, newLockedState) {
    super(app);
    this.object = object;
    this.newLockedState = newLockedState;
    // Store the state before this command was executed
    this.oldLockedState = object.userData.isLocked || false;
  }

  execute() {
    // Apply the new locked state
    this.object.userData.isLocked = this.newLockedState;

    // Tell the UI and Controls managers to update based on this change
    this.app.uiManager.updateLockStateUI(this.object);
  }

  undo() {
    // Revert to the old locked state
    this.object.userData.isLocked = this.oldLockedState;
    // Tell the UI and Controls managers to update based on the reverted state
    this.app.uiManager.updateLockStateUI(this.object);
  }
}

export class AddObjectCommand extends Command {
  //add object to the scene
  constructor(app, object) {
    super(app);
    this.object = object; //the 3d object add
  }
  execute() {
    //add object to the scene that can be selected
    this.app.scene.add(this.object);
    this.app.sceneManager.selectableObjects.push(this.object);
  }
  undo() {
    //if the object being removed is currenly selected, run deselected function first
    if (this.app.controlsManager.transformControls.object === this.object) {
      this.app.controlsManager.deselectObject();
    }
    this.app.sceneManager.removeSelectableObject(this.object);
    this.app.scene.remove(this.object);
  }
}

export class RemoveObjectCommand extends AddObjectCommand {
  //for delete obejct with delete shortcut
  execute() {
    super.undo();
  }
  undo() {
    super.execute();
  }
}

export class TransformCommand extends Command {
  //for change object position, rotation and scale
  constructor(app, object, oldTransform, newTransform) {
    super(app);
    this.object = object;
    this.oldTransform = oldTransform;
    this.newTransform = newTransform;
  }
  execute() {
    //for new transform properties of the object
    this.object.position.copy(this.newTransform.position);
    this.object.quaternion.copy(this.newTransform.quaternion);
    this.object.scale.copy(this.newTransform.scale);
    this.app.uiManager.updateInspector(this.object); //once the object pos is changed, update the inspector
  }
  undo() {
    //reverts the object transform to the prev state
    this.object.position.copy(this.oldTransform.position);
    this.object.quaternion.copy(this.oldTransform.quaternion);
    this.object.scale.copy(this.oldTransform.scale);
    this.app.uiManager.updateInspector(this.object); //once the object pos is changed, update the inspector
  }
}

export class ChangeColorCommand extends Command {
  //for changing an object's material color
  constructor(app, object, oldColor, newColor) {
    super(app);
    this.object = object;
    this.oldColor = oldColor;
    this.newColor = newColor;
  }
  execute() {
    //apply the new color
    this.object.material.color.copy(this.newColor);
    //if the object is currently selected, update the inspector UI
    if (this.app.uiManager.activeObjectForInspector === this.object) {
      this.app.uiManager.updateSurfaceInspectorUI(this.object);
    }
  }
  undo() {
    //revert to the old color
    this.object.material.color.copy(this.oldColor);
    //if the object is currently selected, update the inspector UI
    if (this.app.uiManager.activeObjectForInspector === this.object) {
      this.app.uiManager.updateSurfaceInspectorUI(this.object);
    }
  }
}

export class ChangeLightColorCommand extends Command {
  //  for changing a light's color property
  constructor(app, light, propertyName, oldColor, newColor) {
    super(app);
    this.light = light;
    this.propertyName = propertyName; //  property to change, e.g., "color" or "groundColor".
    this.oldColor = oldColor;
    this.newColor = newColor;
  }

  execute() { // do -> apply the new color and update the UI
    this.light[this.propertyName].copy(this.newColor);
    this.app.uiManager.updateLightingInspectorUI();
  }

  undo() {
    // Revert to the old color
    this.light[this.propertyName].copy(this.oldColor);
    // Update the UI to reflect the change
    this.app.uiManager.updateLightingInspectorUI();
  }
}
