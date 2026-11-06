import os
import json
import pdfplumber

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file."""
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        print(f"Error extracting {pdf_path}: {e}")
    return text

def process_all_pdfs(data_folder):
    """Process all PDFs in the data folder."""
    extracted_data = {}
    
    for root, dirs, files in os.walk(data_folder):
        for file in files:
            if file.endswith('.pdf'):
                pdf_path = os.path.join(root, file)
                txt_path = pdf_path.replace('.pdf', '.txt')
                regulator = os.path.basename(root)
                filename = file.replace('.pdf', '')
                
                # Skip if text file already exists
                if os.path.exists(txt_path):
                    print(f"Skipping (already extracted): {regulator}/{file}")
                    
                    # Load existing text file into combined data
                    with open(txt_path, 'r', encoding='utf-8') as f:
                        text = f.read()
                    
                    key = f"{regulator}/{filename}"
                    extracted_data[key] = text
                    continue
                
                print(f"Processing: {regulator}/{file}")
                text = extract_text_from_pdf(pdf_path)
                
                key = f"{regulator}/{filename}"
                extracted_data[key] = text
                
                # Save individual text file
                with open(txt_path, 'w', encoding='utf-8') as f:
                    f.write(text)
                print(f"  Saved: {txt_path}")
    
    return extracted_data

def save_combined_json(extracted_data, output_file):
    """Save all extracted text to a JSON file."""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"Saved combined data to {output_file}")

if __name__ == "__main__":
    data_folder = "data"
    
    if not os.path.exists(data_folder):
        print(f"Folder '{data_folder}' not found!")
        exit(1)
    
    extracted = process_all_pdfs(data_folder)
    save_combined_json(extracted, "data/extracted_regulations.json")
    
    print(f"\nTotal documents processed: {len(extracted)}")
    print("Extraction complete!")