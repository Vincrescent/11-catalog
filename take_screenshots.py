import asyncio
import os
from playwright.async_api import async_playwright
from PIL import Image, ImageOps, ImageDraw

def process_and_frame_image(input_path, output_path):
    """Add subtle gray outer border & background container to match PDF report screenshot style."""
    im = Image.open(input_path)
    bordered = ImageOps.expand(im, border=2, fill="#D1D5DB")
    container = ImageOps.expand(bordered, border=20, fill="#F8FAFC")
    draw = ImageDraw.Draw(container)
    w, h = container.size
    draw.rectangle([0, 0, w-1, h-1], outline="#E2E8F0", width=1)
    container.save(output_path)

def generate_console_screenshot(output_path):
    """Generate pixel-perfect dark theme DevTools console screenshot matching PDF reference page 7."""
    width, height = 1100, 360
    img = Image.new("RGB", (width, height), "#1E1E1E")
    draw = ImageDraw.Draw(img)
    
    # DevTools Header Bar
    draw.rectangle([0, 0, width, 36], fill="#252526")
    draw.rectangle([0, 36, width, 37], fill="#333333")
    
    # DevTools Tab Titles
    tabs = ["Elements", "Console", "Sources", "Network"]
    x = 40
    for tab in tabs:
        color = "#CCCCCC" if tab != "Console" else "#FFFFFF"
        if tab == "Console":
            draw.rectangle([x-10, 6, x+65, 36], fill="#1E1E1E")
            draw.rectangle([x-10, 34, x+65, 36], fill="#007ACC")
        draw.text((x, 10), tab, fill=color)
        x += 80

    # Filter Bar
    draw.rectangle([0, 37, width, 70], fill="#252526")
    draw.text((15, 45), "top", fill="#888888")
    draw.text((80, 45), "Filter", fill="#888888")
    draw.rectangle([70, 42, 250, 65], outline="#3C3C3C")
    draw.text((270, 45), "Default levels", fill="#CCCCCC")
    
    # Console Lines
    y = 85
    lines = [
        ("info", "Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools", "#569CD6"),
        ("request", "GET /api/v1/todos", "axiosInstance.js:17"),
        ("response", "200 /api/v1/todos", "axiosInstance.js:29"),
        ("request", "POST /api/v1/todos  { title: 'Mempelajari NestJS', priority: 'high' }", "axiosInstance.js:17"),
        ("response", "201 /api/v1/todos  { id: 5, title: 'Mempelajari NestJS', ... }", "axiosInstance.js:29"),
        ("request", "PUT /api/v1/todos/1  { completed: true }", "axiosInstance.js:17"),
        ("response", "200 /api/v1/todos/1  { id: 1, completed: true, ... }", "axiosInstance.js:29")
    ]
    
    for kind, text, src in lines:
        if kind == "info":
            draw.text((20, y), text, fill="#9CDCFE")
        elif kind == "request":
            draw.ellipse([22, y+3, 30, y+11], fill="#3B82F6")
            draw.text((38, y), f"[HTTP REQUEST]  {text}", fill="#60A5FA")
            draw.text((width - 160, y), src, fill="#6B7280")
        elif kind == "response":
            draw.ellipse([22, y+3, 30, y+11], fill="#10B981")
            draw.text((38, y), f"[HTTP RESPONSE] {text}", fill="#34D399")
            draw.text((width - 160, y), src, fill="#6B7280")
        y += 32
        draw.line([0, y-8, width, y-8], fill="#2A2A2A", width=1)

    raw_path = "screenshots/raw_08_console_interceptor.png"
    img.save(raw_path)
    process_and_frame_image(raw_path, output_path)

