# Emby Crx

_Emby Enhancement/Beautification Plugin (for Chrome Core Browser)_

# Warning: The media library cover is an original design. Please do not imitate it without authorization!

---

## Animation Preview (Because the LOGO entrance animation is too prioritized, the effect may be slightly worse. The latest version has been changed. The video is waiting for update. You can try the specific effect yourself)

https://user-images.githubusercontent.com/18238152/235517763-5ee7fe21-87e7-414f-a1cd-b2c6fadbb8d5.mp4

## Usage Instructions

If you do not need the media library to display the library name in the center after hovering the mouse, please change the 37th line in the static\css\style.css file

## Usage Method

**Two methods only need to deploy one**

> Plugin Version

_Requires users to load plugins_

Chrome Extension Settings > Developer Mode > Load the unzipped extension > Select the source code directly

> Server Version

_No need to use plugins, deploy directly to the server, users can use it seamlessly_

# Docker Version (If the script is updated, just re-execute)

# Note: You need to have access to Github. If you don’t understand, please leave a message in the group

# EmbyServer is the container name. If your container name is not this, please change it to the correct one!

# Reference tutorial (unofficial): https://mj.tk/2023/07/Emby
docker exec EmbyServer /bin/sh -c 'cd /system/dashboard-ui && wget -O - https://tinyurl.com/2p97xcpd | sh'

# Normal version

# Reference tutorial (unofficial): https://cangshui.net/5167.html

---

## TODO

- Encapsulate as a single JS/CSS, For client use
- Encapsulated in Misty Media client
- Playback jump to third-party player function
- Online version detection and update

---

## Effect preview

# Warning: The media library cover is an original design, please do not imitate it without authorization!

![1](https://user-images.githubusercontent.com/18238152/235510774-666d9006-cbad-4b97-9a73-ad5334cb7eee.png) ![2](https://user-images.githubusercontent.com/18238152/235510867-4b71a870-6be6-46a5-b988-527d667b020d.png) ![3](https://user-images.githubusercontent.com/18238152/235510872-ef88ae87-6693-4c11-b7ad-0f05e1a5c583.png) ![4](https://user-images.githubusercontent.com/18238152/235510874-f2fe4715-eb68-4f7a-ac49-50dc5f4ef5aa.png)
