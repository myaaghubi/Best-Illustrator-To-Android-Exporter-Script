/*
	*** Author: Mohammad Yaghobi (https://github.com/mohammadyaghobi)
*/

var targetImageTypes = [
	{
        name: "Free size drawable(target mdpi=free)",
        mdpi: 0
    },
	{
        name: "Launcher icons(standard icons - target mdpi=48*48)",
        mdpi: 48
    },
    {
        name: "Action bar, Dialog & Tab icons(target mdpi=32*32)",
        mdpi: 32
    },
    {
        name: "Small Contextual Icons(target mdpi=16*16)",
        mdpi: 16
    },
    {
        name: "Notification icons(target mdpi=24*24)",
        mdpi: 24
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

var selectedImageTypes = {};
var selectedSuffixs = {};
var selectedAddress = {};


if(document) {
    var primeWin = new Window("dialog","Export options");
    var veiwGroup = primeWin.add("group");

    var targetImageTypesBox = createOneItemSelectionPanel0(targetImageTypes, veiwGroup);
    var targetSuffixsBox = createMultiSelectionPanel1(targetSuffixs, veiwGroup);
    var targetAddressBox = createOneItemSelectionPanel2(targetAddress, veiwGroup);

    var btnGroup = primeWin.add("group");
    var ok_ = btnGroup.add("button", undefined, "Export");
    var cancel_ = btnGroup.add("button", undefined, "Cancel");
    
    ok_.onClick = function() {
		targetFolder = Folder.selectDialog("Select target folder to export");
		if (targetFolder) {
			var iconType;
			for (var key in selectedImageTypes) {
				if (selectedImageTypes.hasOwnProperty(key)) {
					iconType = selectedImageTypes[key];
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
					
					exportToFile(item.multiplayer, iconType.mdpi, item.name, targetaddress.address);
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

function exportToFile(multiplayer, mdpi, suffix, resAddress) {
    var target = new Folder(targetFolder.fsName + "/" + resAddress + suffix);

	if (!target.exists) {
		target.create();
	}

	for (var i = document.artboards.length - 1; i >= 0; i--) {
		document.artboards.setActiveArtboardIndex(i);
			
		var file = new File(target.fsName + "/" + document.layers[i].name + ".png");
		
		var imageBaseRateWidth = 1;
		var imageBaseRateHeight = 1;

		if (mdpi!=0){
			imageBaseRateWidth = mdpi/width;
			imageBaseRateHeight = mdpi/height;
		}
		
		var extras = new ExportOptionsPNG24();
		extras.horizontalScale = multiplayer*imageBaseRateWidth*100;
		extras.verticalScale = multiplayer*imageBaseRateHeight*100;
		extras.artBoardClipping = true;
		extras.transparency = true;
		extras.antiAliasing = true;

		document.exportFile(file, ExportType.PNG24, extras);
	}
};

function createOneItemSelectionPanel0(array, parent) {
    var panel = parent.add("panel", undefined, "Image type");
	panel.alignment = "top";
    panel.alignChildren = "left";
    for(var i = 0; i < array.length;  i++) {
        var cb = panel.add("radiobutton", undefined, "\u00A0" + array[i].name);
        cb.item = array[i];
		if (i==0) {
			cb.value = true;
			selectedImageTypes[cb.item.name] = cb.item;
		}
        cb.onClick = function() {
            if(this.value) {
                selectedImageTypes[this.item.name] = this.item;
            } else {
                delete selectedImageTypes[this.item.name];
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
    var panel = parent.add("panel", undefined, "Target type");
	panel.alignment = "top";
    panel.alignChildren = "left";
    for(var i = 0; i < array.length;  i++) {
        var cb = panel.add("radiobutton", undefined, "\u00A0" + array[i].name);
        cb.item = array[i];
		if (i==1) {
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
