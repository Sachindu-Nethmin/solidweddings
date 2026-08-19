import os
from PIL import Image

# Configuration
SOURCE_DIR = r"src/assets/gallery"  # Folder to scan
QUALITY = 80  # WebP quality (0-100)

def convert_images_recursive(directory):
    print(f"Scanning: {directory}...")
    
    for root, dirs, files in os.walk(directory):
        for filename in files:
            if filename.lower().endswith((".png", ".jpg", ".jpeg")):
                file_path = os.path.join(root, filename)
                file_name_no_ext = os.path.splitext(file_path)[0]
                output_path = f"{file_name_no_ext}.webp"

                # Skip if webp already exists
                if os.path.exists(output_path):
                    continue

                try:
                    with Image.open(file_path) as im:
                        # Convert to RGB if necessary (e.g. for PNGs with transparency)
                        # WebP handles transparency, but just in case of weird modes
                        # im = im.convert("RGB") 
                        
                        im.save(output_path, "webp", quality=QUALITY)
                        print(f"✅ Converted: {filename} -> .webp")
                        
                        # Optional: Delete original?
                        # os.remove(file_path) 
                        
                except Exception as e:
                    print(f"❌ Failed: {filename} - {e}")

if __name__ == "__main__":
    current_dir = os.getcwd()
    target_dir = os.path.join(current_dir, SOURCE_DIR)
    
    if not os.path.exists(target_dir):
        print(f"Directory not found: {target_dir}")
        print("Please create the folder and add images first!")
        # Create it for them if slightly wrong path, but we expect src/assets/gallery
        os.makedirs(target_dir, exist_ok=True)
    
    convert_images_recursive(target_dir)
    print("\nDone! All images are now WebP.")
