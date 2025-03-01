/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateModuleCpp.js
 */

#include "rncamerarollJSI.h"

namespace facebook::react {

static jsi::Value __hostFunction_NativeCameraRollModuleCxxSpecJSI_saveToCameraRoll(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeCameraRollModuleCxxSpecJSI *>(&turboModule)->saveToCameraRoll(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asString(rt),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asObject(rt)
  );
}
static jsi::Value __hostFunction_NativeCameraRollModuleCxxSpecJSI_getPhotos(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeCameraRollModuleCxxSpecJSI *>(&turboModule)->getPhotos(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asObject(rt)
  );
}
static jsi::Value __hostFunction_NativeCameraRollModuleCxxSpecJSI_getAlbums(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeCameraRollModuleCxxSpecJSI *>(&turboModule)->getAlbums(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asObject(rt)
  );
}
static jsi::Value __hostFunction_NativeCameraRollModuleCxxSpecJSI_deletePhotos(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeCameraRollModuleCxxSpecJSI *>(&turboModule)->deletePhotos(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asObject(rt).asArray(rt)
  );
}
static jsi::Value __hostFunction_NativeCameraRollModuleCxxSpecJSI_getPhotoByInternalID(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeCameraRollModuleCxxSpecJSI *>(&turboModule)->getPhotoByInternalID(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asString(rt),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asObject(rt)
  );
}
static jsi::Value __hostFunction_NativeCameraRollModuleCxxSpecJSI_getPhotoThumbnail(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeCameraRollModuleCxxSpecJSI *>(&turboModule)->getPhotoThumbnail(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asString(rt),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asObject(rt)
  );
}
static jsi::Value __hostFunction_NativeCameraRollModuleCxxSpecJSI_addListener(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeCameraRollModuleCxxSpecJSI *>(&turboModule)->addListener(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asString(rt)
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeCameraRollModuleCxxSpecJSI_removeListeners(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeCameraRollModuleCxxSpecJSI *>(&turboModule)->removeListeners(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asNumber()
  );
  return jsi::Value::undefined();
}

NativeCameraRollModuleCxxSpecJSI::NativeCameraRollModuleCxxSpecJSI(std::shared_ptr<CallInvoker> jsInvoker)
  : TurboModule("RNCCameraRoll", jsInvoker) {
  methodMap_["saveToCameraRoll"] = MethodMetadata {2, __hostFunction_NativeCameraRollModuleCxxSpecJSI_saveToCameraRoll};
  methodMap_["getPhotos"] = MethodMetadata {1, __hostFunction_NativeCameraRollModuleCxxSpecJSI_getPhotos};
  methodMap_["getAlbums"] = MethodMetadata {1, __hostFunction_NativeCameraRollModuleCxxSpecJSI_getAlbums};
  methodMap_["deletePhotos"] = MethodMetadata {1, __hostFunction_NativeCameraRollModuleCxxSpecJSI_deletePhotos};
  methodMap_["getPhotoByInternalID"] = MethodMetadata {2, __hostFunction_NativeCameraRollModuleCxxSpecJSI_getPhotoByInternalID};
  methodMap_["getPhotoThumbnail"] = MethodMetadata {2, __hostFunction_NativeCameraRollModuleCxxSpecJSI_getPhotoThumbnail};
  methodMap_["addListener"] = MethodMetadata {1, __hostFunction_NativeCameraRollModuleCxxSpecJSI_addListener};
  methodMap_["removeListeners"] = MethodMetadata {1, __hostFunction_NativeCameraRollModuleCxxSpecJSI_removeListeners};
}
static jsi::Value __hostFunction_NativeCameraRollPermissionModuleCxxSpecJSI_checkPermission(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeCameraRollPermissionModuleCxxSpecJSI *>(&turboModule)->checkPermission(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asString(rt)
  );
}
static jsi::Value __hostFunction_NativeCameraRollPermissionModuleCxxSpecJSI_requestReadWritePermission(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeCameraRollPermissionModuleCxxSpecJSI *>(&turboModule)->requestReadWritePermission(
    rt
  );
}
static jsi::Value __hostFunction_NativeCameraRollPermissionModuleCxxSpecJSI_requestAddOnlyPermission(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeCameraRollPermissionModuleCxxSpecJSI *>(&turboModule)->requestAddOnlyPermission(
    rt
  );
}
static jsi::Value __hostFunction_NativeCameraRollPermissionModuleCxxSpecJSI_refreshPhotoSelection(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeCameraRollPermissionModuleCxxSpecJSI *>(&turboModule)->refreshPhotoSelection(
    rt
  );
}
static jsi::Value __hostFunction_NativeCameraRollPermissionModuleCxxSpecJSI_addListener(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeCameraRollPermissionModuleCxxSpecJSI *>(&turboModule)->addListener(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asString(rt)
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeCameraRollPermissionModuleCxxSpecJSI_removeListeners(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeCameraRollPermissionModuleCxxSpecJSI *>(&turboModule)->removeListeners(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asNumber()
  );
  return jsi::Value::undefined();
}

NativeCameraRollPermissionModuleCxxSpecJSI::NativeCameraRollPermissionModuleCxxSpecJSI(std::shared_ptr<CallInvoker> jsInvoker)
  : TurboModule("RNCCameraRollPermission", jsInvoker) {
  methodMap_["checkPermission"] = MethodMetadata {1, __hostFunction_NativeCameraRollPermissionModuleCxxSpecJSI_checkPermission};
  methodMap_["requestReadWritePermission"] = MethodMetadata {0, __hostFunction_NativeCameraRollPermissionModuleCxxSpecJSI_requestReadWritePermission};
  methodMap_["requestAddOnlyPermission"] = MethodMetadata {0, __hostFunction_NativeCameraRollPermissionModuleCxxSpecJSI_requestAddOnlyPermission};
  methodMap_["refreshPhotoSelection"] = MethodMetadata {0, __hostFunction_NativeCameraRollPermissionModuleCxxSpecJSI_refreshPhotoSelection};
  methodMap_["addListener"] = MethodMetadata {1, __hostFunction_NativeCameraRollPermissionModuleCxxSpecJSI_addListener};
  methodMap_["removeListeners"] = MethodMetadata {1, __hostFunction_NativeCameraRollPermissionModuleCxxSpecJSI_removeListeners};
}


} // namespace facebook::react
