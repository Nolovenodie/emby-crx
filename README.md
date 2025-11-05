

# Emby Crx

## EN & CN  
- [Simplified Chinese](README.md)  
- [English](README-EN.md)

_Emby Enhancement/Beautification Plugin (for Chromium-based browsers)_

---

## ⚠️ Warning  
The media library cover designs are original creations. Do not copy or use them without authorization!

---

## 🎬 Animation Preview  
(*Due to the logo entrance animation being prioritized, the visual effect may appear slightly off. This has been improved in the latest version. A new video preview is pending. You can try it yourself for the actual effect.*)

[Preview Video](https://user-images.githubusercontent.com/18238152/235517763-5ee7fe21-87e7-414f-a1cd-b2c6fadbb8d5.mp4)

---

## 📌 Usage Notes  
If you do **not** want the media library name to appear centered when hovering with the mouse, modify line 37 in `static/css/style.css`.

---

## 🚀 How to Use  
**There are two deployment methods — choose only one.**

### 🔌 Plugin Version  
_Requires users to install the plugin manually._

1. Open Chrome Extension Settings  
2. Enable Developer Mode  
3. Click “Load unpacked extension”  
4. Select the source code folder directly

### 🌐 Server Version  
_No plugin required. Deploy directly to the server for seamless user experience._

#### Docker Version  
(*If the script updates, just re-run it.*)  
> ⚠️ Requires GitHub access. If unsure, leave a message in the group.  
> Replace `EmbyServer` with your actual container name if different.  
> Unofficial tutorial: [mj.tk Emby Guide](https://mj.tk/2023/07/Emby)

```bash
docker exec EmbyServer /bin/sh -c 'cd /system/dashboard-ui && wget -O - https://tinyurl.com/2p97xcpd | sh'
```

#### Standard Version  
> Unofficial tutorial: [Cangshui Emby Guide](https://cangshui.net/5167.html)

---

## 🧩 TODO

- Package into standalone JS/CSS for client-side use  
- Integrate into Misty Media client  
- Add feature to jump playback to third-party players  
- Enable online version checking and updates

---

## 🖼️ Preview Gallery  
⚠️ The media library covers are original designs. Unauthorized copying or use is prohibited!

![Preview 1](https://user-images.githubusercontent.com/18238152/235510774-666d9006-cbad-4b97-9a73-ad5334cb7eee.png)  
![Preview 2](https://user-images.githubusercontent.com/18238152/235510867-4b71a870-6be6-46a5-b988-527d667b020d.png)  
![Preview 3](https://user-images.githubusercontent.com/18238152/235510872-ef88ae87-6693-4c11-b7ad-0f05e1a5c583.png)  
![Preview 4](https://user-images.githubusercontent.com/18238152/235510874-f2fe4715-eb68-4f7a-ac49-50dc5f4ef5aa.png)

---

Let me know if you'd like this formatted into a Markdown file, HTML page, or bundled with your Emby deployment. I can also help localize it for bilingual display.
