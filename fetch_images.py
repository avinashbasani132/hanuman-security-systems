import json
import os
import time
import requests
from duckduckgo_search import DDGS

# Setup paths
data_file = os.path.join('src', 'data', 'products.json')
img_dir = os.path.join('public', 'images', 'products')

# Ensure dir exists
if not os.path.exists(img_dir):
    os.makedirs(img_dir)

# Read products
with open(data_file, 'r', encoding='utf-8') as f:
    db = json.load(f)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def download_image(url, filepath):
    if os.path.exists(filepath):
        return True
    try:
        res = requests.get(url, headers=headers, timeout=10)
        if res.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(res.content)
            return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
    return False

ddgs = DDGS()
total_downloaded = 0
max_products_to_process = 20 # Let's limit to 20 for now to prevent getting banned, we will do a sample

for cat, items in db.items():
    if not items: continue
    for item in items:
        if total_downloaded >= max_products_to_process:
            break
            
        model = item.get('model')
        brand = item.get('brand')
        images = item.get('images', [])
        
        if not model or not images:
            continue
            
        query = f"{brand} {model} cctv"
        print(f"Searching: {query}")
        
        try:
            results = list(ddgs.images(query, max_results=3))
            
            for i, result in enumerate(results):
                if i >= len(images):
                    break
                    
                img_url = result.get('image')
                filepath = os.path.join('public', images[i].lstrip('/'))
                
                # Make sure the subfolder exists
                os.makedirs(os.path.dirname(filepath), exist_ok=True)
                
                if download_image(img_url, filepath):
                    print(f"Downloaded {filepath}")
                else:
                    print(f"Failed {filepath}")
                    
            time.sleep(2) # avoid rate limit
            total_downloaded += 1
            
        except Exception as e:
            print(f"Search failed for {query}: {e}")
            time.sleep(5)
            
    if total_downloaded >= max_products_to_process:
        break

print("Finished batch image download.")
