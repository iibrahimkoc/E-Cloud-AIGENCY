package com.aigency

import android.graphics.Bitmap
import android.graphics.pdf.PdfRenderer
import android.os.ParcelFileDescriptor
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.FileOutputStream

 class PdfToImageConverter {

     fun convertPdfToImages(pdfPath: String): List<Bitmap> {
         val images = mutableListOf<Bitmap>()
         val file = File(pdfPath)
         val parcelFileDescriptor = ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY)
         val pdfRenderer = PdfRenderer(parcelFileDescriptor)

         for (i in 0 until pdfRenderer.pageCount) {
             val page = pdfRenderer.openPage(i)
             val bitmap = Bitmap.createBitmap(page.width, page.height, Bitmap.Config.ARGB_8888)
             page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
             images.add(bitmap)
             page.close()
         }

         pdfRenderer.close()
         parcelFileDescriptor.close()

         return images
     }
 }
