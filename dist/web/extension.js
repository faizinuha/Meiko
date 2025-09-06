(() => {
  var e = {
      398: (e) => {
        'use strict';
        e.exports = require('vscode');
      },
      497: (e, o, s) => {
        const n = s(398);
        e.exports = {
          activate: function (e) {
            e.globalState.get('hasShownWelcome') ||
              (n.window.showInformationMessage(
                'Terima kasih telah mengunduh Meiko Extension! 🎉'
              ),
              e.globalState.update('hasShownWelcome', !0)),
              console.log('CodersLar Pro is now active!');
            let o = n.commands.registerCommand(
                'extension.codersSolid',
                function () {
                  n.window.showInformationMessage(
                    'Coders Solid CLI is running!'
                  );
                }
              ),
              s = n.commands.registerCommand(
                'extension.codersDelete',
                function () {
                  n.window.showInformationMessage(
                    'Coders Delete CLI is running!'
                  );
                }
              ),
              t = n.commands.registerCommand(
                'extension.codersCrud',
                function () {
                  n.window.showInformationMessage(
                    'Coders CRUD CLI is running!'
                  );
                }
              );
            e.subscriptions.push(o),
              e.subscriptions.push(s),
              e.subscriptions.push(t);
          },
          deactivate: function () {},
        };
      },
    },
    o = {},
    s = (function s(n) {
      var t = o[n];
      if (void 0 !== t) return t.exports;
      var i = (o[n] = { exports: {} });
      return e[n](i, i.exports, s), i.exports;
    })(497),
    n = exports;
  for (var t in s) n[t] = s[t];
  s.__esModule && Object.defineProperty(n, '__esModule', { value: !0 });
})();
