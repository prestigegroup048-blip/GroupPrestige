import re

with open(r'C:/Users/Admin/.gemini/antigravity/brain/c173e66e-875d-411c-994c-68ac7677ccdf/.system_generated/steps/78/output.txt', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# remove scripts and styles
clean = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', html, flags=re.DOTALL | re.IGNORECASE)
lines = [re.sub(r'<[^>]+>', ' ', l).strip() for l in clean.split('\n')]
lines = [l for l in lines if l and len(l) > 2]
print('\n'.join(lines[10:100]))
