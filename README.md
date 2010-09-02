Nodify
======

Nodify is a web-based IDE for creating and testing JavaScript programs on
NodeJS. You can already edit and save your programming projects, using the
on-screen Bespin editor that provides syntax highlighting and natural keyboard
shortcuts. Executing your project is performed by clicking 'Execute'. After the
execution is finished, the console will be displayed containing the program's
output. If the program is a server or enters an infinite loop, it will be
killed after 5 minutes, but you can terminate its execution by clicking
'Terminate'. Currently projects are single-file, but soon you will be able to
have multiple files per project. You may create multiple projects, rename or
delete them using the links on top of the screen. You don't need to create an
account to use Nodify, a unique user account is created and stored in a cookie
in your browser. Currently, if you browse the service from a different browser
you will create a new user account.

Installing locally
------------------

You may install nodify either using git or npm.

Using npm:

npm install nodify

The command "nodify" can then be used to launch the IDE.

Using git requires to fetch the node-inspector repository as a submodule:

git clone http://github.com/past/nodify.git
cd nodify
git submodule init
git submodule update

Then you can run nodify like this:

node server.js

Alternatively you may use npm to install a nodify script that launches the server
from any path:

npm install
or
npm link

Debugging
---------

In order to debug your node programs you need to use Google Chrome. This is a
requirement from node-inspector that provides the debugging functionality.
Also, for a better user experience you should enable popups from 127.0.0.1 in
the browser's preferences.

