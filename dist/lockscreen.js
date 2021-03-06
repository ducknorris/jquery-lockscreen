/* ===========================================================
# Lockscreen - v0.1.0
# ==============================================================
# Copyright (c) 2014 Catalin Ilinca
# Licensed MIT.
*/
(function($) {
  var lockScreen;
  lockScreen = {
    init: function(el, config) {
      var _originalTitle;
      this.el = el;
      this.$el = $(el);
      this.config = $.extend({}, $.fn.lockScreen.defaults, config);
      this.$el.data('original-title', window.document.title);
      _originalTitle = this.$el.data('original-title');
      window._timeoutInterval = this.config.timeout;
      window._lockScreenFn = this.lockScreen;
      window._locked = this.config.locked;
      this.updateHtml();
      window._lockScreen = $('.lock-screen');
      window._passwordField = $('.lock-screen .current-user .password-field');
      window._unlockMe = $('.lock-screen .current-user .unlock-me');
      if ($.cookie('locked') === 'yes') {
        this.lockScreen();
      }
      if ($('.lock-screen').length === 0) {
        this.logout();
      }
      window._timeout = setTimeout(function() {
        window._lockScreenFn();
      }, window._timeoutInterval);
      this.guard();
    },
    updateHtml: function() {
      this.$el.addClass("lockableScreen");
      this.$el.prepend(this.config.template);
      this.$logo = $('.lock-screen .current-user h2 img');
      this.$logo.attr('alt', this.config.app);
      this.$logo.attr('src', this.config.logo);
      this.$avatar = $('.lock-screen .current-user span img');
      this.$avatar.attr('alt', this.config.name);
      this.$avatar.attr('src', this.config.avatar);
      this.$current_user = $('.lock-screen .current-user h4');
      this.$current_user.html(this.config.name);
      this.$passwordField = $('.lock-screen .current-user .password-field');
      this.$passwordField.attr('placeholder', this.config.placeholder);
      this.$unlockMe = $('.lock-screen .current-user .unlock-me');
      this.$unlockMe.html(this.config.unlockMe);
    },
    lockScreen: function() {
      window.document.title = window._locked;
      window._passwordField.focus();
      window._lockScreen.fadeIn();
      $.cookie('locked', 'yes');
    },
    guard: function() {
      var _this;
      _this = this;
      return $(document).on('mousemove', function() {
        if ($('.lock-screen').length === 0) {
          _this.config.logout();
        }
        clearTimeout(window._timeout);
        if (window._lockScreen.is(':hidden')) {
          window._timeout = setTimeout(function() {
            window._lockScreenFn();
          }, window._timeoutInterval);
        }
      });
    }
  };
  $.fn.lockScreen = function() {
    var obj;
    obj = Object.create(lockScreen);
    return this.each(function() {
      obj.init(this);
    });
  };
  return $.fn.lockScreen.defaults = {
    timeout: 60000,
    logout: function() {
      console.warn('You have to implement this function!');
    },
    unlock: function() {
      console.warn('You have to implement this function!');
    },
    app: 'jQuery LockScreen',
    locked: 'Locked!',
    logo: 'http://jquery-lockscreen.s3.amazonaws.com/logo.png',
    bg: 'http://jquery-lockscreen.s3.amazonaws.com/lock-screen.jpg',
    name: 'John Doe',
    avatar: 'http://jquery-lockscreen.s3.amazonaws.com/current-user.png',
    placeholder: 'type password',
    unlockMe: "I'm here. Let me in!",
    template: '<div class="lock-screen" style="display: none">\
        <div class="current-user">\
          <h2><img alt="" src=""></h2>\
          <span><img alt="" height="80" src="" width="80"></span>\
          <h4></h4>\
          <input autofocus="" class="password-field" placeholder="" type="password">\
          <button class="unlock-me"></button>\
        </div>\
      </div>'
  };
})(jQuery);
