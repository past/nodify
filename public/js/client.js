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
        nodifyMsg("File saved!");

    });

    $('#revert-btn').click(function() {
        nodifyMsg("File reverted!");

    });

    $('#deploy-btn').click(function() {
        nodifyMsg("Project deployed!");

    });

}
