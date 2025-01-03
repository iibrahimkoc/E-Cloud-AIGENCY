package com.aigency

import android.content.ContentResolver
import android.graphics.Bitmap
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.os.ParcelFileDescriptor
import com.facebook.react.bridge.*
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import android.util.Log

class PdfToImageModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "PdfToImageModule"
    }

    @ReactMethod
    fun convertPdfToImages(pdfPath: String, promise: Promise) {
        try {
            val images = WritableNativeArray() // JSON ile uyumlu bir yapı

            // Eğer pdfPath bir content URI ise
            val uri = Uri.parse(pdfPath)
            val contentResolver: ContentResolver = reactApplicationContext.contentResolver

            Log.d("PdfToImageModule", "Checkpoint 1 reached")

            // Geçici dizin
            val outputDir = reactApplicationContext.cacheDir

            // Eski dosyaları temizle
            clearOldFiles(outputDir)

            // Geçici bir dosya oluştur
            val tempFile = File(outputDir, "temp1.pdf")

            // Eğer mevcutsa temp.pdf dosyasını sil
            if (tempFile.exists()) {
                tempFile.delete()
            }

            val inputStream: InputStream? = contentResolver.openInputStream(uri)

            Log.d("PdfToImageModule", "Checkpoint 2 reached")

            // InputStream'den geçici dosyaya yaz
            if (inputStream != null) {
                FileOutputStream(tempFile).use { outputStream ->
                    inputStream.copyTo(outputStream)
                }
                inputStream.close()  // InputStream'i kapat
            } else {
                promise.reject("INPUT_STREAM_ERROR", "InputStream açılırken bir hata oluştu.")
                return
            }

            Log.d("PdfToImageModule", "Checkpoint 3 reached")

            // Geçici dosyayı PdfRenderer ile aç
            if (!tempFile.exists()) {
                promise.reject("TEMP_FILE_ERROR", "Geçici dosya oluşturulamadı.")
                return
            }

            Log.d("PdfToImageModule", "Checkpoint 4 reached")

            val parcelFileDescriptor = ParcelFileDescriptor.open(tempFile, ParcelFileDescriptor.MODE_READ_ONLY)
            val pdfRenderer = PdfRenderer(parcelFileDescriptor)

            Log.d("PdfToImageModule", "Checkpoint 5 reached")

            for (i in 0 until pdfRenderer.pageCount) {
                val page = pdfRenderer.openPage(i)
                val bitmap = Bitmap.createBitmap(page.width, page.height, Bitmap.Config.ARGB_8888)
                page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)

                // Bitmap'i dosyaya kaydet ve yolunu ekle
                val imageFile = File(outputDir, "image_$i.png")
                FileOutputStream(imageFile).use { fos ->
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, fos)
                }
                images.pushString(imageFile.absolutePath)

                page.close()
            }

            Log.d("PdfToImageModule", "Checkpoint 6 reached")

            pdfRenderer.close()
            parcelFileDescriptor.close()

            promise.resolve(images)

        } catch (e: Exception) {
            promise.reject("PDF_CONVERSION_ERROR", "PDF'yi dönüştürme başarısız oldu: ${e.message}", e)
        }
    }

    // Geçici dizindeki önceki PDF ve resim dosyalarını sil
    private fun clearOldFiles(outputDir: File) {
        outputDir.listFiles()?.forEach { file ->
            if (file.name.startsWith("image_") && file.name.endsWith(".png") || file.name == "temp.pdf") {
                file.delete()
            }
        }
    }
}
