Nodify
======

Nodify is a web-based IDE for creating and testing JavaScript programs on
[NodeJS](http://nodejs.org). You can already edit and save your programming projects, using the
on-screen Bespin editor that provides syntax highlighting and natural keyboard
shortcuts. Executing your project is performed by clicking 'Run'. After the
execution is finished, the console will be displayed containing the program's
output. If the program is a server or enters an infinite loop, it will be
killed after 5 minutes, but you can terminate its execution by clicking
'Stop'. You may also start a debugging session by clicking 'Debug', though do
note that it requires using Google Chrome as your browser. Currently projects are single-file, but soon you will be able to
have multiple files per project. You may create multiple projects, rename or
delete them using the links on top of the screen. You don't need to create an
account to use Nodify, a unique user account is created and stored in a cookie
in your browser. Currently, if you browse the service from a different browser
you will create a new user account.

Installation
------------

You may install nodify either using git or [npm](http://npmjs.org).

###Via npm:

    $ npm install nodify

The command "nodify" can then be used to launch the IDE.
The only requirements are node and npm.

###Via git:

    $ git clone http://github.com/past/nodify.git

Then you can run nodify like this:

    $ bin/nodify

You must have already downladed and installed node, connect, nStore and node-inspector.

Debugging
---------

In order to debug your node programs you need to use Google Chrome. This is a
requirement from node-inspector that provides the debugging functionality.
Also, for a better user experience you should enable popups from 127.0.0.1 in
the browser's preferences. Furthermore, node itself must be compiled with the
--debug configuration option.

Mailing list
------------

For any questions, suggestions or general brainstorming, use the [discussion group](http://groups.google.com/group/nodify).

License
-------

(the MIT License)

Copyright 2010 Panagiotis Astithas, Christos Stathis, Dionysios Synodinos

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE. 
