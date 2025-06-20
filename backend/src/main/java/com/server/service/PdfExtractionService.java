package com.server.service;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@Service
public class PdfExtractionService {

    // Path to the tessdata folder (not the Tesseract binary)
    @Value("${tesseract.datapath}")
    private String tesseractDataPath;

    @Value("${tesseract.language:eng}") // Default to English
    private String tesseractLanguage;

    /**
     * Extracts text from a PDF file, combining selectable text and OCR for image-based text.
     * @param pdfFile The PDF file to extract text from.
     * @return The extracted text, or an error message if extraction fails.
     */
    public String extractTextFromPdf(File pdfFile) {
        StringBuilder extractedText = new StringBuilder();

        try (PDDocument document = PDDocument.load(pdfFile)) {
            // 1. Extract selectable text
            PDFTextStripper pdfStripper = new PDFTextStripper();
            extractedText.append(pdfStripper.getText(document));

            // 2. OCR for image-based text
            ITesseract tesseract = new Tesseract();
            tesseract.setDatapath(tesseractDataPath);   // Path to 'tessdata' folder
            tesseract.setLanguage(tesseractLanguage);   // Set language, e.g., "eng"

            PDFRenderer pdfRenderer = new PDFRenderer(document);
            for (int page = 0; page < document.getNumberOfPages(); ++page) {
                BufferedImage image = pdfRenderer.renderImageWithDPI(page, 300); // 300 DPI = good OCR quality
                try {
                    String ocrText = tesseract.doOCR(image);
                    extractedText.append("\n").append(ocrText);
                } catch (TesseractException e) {
                    System.err.println("OCR failed on page " + page + ": " + e.getMessage());
                }
            }

            return extractedText.toString();

        } catch (IOException e) {
            return "Error: Failed to read PDF: " + e.getMessage();
        } catch (Exception e) {
            return "Unexpected error during PDF extraction: " + e.getMessage();
        }
    }
}
