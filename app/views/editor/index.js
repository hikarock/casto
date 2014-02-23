var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'editor_index_view',
  postRender: function() {
    console.log("editor view postRender");
    var input;
    var lastMod;

    $('#btnStart').on('click', function() {
      console.log("start");
      startWatching();
    });

    var startWatching = function() {
        var file;

        if (typeof window.FileReader !== 'function') {
            display("The file API isn't supported on this browser yet.");
            return;
        }

        input = document.getElementById('filename');
        if (!input) {
            display("Um, couldn't find the filename element.");
        }
        else if (!input.files) {
            display("This browser doesn't seem to support the `files` property of file inputs.");
        }
        else if (!input.files[0]) {
            display("Please select a file before clicking 'Show Size'");
        }
        else {
            file = input.files[0];
            lastMod = file.lastModifiedDate;
            display("Last modified date: " + lastMod);
            display("Change the file");
            setInterval(tick, 250);
        }
    };

    var tick = function() {
        var file = input.files && input.files[0];
        if (file && lastMod && file.lastModifiedDate.getTime() !== lastMod.getTime()) {
            lastMod = file.lastModifiedDate;
            display("File changed: " + lastMod);
        }
    };

    var display = function(msg) {
        var p = document.createElement('p');
        p.innerHTML = msg;
        document.body.appendChild(p);
    };
  }
});
module.exports.id = 'editor/index';
console.log("editor view");


