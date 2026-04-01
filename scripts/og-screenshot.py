"""Generowanie OG image (1200x630) ze strony kola fortuny."""
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1200, "height": 630})
    page.goto("https://hrowekolofortuny.birchcode.com")
    # Zamkniecie cookie banera jesli widoczny
    try:
        page.click(".cookie-banner__btn--accept", timeout=2000)
    except:
        pass
    page.wait_for_timeout(500)
    page.screenshot(path="public/og-image.png", full_page=False)
    browser.close()
    print("Zapisano public/og-image.png (1200x630)")
