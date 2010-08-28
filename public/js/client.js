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
        env.editor.value = window.data.user.projects['MyProject'].handlers['GET /'].code;

    function nodifyMsg(msg, msgType) {
        var backgroundColor = "";
        if (msgType == "error") {
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
            fontSize: '12px'
        };

        $.showMessage(msg, options)
    }

    $('#save-btn').click(function() {
        nodifyMsg("File saved!");

    });

    $('#revert-btn').click(function() {
        nodifyMsg("File reverted!");

    });

    $('#deploy-btn').click(function() {
        nodifyMsg("Project deployed!");

    });

    $('#lnk-new').click(function() {
        $("#dialog-project-new").dialog('open');

    });

    $('#btn-project-new-cancel').click(function() {
        $("#dialog-project-new").dialog('close');

    });

    $("#dialog-project-new").dialog({ autoOpen: false });
    $("btn-project-new-submit").button();

}
