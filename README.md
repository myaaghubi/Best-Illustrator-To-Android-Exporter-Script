Illustrator To Android Exporter Script 1.1
=================================

A script for exporting assets from illustrator to android mipmap/drawable resources.<br>
![Alt text](/screenshot/shot1.png?raw=true "ScreenShot")

Usage
---
Copy *IllustratorToAndroidExporterScript.jsx* to Adobe Illustrator *CS5/Presets/Scripts* folder, after done the script will appear in the *File > Scripts* submenu.
Also you can run the script in Illustrator by choosing *File > Scripts > Browse*.

Options
---
Image type
```
	Image type
	├─── Free size drawable(target mdpi=free)
	├─── Launcher icons(standard icons - target mdpi=48*48)
	├─── Action bar, Dialog & Tab icons(target mdpi=32*32)
	├─── Small Contextual Icons(target mdpi=16*16)
	└─── Notification icons(target mdpi=24*24)
```

Icon sizes
```
	Icon sizes
	├─── ldpi		0.75x
	├─── mdpi		1x
	├─── hdpi		1.5x
	├─── xhdpi		2x
	├─── xxhdpi		3x
	└─── xxxhdpi	4x
```

Target type
```
	Target type
	├─── Mipmap		/mipmap-mdpi ...
	└─── Drawable	/drawable-mdpi ...
```



License
---
```
Copyright 2016 Mohammad Yaghobi

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
