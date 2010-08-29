$(document).ready(function() {
	// Register the loading indicator on ajax events.
	$.loading({onAjax:true, text: 'Working...', effect: 'fade', delay: 100});
	// Fetch the user data.
	function getUserData() {
		$.get('/api/init', function (data) {
			var projects, project, handlers, handler, h, p, edit, env;
			window.data = data;
			$('#projects').empty();
			projects = data.user.projects;
			for (p in projects) {
				if (projects.hasOwnProperty(p)) {
					project = projects[p];
					log('project=' + project.name);
					if (data.user.lastProject && project.name === data.user.lastProject.name)
						$('#projects').append('<option value="' + project.name + '" selected>' + project.name + '</option>');
					else
						$('#projects').append('<option value="' + project.name + '">' + project.name + '</option>');
				}
			}
			if (!data.user.lastProject && project)
				data.user.lastProject = project;
			try {
				handlers = data.user.lastProject.handlers;
			} catch (e) {
				handlers = {};
			}
			for (h in handlers) {
				if (handlers.hasOwnProperty(h)) {
					handler = handlers[h];
					log('method=' + handler.method + ',uri=' + handler.uri);
					// Get the DOM node with the Bespin instance inside
					edit = document.getElementById("editor1");
					// Get the environment variable.
					env = edit.bespin;
					// Get the editor.
					if (env && env.editor) {
						env.editor.value = data.user.lastProject.handlers['GET /'].code;
						env.editor.focus = true;
					}
				}
			};
		});
	}
	// Retrieve the user data.
	getUserData();

    function nodifyMsg(msg, type) {
        var backgroundColor = "";
        if (type === "error") {
            backgroundColor = "red";
            // This will not work
            //$("#message_from_top").css("color","black");
        } else {
            backgroundColor = "#4C4A41";
            // This will not work
            // $("#message_from_top").css("color","#E2BE38");
        }
        var options = {id: 'message_from_top',
            position: 'top',
            size: 20,
            backgroundColor: backgroundColor,
            delay: 3500,
            speed: 500,
            fontSize: '16px'
        };

        $.showMessage(msg, options)
    }

	function consoleAppend (msg, type) {
		if (type === 'error') {
			msg = 'Error:\n------\n' + msg;
		} else {
			msg = 'Output:\n-------\n' + msg;
		}
		var c = $("#console");
		var contents = c.val();
		c.val(contents + '\n' + msg);
		c.css("display", "block");
		c.attr("scrollTop", c.attr("scrollHeight"));
		var cl = $("#console-label");
		cl.css("display", "block");
		// Get the DOM node with the Bespin instance inside
		var edit = document.getElementById("editor1");
		// Get the environment variable.
		var env = edit.bespin;
		// Get the editor.
		if (env && env.editor)
			env.editor.dimensionsChanged();
	}

	$('#projects').change(function() {
		var project = window.data.user.projects[$(this).val()];
		// Get the DOM node with the Bespin instance inside
		var edit = document.getElementById("editor1");
		// Get the environment variable.
		var env = edit.bespin;
		// Get the editor.
		if (env && env.editor) {
			var editor = env.editor;
			editor.value = project.lastHandler.code;
			editor.focus = true;
		}
	});

    $('#save-btn').click(function() {
		// Get the DOM node with the Bespin instance inside
		var edit = document.getElementById("editor1");
		// Get the environment variable.
		var env = edit.bespin;
		// Get the editor.
		if (env && env.editor)
			var editor = env.editor;
		$.ajax({
			url: '/api/init',
			type: 'PUT',
			data: {
				method: 'GET',
				project: $('#projects').val(),
				code: encodeURIComponent(editor.value),
				uri: '/'
			},
			success: function () {
				nodifyMsg("The contents were saved");
				getUserData();
				editor.focus = true;
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
			// Get the DOM node with the Bespin instance inside
			var edit = document.getElementById("editor1");
			// Get the environment variable.
			var env = edit.bespin;
			// Get the editor.
			if (env && env.editor)
				var editor = env.editor;
			editor.value = data.user.projects[$('#projects').val()].handlers['GET /'].code;
			nodifyMsg("The contents were reverted");
			editor.focus = true;
		});
    });

    $('#lnk-start').click(function() {
		$.ajax({
			url: '/api/deploy',
			type: 'POST',
			data: {'project': $('#projects').val()},
			success: function (data) {
				// Get the DOM node with the Bespin instance inside
				var edit = document.getElementById("editor1");
				// Get the environment variable.
				var env = edit.bespin;
				// Get the editor.
				if (env && env.editor)
					var editor = env.editor;
				consoleAppend(data);
				editor.focus = true;
			},
			error: function(request, status, error) {
				consoleAppend(error, "error");
			},
			dataType: 'text'
		});
    });

    $('#lnk-stop').click(function() {
		$.ajax({
			url: '/api/terminate',
			type: 'POST',
			data: {'project': $('#projects').val()},
			success: function (data) {
				// Get the DOM node with the Bespin instance inside
				var edit = document.getElementById("editor1");
				// Get the environment variable.
				var env = edit.bespin;
				// Get the editor.
				if (env && env.editor)
					var editor = env.editor;
				nodifyMsg("The program was terminated");
				editor.focus = true;
			},
			error: function(request, status, error) {
				consoleAppend(error, "error");
			},
			dataType: 'text'
		});
    });

	$('#dialog-project-delete').dialog({
		resizable: false,
		height: 140,
		modal: true,
		autoOpen: false,
		buttons: {
			'Delete project': function() {
				$(this).dialog('close');
				$.ajax({
					url: '/api/init',
					type: 'DELETE',
					data: {'project': $('#projects').val()},
					success: function (data) {
						nodifyMsg("The project was deleted");
						getUserData();
					},
					error: function(request, status, error) {
						nodifyMsg(error, "error");
					},
					dataType: 'text'
				});
			},
			'Cancel': function() {
				$(this).dialog('close');
			}
		}
	});

    $('#lnk-rn').click(function() {
        $('#dialog-project-rename').dialog('open');
		return false;	// prevent default action
    });
    $('#lnk-del').click(function() {
        $('#dialog-project-delete').dialog('open');
		return false;	// prevent default action
    });

    $('#lnk-new').click(function() {
        $("#dialog-project-new").dialog('open');
		return false;	// prevent default action
    });

    $("#dialog-project-new").dialog({
		autoOpen: false,
		resizable: false,
		height: 140,
		modal: true,
		buttons: {
			'Save': function() {
				$(this).dialog('close');
				var newProjectName = $("#btn-project-new-name").val();
				$.ajax({
					url: '/api/init',
					type: 'POST',
					data: {
						create: encodeURIComponent(newProjectName)
					},
					success: function () {
						$("#dialog-project-new").dialog('close');
						nodifyMsg("Project " + newProjectName + " was created");
						getUserData();
					},
					dataType: "text",
					error: function(request, status, error) {
						$("#dialog-project-new").dialog('close');
						nodifyMsg("Error while creating project: " + error, "error");
					}
				});
			},
			'Cancel': function() {
				$(this).dialog('close');
			}
		}
	});

    $("#dialog-project-rename").dialog({
		autoOpen: false,
		resizable: false,
		height: 140,
		modal: true,
		buttons: {
			'Rename': function() {
				$(this).dialog('close');
				var newProjectName = $("#btn-project-rn-name").val();
				$.ajax({
					url: '/api/init',
					type: 'POST',
					data: {
						project: $('#projects').val(),
						rename: encodeURIComponent(newProjectName)
					},
					success: function () {
						$("#dialog-project-rename").dialog('close');
						nodifyMsg("Project was renamed to " + newProjectName);
						getUserData();
					},
					dataType: "text",
					error: function(request, status, error) {
						$("#dialog-project-rename").dialog('close');
						nodifyMsg("Error while renaming project: " + error, "error");
					}
				});
			},
			'Cancel': function() {
				$(this).dialog('close');
			}
		}
	});

	$("#blurb").dialog({
		autoOpen: false,
		resizable: false,
		height: 440,
		width: 440,
		modal: true,
	});

	$("#more").click(function() {
        $("#blurb").dialog('open');
		return false;	// prevent default action
	});
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
		editor.value = window.data.user.lastProject.handlers['GET /'].code;
}
