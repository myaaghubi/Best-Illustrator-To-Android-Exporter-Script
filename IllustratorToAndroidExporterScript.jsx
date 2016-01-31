/*
	*** Author: Mohammad Yaghobi (https://github.com/mohammadyaghobi)
*/

var targetIconTypes = [
	{
        name: "Launcher icons(standard icons - mdpi=48*48)",
        baseSize: 48
    },
    {
        name: "Action bar, Dialog & Tab icons(mdpi=32*32)",
        baseSize: 32
    },
    {
        name: "Small Contextual Icons(mdpi=16*16)",
        baseSize: 16
    },
    {
        name: "Notification icons(mdpi=24*24)",
        baseSize: 24
    }
];

var targetSuffixs = [
	{
        name: "ldpi",
        multiplayer: 0.75
    },
    {
        name: "mdpi",
        multiplayer: 1
    },
    {
        name: "hdpi",
        multiplayer: 1.5
    },
    {
        name: "xhdpi",
        multiplayer: 2
    },
    {
        name: "xxhdpi",
        multiplayer: 3
    },
    {
        name: "xxxhdpi",
        multiplayer: 4
    }
];

var targetAddress = [
	{
		name: "Mipmap",
        address: "mipmap-"
    },
    {
		name: "Drawable",
        address: "drawable-"
    }
];

var document = app.activeDocument;
var width = document.width;
var height = document.height;
var targetFolder;

var selectedIconTypes = {};
var selectedSuffixs = {};
var selectedAddress = {};


if(document) {
    var primeWin = new Window("dialog","Export options");
    var veiwGroup = primeWin.add("group");

    var targetIconTypesBox = createOneItemSelectionPanel0(targetIconTypes, veiwGroup);
    var targetSuffixsBox = createMultiSelectionPanel1(targetSuffixs, veiwGroup);
    var targetAddressBox = createOneItemSelectionPanel2(targetAddress, veiwGroup);

    var btnGroup = primeWin.add("group");
    var ok_ = btnGroup.add("button", undefined, "Export");
    var cancel_ = btnGroup.add("button", undefined, "Cancel");
    
    ok_.onClick = function() {
		targetFolder = Folder.selectDialog("Select target folder to export");
		if (targetFolder) {
			var iconType;
			for (var key in selectedIconTypes) {
				if (selectedIconTypes.hasOwnProperty(key)) {
					iconType = selectedIconTypes[key];
				}
			}
			var targetaddress;
			for (var key in selectedAddress) {
				if (selectedAddress.hasOwnProperty(key)) {
					targetaddress = selectedAddress[key];
				}
			}
			for (var key in selectedSuffixs) {
				if (selectedSuffixs.hasOwnProperty(key)) {
					var item = selectedSuffixs[key];
					
					exportToFile(item.multiplayer, iconType.baseSize, item.name, targetaddress.address);
				}
			}
			this.parent.parent.close();
		}
		else alert("Selected target folder is not valid!");
    };
    
    cancel_.onClick = function () {
        this.parent.parent.close();
    };

    primeWin.show();
}

function exportToFile(multiplayer, baseSize, suffix, resAddress) {
    var target = new Folder(targetFolder.fsName + "/" + resAddress + suffix);

	if (!target.exists) {
		target.create();
	}

	for (var i = document.artboards.length - 1; i >= 0; i--) {
		document.artboards.setActiveArtboardIndex(i);
			
		var file = new File(target.fsName + "/" + document.layers[i].name + ".png");

		var extras = new ExportOptionsPNG24();
		extras.horizontalScale = multiplayer*baseSize/height*100;
		extras.verticalScale = multiplayer*baseSize/width*100;
		extras.artBoardClipping = true;
		extras.transparency = true;
		extras.antiAliasing = true;

		document.exportFile(file, ExportType.PNG24, extras);
	}
};

function createOneItemSelectionPanel0(array, parent) {
    var panel = parent.add("panel", undefined, "Icon type");
	panel.alignment = "top";
    panel.alignChildren = "left";
    for(var i = 0; i < array.length;  i++) {
        var cb = panel.add("radiobutton", undefined, "\u00A0" + array[i].name);
        cb.item = array[i];
		if (i==0) {
			cb.value = true;
			selectedIconTypes[cb.item.name] = cb.item;
		}
        cb.onClick = function() {
            if(this.value) {
                selectedIconTypes[this.item.name] = this.item;
            } else {
                delete selectedIconTypes[this.item.name];
            }
        };
    }
};
function createMultiSelectionPanel1(array, parent) {
    var panel = parent.add("panel", undefined, "Icon sizes");
    panel.alignChildren = "left";
    for(var i = 0; i < array.length;  i++) {
        var cb = panel.add("checkbox", undefined, "\u00A0" + array[i].name);
        cb.item = array[i];
		if (i>0 && i<5) {
			cb.value = true;
			selectedSuffixs[cb.item.name] = cb.item;
		}
        cb.onClick = function() {
            if(this.value) {
                selectedSuffixs[this.item.name] = this.item;
            } else {
                delete selectedSuffixs[this.item.name];
            }
        };
    }
};
function createOneItemSelectionPanel2(array, parent) {
    var panel = parent.add("panel", undefined, "Target Type");
	panel.alignment = "top";
    panel.alignChildren = "left";
    for(var i = 0; i < array.length;  i++) {
        var cb = panel.add("radiobutton", undefined, "\u00A0" + array[i].name);
        cb.item = array[i];
		if (i==0) {
			cb.value = true;
			selectedAddress[cb.item.name] = cb.item;
		}
        cb.onClick = function() {
            if(this.value) {
                selectedAddress[this.item.name] = this.item;
            } else {
                delete selectedAddress[this.item.name];
            }
        };
    }
};