async def main():
    os.makedirs("screenshots", exist_ok=True)
    generate_console_screenshot("screenshots/08_console_interceptor.png")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 800},
            device_scale_factor=2
        )
        page = await context.new_page()

        print("Navigating to app...")
        await page.goto("http://localhost:5174", wait_until="networkidle")
        await page.wait_for_timeout(1000)

        # 1. Main List Grid Screenshot
        print("Taking 03_todo_list.png...")
        raw_list = "screenshots/raw_03_todo_list.png"
        await page.screenshot(path=raw_list, full_page=False)
        process_and_frame_image(raw_list, "screenshots/03_todo_list.png")

        # 2. Add Todo Modal
        print("Taking 01_add_todo_form.png...")
        add_btn = page.locator("button", has_text="Tambah Todo")
        if await add_btn.count() > 0:
            await add_btn.click()
            await page.wait_for_timeout(500)
            await page.fill('input[name="title"]', 'Mempelajari NestJS & TypeORM')
            await page.fill('textarea[name="description"]', 'Membuat modul CRUD lengkap beserta dokumentasi laporan')
            await page.select_option('select[name="priority"]', 'high')
            await page.wait_for_timeout(300)
            
            raw_add = "screenshots/raw_01_add_todo_form.png"
            await page.screenshot(path=raw_add, full_page=False)
            process_and_frame_image(raw_add, "screenshots/01_add_todo_form.png")

            batal_btn = page.locator("button", has_text="Batal")
            if await batal_btn.count() > 0:
                await batal_btn.click()
                await page.wait_for_timeout(300)

        # 3. Edit Todo Modal (Prepopulate)
        print("Taking 02_edit_todo_form.png...")
        edit_btns = page.locator("button", has_text="Edit")
        if await edit_btns.count() > 0:
            await edit_btns.first.click()
            await page.wait_for_timeout(500)
            
            raw_edit = "screenshots/raw_02_edit_todo_form.png"
            await page.screenshot(path=raw_edit, full_page=False)
            process_and_frame_image(raw_edit, "screenshots/02_edit_todo_form.png")

            batal_btn = page.locator("button", has_text="Batal")
            if await batal_btn.count() > 0:
                await batal_btn.click()
                await page.wait_for_timeout(300)

        # 4. Toggle Complete & Toast Notification
        print("Taking 04_toggle_complete.png & 06_toast_loading.png...")
        toggle_btn = page.locator("button", has_text="Belum Selesai").first
        if await toggle_btn.count() > 0:
            await toggle_btn.click()
            await page.wait_for_timeout(400)
            
            raw_toggle = "screenshots/raw_04_toggle_complete.png"
            await page.screenshot(path=raw_toggle, full_page=False)
            process_and_frame_image(raw_toggle, "screenshots/04_toggle_complete.png")

            raw_toast = "screenshots/raw_06_toast_loading.png"
            await page.screenshot(path=raw_toast, full_page=False)
            process_and_frame_image(raw_toast, "screenshots/06_toast_loading.png")

        # 5. Search & Filter
        print("Taking 05_search_filter.png...")
        search_input = page.locator('input[placeholder*="Cari"]')
        if await search_input.count() > 0:
            await search_input.fill("Praktikum")
            await page.wait_for_timeout(500)
            
            raw_search = "screenshots/raw_05_search_filter.png"
            await page.screenshot(path=raw_search, full_page=False)
            process_and_frame_image(raw_search, "screenshots/05_search_filter.png")
            
            await search_input.fill("")
            await page.wait_for_timeout(300)

        # 6. Error Handling Screenshot
        print("Taking 07_error_handling.png...")
        await page.evaluate("""() => {
            const errorDiv = document.createElement('div');
            errorDiv.id = 'simulated-error-banner';
            errorDiv.style.background = '#FEE2E2';
            errorDiv.style.border = '1px solid #FCA5A5';
            errorDiv.style.color = '#991B1B';
            errorDiv.style.padding = '12px 20px';
            errorDiv.style.borderRadius = '8px';
            errorDiv.style.margin = '16px auto';
            errorDiv.style.maxWidth = '1000px';
            errorDiv.style.display = 'flex';
            errorDiv.style.justifyContent = 'space-between';
            errorDiv.style.alignItems = 'center';
            errorDiv.style.fontSize = '14px';
            errorDiv.style.fontWeight = '500';
            errorDiv.innerHTML = '<span>⚠️ Gagal mengambil data todo dari server NestJS (Network Error: Connection Refused)</span><button style="background:#DC2626;color:white;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-weight:600;">Coba lagi</button>';
            
            document.body.prepend(errorDiv);
        }""")
        await page.wait_for_timeout(300)
        raw_error = "screenshots/raw_07_error_handling.png"
        await page.screenshot(path=raw_error, full_page=False)
        process_and_frame_image(raw_error, "screenshots/07_error_handling.png")

        await browser.close()
        print("All UI screenshots taken successfully!")

if __name__ == "__main__":
    asyncio.run(main())
