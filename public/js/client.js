window.onBespinLoad = function() {
	// Get the DOM node with the Bespin instance inside
	var edit = document.getElementById("editor1");
	// Get the environment variable.
	var env = edit.bespin;
	// Get the editor.
	var editor = env.editor;
	env.settings.set("tabstop", 4);
	editor.syntax = "js";
	editor.focus = true;
};
