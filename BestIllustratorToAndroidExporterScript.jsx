/*
	*** Author: Mohammad Yaghobi (https://github.com/mohammadyaghobi)
*/

var targetImageTypes = [
	{
		name: "Launcher icons(standard icons - target mdpi width=48px)",
		mdpi: 48
	},
	{
		name: "Action bar, Dialog & Tab icons(target mdpi width=32px)",
		mdpi: 32
	},
	{
		name: "Small Contextual Icons(target mdpi width=16px)",
		mdpi: 16
	},
	{
		name: "Notification icons(target mdpi width=24px)",
		mdpi: 24
	},
	{
		name: "Custom size(target mdpi width=entered custom number)",
		mdpi: 2
	},
	{
		name: "Free size drawable(target mdpi width=free)",
		mdpi: 1
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
var targetFolder;

var selectedImageTypes = {};
var selectedSuffixs = {};
var selectedAddress = "";
var customSizeField;


if(document) {
	var primeWin = new Window("dialog","Export options");
	var veiwGroup = primeWin.add("group");

	var targetImageTypesBox = createOneItemSelectionPanel0(targetImageTypes, veiwGroup);
	var targetAddressBox = createOneItemSelectionPanel2(targetAddress, veiwGroup);
	var targetSuffixsBox = createMultiSelectionPanel1(targetSuffixs, veiwGroup);

	var btnGroup = primeWin.add("group");
	var ok_ = btnGroup.add("button", undefined, "Export");
	var cancel_ = btnGroup.add("button", undefined, "Cancel");

	ok_.onClick = function() {
		var validIntFlag = true;
		var iconType=0;
		for (var key in selectedImageTypes) {
			if (selectedImageTypes.hasOwnProperty(key)) {
				iconType = selectedImageTypes[key];
			}
		}


		if (iconType==0 || (iconType.mdpi==2 && !isInteger(customSizeField.text))) {
			validIntFlag =false;
			alert("Please enter valid Integer number into 'Custom Size'");
			return ;
		}

		targetFolder = Folder.selectDialog("Select target folder to export");
		if (!targetFolder)
			alert("Selected target folder is not valid!")

		var docName = prompt("Enter document name :")
		if (docName == null)
			alert("Please enter a file name.")

		if (validIntFlag && targetFolder && docName != null) {
			for (var key in selectedSuffixs) {
				if (selectedSuffixs.hasOwnProperty(key)) {
					var item = selectedSuffixs[key];

					exportToFile(item.multiplayer, iconType.mdpi, item.name, selectedAddress, docName);
				}
			}
			this.parent.parent.close();
		}
	};

	cancel_.onClick = function () {
		this.parent.parent.close();
	};

	primeWin.show();
}

function exportToFile(multiplayer, mdpi, suffix, resAddress, docName) {
	var target = new Folder(targetFolder.fsName + "/" + resAddress + suffix);

	if (!target.exists) {
		target.create();
	}

	for (var i = document.artboards.length - 1; i >= 0; i--) {
		document.artboards.setActiveArtboardIndex(i);

		var file = new File(target.fsName + "/" + docName + ".png");

		var imageBaseRateWidth = 1;

		if (mdpi>2){
			imageBaseRateWidth = mdpi/width;
		} else if (mdpi==1) {
			imageBaseRateWidth = 1;
		} else if (mdpi==2) {
			imageBaseRateWidth = customSizeField.text/width;
		}

		var extras = new ExportOptionsPNG24();
		if (mdpi>2) {
			extras.horizontalScale = multiplayer*imageBaseRateWidth*100;
			extras.verticalScale = multiplayer*imageBaseRateWidth*100;
		} else if (mdpi==1) {
			extras.horizontalScale = multiplayer*width;
			extras.verticalScale = multiplayer*width;
		} else if (mdpi==2) {
			extras.horizontalScale = multiplayer*imageBaseRateWidth*100;
			extras.verticalScale = multiplayer*imageBaseRateWidth*100;
		}
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
		if (i==4) {
			var cbr=panel.add("panel", [0, 0, 300, 1], "");
		}

		var cb = panel.add("radiobutton", undefined, "\u00A0" + array[i].name);
		cb.item = array[i];
		if (i==0) {
			cb.value = true;
			selectedImageTypes[cb.item.name] = cb.item;
		}

		if (i==4) {
			cb.onClick = function() {
				customSizeField.enabled = true;
				if(this.value) {
					selectedImageTypes[this.item.name] = this.item;
				} else {
					delete selectedImageTypes[this.item.name];
				}
			};
		} else {
			cb.onClick = function() {
				customSizeField.enabled = false;
				if(this.value) {
					selectedImageTypes[this.item.name] = this.item;
				} else {
					delete selectedImageTypes[this.item.name];
				}
			};
		}
	}
};

function createMultiSelectionPanel1(array, parent) {
	var panel = parent.add("panel", undefined, "Icon sizes");
	panel.alignChildren = "left";
	for(var i = 0; i < array.length;  i++) {
		var cb = panel.add("checkbox", undefined, "\u00A0" + array[i].name);
		cb.item = array[i];
		if (i>0 && i<6) {
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
	var group = parent.add("group", undefined, "");
	group.alignment = "top";
	group.orientation = "column";

	panel = group.add("panel", undefined, "Target path");
	panel.alignment = "top";
	panel.alignChildren = "left";
	for(var i = 0; i < array.length;  i++) {
		var cb = panel.add("radiobutton", undefined, "\u00A0" + array[i].name);
		cb.item = array[i];
		if (i==1) {
			cb.itemId = 1;
			cb.value = true;
			selectedAddress = array[1].address;
			cb.onClick = function() {
				selectedAddress = targetAddress[1].address;
			};
		} else {
			cb.itemId = 0;
			selectedAddress = array[0].address;
			cb.onClick = function() {
				selectedAddress = targetAddress[0].address;
			};
		}
	}

	panel = group.add("panel", undefined, "Custom Size");
	customSizeField = panel.add("edittext", [0, 0, 69, 20], "48");
	customSizeField.enabled=false;
	customSizeField.name="sizeField";
	customSizeField.text = 48;
};

function isInteger(str) {
	var status = true
	for (var i=0,len=str.length;i<len;i++){
		if((str.charCodeAt(i)<48 ) || (str.charCodeAt(i)>57)){
			return false;
		}
	};
	return true;
};
