package com.aigency

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class PdfToImagePackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        // PdfToImageModule'u burada oluşturarak geri döndür
        return listOf(PdfToImageModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        // UI bileşeni oluşturmadığımız için boş döndürüyoruz
        return emptyList()
    }
}
