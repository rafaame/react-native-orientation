var OrientationModule = require('react-native').NativeModules.Orientation;
var DeviceEventEmitter = require('react-native').DeviceEventEmitter;

var listeners = {};
var orientationDidChangeEvent = "orientationDidChange";
var specificOrientationDidChangeEvent = "specificOrientationDidChange";

var id = 0;
var META = '__listener_id';

function getKey(listener){
  if (!listener.hasOwnProperty(META)){
    if (!Object.isExtensible(listener)) {
      return 'F';
    }
    Object.defineProperty(listener, META, {
      value: 'L' + ++id,
    });
  }
  return listener[META];
};

module.exports = {
  getOrientation(cb) {
    OrientationModule.getOrientation((error,orientation) =>{
      cb(error, orientation);
    });
  },
  getSpecificOrientation(cb) {
    OrientationModule.getSpecificOrientation((error,orientation) =>{
      cb(error, orientation);
    });
  },
  lockToPortrait() {
    OrientationModule.lockToPortrait();
  },
  lockToLandscape() {
    OrientationModule.lockToLandscape();
  },
  lockToLandscapeRight() {
    OrientationModule.lockToLandscapeRight();
  },
  lockToLandscapeLeft() {
    OrientationModule.lockToLandscapeLeft();
  },
  unlockAllOrientations() {
    OrientationModule.unlockAllOrientations();
  },
  addOrientationListener(cb) {
    var key = getKey(cb);
    listeners[key] = DeviceEventEmitter.addListener(orientationDidChangeEvent,
      (body) => {
        cb(body.orientation);
      });
  },
  removeOrientationListener(cb) {
    var key = getKey(cb);
    if (!listeners[key]) {
      return;
    }
    listeners[key].remove();
    listeners[key] = null;
  },
  addSpecificOrientationListener(cb) {
    var key = getKey(cb);
    listeners[key] = DeviceEventEmitter.addListener(specificOrientationDidChangeEvent,
      (body) => {
        cb(body.specificOrientation);
      });
  },
  removeSpecificOrientationListener(cb) {
    var key = getKey(cb);
    if (!listeners[key]) {
      return;
    }
    listeners[key].remove();
    listeners[key] = null;
  },
  getInitialOrientation() {
    return OrientationModule.initialOrientation;
  }
}
