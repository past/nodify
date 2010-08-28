$(document).ready(function() {
	// Fetch the user data.
	$.get('/api/init', function (data) {
		var projects, handlers, handler, h;
		window.data = data;
		projects = data.user.projects;
		// TODO: iterate over the projects and fill the combo box.
		handlers = projects['MyProject'].handlers;
		Object.keys(handlers).forEach(function (h) {
			if (h === 'length') return;
			handler = handlers[h];
			console.log('method=' + handler.method + ',uri=' + handler.uri);
			// Get the DOM node with the Bespin instance inside
			var edit = document.getElementById("editor1");
			// Get the environment variable.
			var env = edit.bespin;
			// Get the editor.
			if (env && env.editor)
				env.editor.value = data.user.projects['MyProject'].handlers['GET /'].code;
		});
	});
	// Register the loading indicator on ajax events.
	$.loading({onAjax:true, text: 'Working...', effect: 'fade', delay: 100});
});

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
	if (window.data)
		editor.value = window.data.user.projects['MyProject'].handlers['GET /'].code;

    function nodifyMsg(msg) {
        var options = {id: 'message_from_top',
            position: 'top',
            size: 20,
            backgroundColor: '#4C4A41',
            //delay: 1500,
            delay: 3500,
            speed: 500,
            fontSize: '12px'
        };

        $.showMessage(msg, options)
    }

    $('#save-btn').click(function() {
		$.ajax({
			url: '/api/init',
			type: 'PUT',
			data: {
				method: 'GET',
				project: 'MyProject',
				code: encodeURIComponent(editor.value),
				uri: '/'
			},
			success: function () {
				nodifyMsg("The contents were saved");
			},
			dataType: "text",
			error: function(request, status, error) {
				nodifyMsg("Error while saving file: " + error, "error");
			}
		});
    });

    $('#revert-btn').click(function() {
		$.get('/api/init', function (data) {
			window.data = data;
			editor.value = data.user.projects['MyProject'].handlers['GET /'].code;
			nodifyMsg("The contents were reverted");
		});
    });

    $('#deploy-btn').click(function() {
        nodifyMsg("Project deployed!");

    });

}
