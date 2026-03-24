import os
import re

base_dir = r"d:\TienSon\Test\DSTCC_web\DSTCC"

def fix_html_files():
    for root, dirs, files in os.walk(base_dir):
        if '.git' in root or '.gemini' in root or 'node_modules' in root:
            continue
            
        for file in files:
            if not file.endswith('.html'):
                continue
            
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            if root.lower().rstrip('\\') == base_dir.lower().rstrip('\\'):
                rel_prefix = ""
            else:
                rel_prefix = "../"
            
            pattern_index_manual = r'<!--\s*<li class="nav-item ms-lg-2">\s*<a class="btn btn-hero-primary[^>]*href="[^"]+"[^>]*>\s*<i class="bi bi-telephone[^>]*></i>\s*Liên hệ\s*</a>\s*</li>\s*-->\s*<li class="nav-item"><a class="nav-link" href="[^"]+">Liên hệ</a></li>'
            
            pattern_standard = r'<li class="nav-item ms-lg-2">\s*<a class="btn btn-hero-primary[^>]*href="[^"]+"[^>]*>\s*<i class="bi bi-telephone[^>]*></i>\s*Liên hệ(?: ngay)?\s*</a>\s*</li>'
            
            new_nav_item = f'<li class="nav-item"><a class="nav-link" href="{rel_prefix}lien-he/">Liên hệ</a></li>'
            
            modified = False
            
            if re.search(pattern_index_manual, content, re.DOTALL):
                content = re.sub(pattern_index_manual, new_nav_item, content, flags=re.DOTALL)
                modified = True
                print(f"Fixed manual edit in {filepath}")
            elif re.search(pattern_standard, content, re.DOTALL):
                content = re.sub(pattern_standard, new_nav_item, content, flags=re.DOTALL)
                modified = True
                print(f"Fixed standard button in {filepath}")
            
            if modified:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)

fix_html_files()
