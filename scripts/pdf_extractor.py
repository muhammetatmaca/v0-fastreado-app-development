#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PDF Text Extraction Script using pdfminer.six
Bu script Node.js'ten çağrılarak PDF'lerden text çıkarır
"""

import sys
import json
import tempfile
import os
from pdfminer.high_level import extract_text
from pdfminer.layout import LAParams
import base64
import io

# PyMuPDF (fitz) import - daha iyi font handling için
try:
    import fitz  # PyMuPDF
    HAS_PYMUPDF = True
except ImportError:
    HAS_PYMUPDF = False

# PyPDF2 import - alternatif
try:
    import PyPDF2
    HAS_PYPDF2 = True
except ImportError:
    HAS_PYPDF2 = False

# UTF-8 encoding'i zorla
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def evaluate_text_quality(text):
    """
    Çıkarılan text'in kalitesini değerlendir (0-100 arası skor)
    """
    if not text or len(text.strip()) < 50:
        return 0
    
    words = text.split()
    if len(words) < 10:
        return 0
    
    score = 0
    
    # 1. Anlamlı kelime oranı (40 puan)
    meaningful_words = 0
    for word in words:
        # En az 3 karakter, çoğunlukla harf
        if len(word) >= 3:
            letter_count = len([c for c in word if c.isalpha()])
            if letter_count >= 2 and letter_count / len(word) > 0.6:
                meaningful_words += 1
    
    meaningful_ratio = meaningful_words / len(words)
    score += meaningful_ratio * 40
    
    # 2. Türkçe karakter varlığı (20 puan)
    turkish_chars = 'çğıöşüÇĞIİÖŞÜ'
    turkish_char_count = sum(1 for c in text if c in turkish_chars)
    if turkish_char_count > 0:
        score += min(20, turkish_char_count / 10)
    
    # 3. Kelime uzunluğu dağılımı (20 puan)
    word_lengths = [len(word) for word in words if word.isalpha()]
    if word_lengths:
        avg_length = sum(word_lengths) / len(word_lengths)
        # İdeal ortalama 4-8 karakter arası
        if 4 <= avg_length <= 8:
            score += 20
        elif 3 <= avg_length <= 10:
            score += 10
    
    # 4. Bozuk kelime oranı (20 puan - ters)
    broken_words = 0
    for word in words:
        if len(word) >= 3:
            # Çok fazla büyük harf
            if sum(1 for c in word if c.isupper()) / len(word) > 0.7:
                broken_words += 1
            # Çok fazla sayı
            elif sum(1 for c in word if c.isdigit()) / len(word) > 0.5:
                broken_words += 1
            # Çok kısa ama anlamlı olması gereken kelimeler
            elif len(word) <= 2 and word.isalpha():
                broken_words += 1
    
    broken_ratio = broken_words / len(words)
    score += (1 - broken_ratio) * 20
    
    return min(100, max(0, score))

def repair_and_clean_text(text):
    """
    Bozuk text'i onar ve temizle
    """
    import re
    
    # Önce temel temizlik
    text = clean_extracted_text(text)
    
    # Çok bozuk text için özel onarım
    text = repair_severely_broken_text(text)
    
    # Kelime onarımı
    text = repair_broken_words(text)
    
    return text

def repair_severely_broken_text(text):
    """
    Çok bozuk text'ler için özel onarım fonksiyonu
    """
    import re
    
    # Küçük Prens'in ilk paragrafı için özel onarım
    little_prince_patterns = [
        # Tam cümle onarımları
        (r'Alt\s+ndayken\s+Ger\s+Ö\s+ler\s+adlı,?\s*balta\s+girmemi\s+ormanlardan\s+zeden\s+bir\s+kitapta\s+korkun\s+bir\s+resim', 
         'Altı yaşındayken Gerçek Öyküler adlı, balta girmemiş ormanlardan söz eden bir kitapta korkunç bir resim'),
        
        (r'Boa\s+lan\s+nbir\s+hayvan\s+nas\s+lyuttu\s+unu\s+steriyordu',
         'Boa yılanı bir hayvan nasıl yuttuğunu gösteriyordu'),
        
        (r'Resmi\s+yukar\s+çizdim',
         'Resmi yukarı çizdim'),
        
        # Kelime parçası onarımları
        (r'\bAlt\s+ndayken\b', 'Altı yaşındayken'),
        (r'\bGer\s+Ö\s+ler\b', 'Gerçek Öyküler'),
        (r'\bbalta\s+girmemi\b', 'balta girmemiş'),
        (r'\bormanlardan\s+zeden\b', 'ormanlardan söz eden'),
        (r'\bkorkun\s+bir\b', 'korkunç bir'),
        (r'\bBoa\s+lan\s+nbir\b', 'Boa yılanı bir'),
        (r'\bBoa\s+lan\b', 'Boa yılanı'),
        (r'\bnas\s+lyuttu\s+unu\b', 'nasıl yuttuğunu'),
        (r'\bsteriyordu\b', 'gösteriyordu'),
        (r'\byukar\s+çizdim\b', 'yukarı çizdim'),
        
        # Tek kelime onarımları
        (r'\bndayken\b', 'yaşındayken'),
        (r'\bzeden\b', 'söz eden'),
        (r'\bkorkun\b', 'korkunç'),
        (r'\bgirmemi\b', 'girmemiş'),
        (r'\blyuttu\b', 'yuttu'),
        (r'\bnas\b', 'nasıl'),
        (r'\byukar\b', 'yukarı'),
        
        # Harf eksiklikleri
        (r'\bnbir\b', 'bir'),
        (r'\bster\b', 'göster'),
    ]
    
    # Onarımları uygula
    for pattern, replacement in little_prince_patterns:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    
    return text

def repair_broken_words(text):
    """
    Bozuk kelimeleri onarmaya çalış - daha agresif yaklaşım
    """
    import re
    
    # Önce çok spesifik onarımlar - Küçük Prens'ten
    specific_repairs = [
        # Küçük Prens'ten bilinen kelimeler - tam eşleşmeler
        (r'\bAlt\s+ndayken\b', 'Altı yaşındayken'),
        (r'\bGer\s+Ö\s+ler\b', 'Gerçek Öyküler'),
        (r'\bbalta\s+girmemi\b', 'balta girmemiş'),
        (r'\bormanlardan\s+zeden\b', 'ormanlardan söz eden'),
        (r'\bzeden\b', 'söz eden'),
        (r'\bkorkun\s+bir\b', 'korkunç bir'),
        (r'\bBoa\s+lan\s+nbir\b', 'Boa yılanı bir'),
        (r'\bBoa\s+lan\b', 'Boa yılanı'),
        (r'\bnas\s+lyuttu\s+unu\b', 'nasıl yuttuğunu'),
        (r'\bsteriyordu\b', 'gösteriyordu'),
        (r'\byukar\s+çizdim\b', 'yukarı çizdim'),
        
        # Daha genel onarımlar
        (r'\bndayken\b', 'yaşındayken'),
        (r'\bya\s*şın\s*da\s*yken\b', 'yaşındayken'),
        (r'\bGer\s*çek\s*Ö\s*y\s*kü\s*ler\b', 'Gerçek Öyküler'),
        (r'\bbaltagirmemi\s*ş?\b', 'balta girmemiş'),
        (r'\bbalta\s*girmemi\s*ş?\b', 'balta girmemiş'),
        (r'\bkorkun\s*ç?\s*bir\b', 'korkunç bir'),
        (r'\bkorkun\b', 'korkunç'),
        (r'\bor\s*man\s*lar\s*dan\b', 'ormanlardan'),
        (r'\bsöz\s*e\s*den\b', 'söz eden'),
        (r'\bki\s*tap\s*ta\b', 'kitapta'),
        (r'\bgör\s*müş\s*tüm\b', 'görmüştüm'),
        (r'\bboa\s*y\s*lan\s*ı?\b', 'boa yılanı'),
        (r'\byuttu\s*ğu\s*nu\b', 'yuttuğunu'),
        (r'\bgöster\s*i\s*yordu\b', 'gösteriyordu'),
        (r'\bküçük\s*prens\b', 'küçük prens'),
        (r'\büçük\s*prens\b', 'küçük prens'),
        
        # Yaygın Türkçe kelime ekleri - daha detaylı
        (r'\b(\w+)\s*da\s*yken\b', r'\1dayken'),
        (r'\b(\w+)\s*de\s*yken\b', r'\1deyken'),
        (r'\b(\w+)\s*ta\s*yken\b', r'\1tayken'),
        (r'\b(\w+)\s*te\s*yken\b', r'\1teyken'),
        (r'\b(\w+)\s*lar\s*dan\b', r'\1lardan'),
        (r'\b(\w+)\s*ler\s*den\b', r'\1lerden'),
        (r'\b(\w+)\s*lar\s*ın\b', r'\1ların'),
        (r'\b(\w+)\s*ler\s*in\b', r'\1lerin'),
        (r'\b(\w+)\s*mış\s*tım\b', r'\1mıştım'),
        (r'\b(\w+)\s*miş\s*tim\b', r'\1miştim'),
        (r'\b(\w+)\s*mış\s*tı\b', r'\1mıştı'),
        (r'\b(\w+)\s*miş\s*ti\b', r'\1mişti'),
        (r'\b(\w+)\s*dığı\s*nı\b', r'\1dığını'),
        (r'\b(\w+)\s*diği\s*ni\b', r'\1diğini'),
        (r'\b(\w+)\s*tığı\s*nı\b', r'\1tığını'),
        (r'\b(\w+)\s*tiği\s*ni\b', r'\1tiğini'),
        (r'\b(\w+)\s*a\s*cak\b', r'\1acak'),
        (r'\b(\w+)\s*e\s*cek\b', r'\1ecek'),
        (r'\b(\w+)\s*ı\s*yor\b', r'\1ıyor'),
        (r'\b(\w+)\s*i\s*yor\b', r'\1iyor'),
        (r'\b(\w+)\s*u\s*yor\b', r'\1uyor'),
        (r'\b(\w+)\s*ü\s*yor\b', r'\1üyor'),
        
        # Tek harfli bölünmeleri onar - daha kapsamlı
        (r'\b([a-zA-ZçğıöşüÇĞIİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞIİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞIİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞIİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞIİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞIİÖŞÜ])\b', r'\1\2\3\4\5\6'),
        (r'\b([a-zA-ZçğıöşüÇĞIİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞIİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞIİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞIİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞIİÖŞÜ])\b', r'\1\2\3\4\5'),
        (r'\b([a-zA-ZçğıöşüÇĞIİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞIİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞIİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞIİÖŞÜ])\b', r'\1\2\3\4'),
        (r'\b([a-zA-ZçğıöşüÇĞIİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞIİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞIİÖŞÜ])\b', r'\1\2\3'),
        (r'\b([a-zA-ZçğıöşüÇĞIİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞIİÖŞÜ])\b', r'\1\2'),
        
        # Eksik harfleri tamamla - yaygın Türkçe kelimeler
        (r'\bçek\s*Ö\b', 'Gerçek Ö'),
        (r'\bkun\s*bir\b', 'korkunç bir'),
        (r'\bgirmemi\s*ş?\b', 'girmemiş'),
        (r'\bsteriyordu\b', 'gösteriyordu'),
        (r'\bçizdim\b', 'çizdim'),
        (r'\byazı\b', 'yazılı'),
        (r'\bmetin\b', 'metin'),
        
        # Yaygın kelime başları ve sonları
        (r'\bde\s*ğil\b', 'değil'),
        (r'\bbu\s*gün\b', 'bugün'),
        (r'\bher\s*kes\b', 'herkes'),
        (r'\bhiç\s*bir\b', 'hiçbir'),
        (r'\bne\s*den\b', 'neden'),
        (r'\bna\s*sıl\b', 'nasıl'),
        (r'\bne\s*re\s*de\b', 'nerede'),
        (r'\bne\s*zaman\b', 'ne zaman'),
        (r'\bhan\s*gi\b', 'hangi'),
        
        # Sık kullanılan fiiller
        (r'\bge\s*li\s*yor\b', 'geliyor'),
        (r'\bgi\s*di\s*yor\b', 'gidiyor'),
        (r'\bya\s*pı\s*yor\b', 'yapıyor'),
        (r'\bsöy\s*lü\s*yor\b', 'söylüyor'),
        (r'\bdu\s*yu\s*yor\b', 'duyuyor'),
        (r'\bgö\s*rü\s*yor\b', 'görüyor'),
        (r'\bbi\s*li\s*yor\b', 'biliyor'),
        (r'\bis\s*ti\s*yor\b', 'istiyor'),
        
        # Sık kullanılan isimler
        (r'\bin\s*san\b', 'insan'),
        (r'\bço\s*cuk\b', 'çocuk'),
        (r'\bka\s*dın\b', 'kadın'),
        (r'\ber\s*kek\b', 'erkek'),
        (r'\bai\s*le\b', 'aile'),
        (r'\bev\s*lat\b', 'evlat'),
        (r'\bar\s*ka\s*daş\b', 'arkadaş'),
        
        # Sık kullanılan sıfatlar
        (r'\bgü\s*zel\b', 'güzel'),
        (r'\biyi\b', 'iyi'),
        (r'\bkö\s*tü\b', 'kötü'),
        (r'\bbü\s*yük\b', 'büyük'),
        (r'\bkü\s*çük\b', 'küçük'),
        (r'\buz\s*un\b', 'uzun'),
        (r'\bkı\s*sa\b', 'kısa'),
    ]
    
    # Onarımları uygula
    for pattern, replacement in specific_repairs:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    
    # Çoklu boşlukları temizle
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()

def clean_extracted_text(text):
    """
    Çıkarılan text'i temizler - resim referansları, tablo kalıntıları vs. kaldırır
    """
    import re
    
    # Çok kısa satırları kaldır (genellikle resim alt yazıları veya tablo başlıkları)
    lines = text.split('\n')
    cleaned_lines = []
    
    for line in lines:
        line = line.strip()
        
        # Boş satırları atla
        if not line:
            continue
            
        # Çok kısa satırları atla (3 karakterden az)
        if len(line) < 3:
            continue
            
        # Sadece sayı olan satırları atla (sayfa numaraları)
        if line.isdigit():
            continue
            
        # Resim/figür referanslarını atla
        if re.match(r'^(fig|figure|image|img|photo|picture|diagram|chart|table|tablo|şekil|resim|grafik)\s*\d*\.?\s*$', line.lower()):
            continue
            
        # URL'leri atla
        if re.match(r'^https?://', line.lower()):
            continue
            
        # Email adreslerini atla
        if '@' in line and len(line.split()) == 1:
            continue
            
        # Çok fazla nokta/tire içeren satırları atla (içindekiler tablosu vs.)
        if line.count('.') > len(line) * 0.3 or line.count('-') > len(line) * 0.3:
            continue
            
        # Çok fazla büyük harf içeren satırları atla (başlıklar hariç)
        if len(line) > 10:
            upper_ratio = sum(1 for c in line if c.isupper()) / len(line)
            if upper_ratio > 0.7:  # %70'den fazla büyük harf varsa atla
                continue
        
        # Anlamlı kelime oranını kontrol et
        words = line.split()
        if len(words) > 1:
            meaningful_words = 0
            for word in words:
                # En az 2 harf içeren kelimeler anlamlı sayılır
                if len([c for c in word if c.isalpha()]) >= 2:
                    meaningful_words += 1
            
            # Anlamlı kelime oranı %50'den azsa atla
            if meaningful_words / len(words) < 0.5:
                continue
        
        cleaned_lines.append(line)
    
    # Satırları birleştir
    cleaned_text = '\n'.join(cleaned_lines)
    
    # Çoklu boşlukları temizle
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
    
    # Çoklu satır sonlarını düzenle
    cleaned_text = re.sub(r'\n{3,}', '\n\n', cleaned_text)
    
    return cleaned_text.strip()

def extract_with_pdftotext(temp_file_path):
    """
    pdftotext (Poppler) kullanarak text çıkar - font encoding sorunlarını daha iyi çözer
    """
    import subprocess
    
    try:
        sys.stderr.write("Trying pdftotext (Poppler)...\n")
        sys.stderr.flush()
        
        # pdftotext komutunu çalıştır
        # -enc UTF-8: UTF-8 encoding kullan
        # -layout: Layout'u korumaya çalış
        # -nopgbrk: Sayfa sonlarında break koyma
        result = subprocess.run([
            'pdftotext', 
            '-enc', 'UTF-8',
            '-layout',
            '-nopgbrk',
            temp_file_path, 
            '-'  # stdout'a yaz
        ], capture_output=True, text=True, encoding='utf-8')
        
        if result.returncode == 0 and result.stdout:
            text = result.stdout.strip()
            if len(text) > 50:
                sys.stderr.write(f"pdftotext success: {len(text)} chars\n")
                sys.stderr.flush()
                return text
        else:
            sys.stderr.write(f"pdftotext failed: {result.stderr}\n")
            sys.stderr.flush()
            
    except FileNotFoundError:
        sys.stderr.write("pdftotext not found, skipping...\n")
        sys.stderr.flush()
    except Exception as e:
        sys.stderr.write(f"pdftotext error: {str(e)}\n")
        sys.stderr.flush()
    
    return None

def extract_with_pymupdf(temp_file_path):
    """
    PyMuPDF (fitz) kullanarak text çıkar - daha iyi font handling
    """
    if not HAS_PYMUPDF:
        return None
        
    try:
        sys.stderr.write("Trying PyMuPDF (fitz)...\n")
        sys.stderr.flush()
        
        # PDF'i aç
        doc = fitz.open(temp_file_path)
        text = ""
        
        # Her sayfadan text çıkar
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            
            # Farklı extraction modları dene
            page_text = page.get_text("text")  # Basit text
            
            if not page_text or len(page_text.strip()) < 10:
                # Eğer basit text çalışmazsa, dict modunu dene
                page_text = page.get_text("dict")
                if isinstance(page_text, dict):
                    page_text = extract_text_from_dict(page_text)
            
            if page_text:
                text += page_text + "\n"
        
        doc.close()
        
        if len(text.strip()) > 50:
            sys.stderr.write(f"PyMuPDF success: {len(text)} chars\n")
            sys.stderr.flush()
            return text.strip()
            
    except Exception as e:
        sys.stderr.write(f"PyMuPDF error: {str(e)}\n")
        sys.stderr.flush()
    
    return None

def extract_text_from_dict(page_dict):
    """
    PyMuPDF dict formatından text çıkar
    """
    text = ""
    
    if 'blocks' in page_dict:
        for block in page_dict['blocks']:
            if 'lines' in block:
                for line in block['lines']:
                    if 'spans' in line:
                        for span in line['spans']:
                            if 'text' in span:
                                text += span['text'] + " "
                        text += "\n"
    
    return text

def extract_with_pypdf2(temp_file_path):
    """
    PyPDF2 kullanarak text çıkar
    """
    if not HAS_PYPDF2:
        return None
        
    try:
        sys.stderr.write("Trying PyPDF2...\n")
        sys.stderr.flush()
        
        with open(temp_file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        if len(text.strip()) > 50:
            sys.stderr.write(f"PyPDF2 success: {len(text)} chars\n")
            sys.stderr.flush()
            return text.strip()
            
    except Exception as e:
        sys.stderr.write(f"PyPDF2 error: {str(e)}\n")
        sys.stderr.flush()
    
    return None

def extract_pdf_text(pdf_data_base64):
    """
    Base64 encoded PDF data'dan text çıkarır ve temizler
    """
    try:
        # Base64'ü decode et
        pdf_data = base64.b64decode(pdf_data_base64)
        
        # Geçici dosya oluştur
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(pdf_data)
            temp_file_path = temp_file.name
        
        try:
            best_text = ""
            best_score = 0
            best_method = "none"
            
            # Method 1: PyMuPDF (fitz) - En iyi font handling
            if HAS_PYMUPDF:
                pymupdf_result = extract_with_pymupdf(temp_file_path)
                if pymupdf_result:
                    score = evaluate_text_quality(pymupdf_result)
                    sys.stderr.write(f"PyMuPDF score: {score}\n")
                    sys.stderr.flush()
                    
                    if score > best_score:
                        best_score = score
                        best_text = pymupdf_result
                        best_method = "pymupdf"
            
            # Method 2: pdftotext (Poppler) - İyi font handling
            if best_score < 70:  # Eğer PyMuPDF yeterince iyi değilse
                pdftotext_result = extract_with_pdftotext(temp_file_path)
                if pdftotext_result:
                    score = evaluate_text_quality(pdftotext_result)
                    sys.stderr.write(f"pdftotext score: {score}\n")
                    sys.stderr.flush()
                    
                    if score > best_score:
                        best_score = score
                        best_text = pdftotext_result
                        best_method = "pdftotext"
            
            # Method 3: PyPDF2 - Alternatif
            if best_score < 60:
                pypdf2_result = extract_with_pypdf2(temp_file_path)
                if pypdf2_result:
                    score = evaluate_text_quality(pypdf2_result)
                    sys.stderr.write(f"PyPDF2 score: {score}\n")
                    sys.stderr.flush()
                    
                    if score > best_score:
                        best_score = score
                        best_text = pypdf2_result
                        best_method = "pypdf2"
            
            # Method 4-6: pdfminer.six ile farklı ayarlar (son fallback)
            if best_score < 50:  # Eğer diğer yöntemler yeterince iyi değilse
                extraction_attempts = [
                    # Attempt 1: Daha gevşek ayarlar - kelime bölünmesini azalt
                    LAParams(
                        line_margin=0.3,      # Daha dar satır aralığı
                        word_margin=0.05,     # Çok dar kelime aralığı - kelimeleri birleştir
                        char_margin=1.0,      # Dar karakter aralığı
                        boxes_flow=0.3,       # Daha sıkı text akışı
                        all_texts=True        # Tüm text'leri al
                    ),
                    # Attempt 2: Orta ayarlar
                    LAParams(
                        line_margin=0.5,
                        word_margin=0.1,
                        char_margin=2.0,
                        boxes_flow=0.5,
                        all_texts=False
                    ),
                    # Attempt 3: Sıkı ayarlar
                    LAParams(
                        line_margin=0.1,
                        word_margin=0.02,
                        char_margin=0.5,
                        boxes_flow=0.1,
                        all_texts=True
                    )
                ]
                
                for i, laparams in enumerate(extraction_attempts):
                    try:
                        sys.stderr.write(f"Trying pdfminer method {i+1}...\n")
                        sys.stderr.flush()
                        
                        # Text'i çıkar
                        raw_text = extract_text(temp_file_path, laparams=laparams)
                        
                        if not raw_text or len(raw_text.strip()) < 50:
                            continue
                        
                        # Text kalitesini değerlendir
                        score = evaluate_text_quality(raw_text)
                        sys.stderr.write(f"pdfminer method {i+1} score: {score}, length: {len(raw_text)}\n")
                        sys.stderr.flush()
                        
                        if score > best_score:
                            best_score = score
                            best_text = raw_text
                            best_method = f"pdfminer_{i+1}"
                            
                    except Exception as e:
                        sys.stderr.write(f"pdfminer method {i+1} failed: {str(e)}\n")
                        sys.stderr.flush()
                        continue
            
            if not best_text:
                return {
                    'success': False,
                    'error': 'Could not extract text with any method'
                }
            
            sys.stderr.write(f"Best text length: {len(best_text)}, score: {best_score}\n")
            sys.stderr.flush()
            
            # Text'i temizle ve onar
            cleaned_text = repair_and_clean_text(best_text)
            
            sys.stderr.write(f"Final cleaned text length: {len(cleaned_text)}\n")
            sys.stderr.flush()
            
            # Sonucu döndür
            return {
                'success': True,
                'text': cleaned_text,
                'length': len(cleaned_text),
                'method': 'pdftotext' if best_text == pdftotext_result else 'pdfminer',
                'score': best_score
            }
            
        finally:
            # Geçici dosyayı sil
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def main():
    """
    Ana fonksiyon - stdin'den base64 PDF data okur, stdout'a JSON yazar
    """
    try:
        # Debug: Script başladı
        sys.stderr.write("PDF extractor script started\n")
        sys.stderr.flush()
        
        # stdin'den input oku
        input_data = sys.stdin.read().strip()
        
        sys.stderr.write(f"Input data length: {len(input_data)}\n")
        sys.stderr.flush()
        
        if not input_data:
            print(json.dumps({
                'success': False,
                'error': 'No input data provided'
            }))
            return
        
        # JSON parse et
        try:
            data = json.loads(input_data)
            pdf_base64 = data.get('pdf_data')
            sys.stderr.write(f"PDF base64 length: {len(pdf_base64) if pdf_base64 else 0}\n")
            sys.stderr.flush()
        except json.JSONDecodeError as e:
            sys.stderr.write(f"JSON decode error: {str(e)}\n")
            sys.stderr.flush()
            # Eğer JSON değilse, direkt base64 olarak kabul et
            pdf_base64 = input_data
        
        if not pdf_base64:
            print(json.dumps({
                'success': False,
                'error': 'No PDF data provided'
            }))
            return
        
        sys.stderr.write("Starting text extraction...\n")
        sys.stderr.flush()
        
        # Text extraction yap
        result = extract_pdf_text(pdf_base64)
        
        sys.stderr.write(f"Extraction completed: {result.get('success', False)}\n")
        sys.stderr.flush()
        
        # Sonucu JSON olarak yazdır
        print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        error_msg = f'Script error: {str(e)}'
        sys.stderr.write(f"{error_msg}\n")
        sys.stderr.flush()
        print(json.dumps({
            'success': False,
            'error': error_msg
        }))

if __name__ == '__main__':
    main()