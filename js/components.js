$(function() {
    $('.popup-close').click(function(){
        var targetId = '#'+$(this).data("target");
        var x = $(targetId);
        if(x.length) {
            $('.cover').hide();
            $(targetId).hide();
        }
    })
    $('.popup-button').click( function() {
            var targetId = '#'+$(this).data("target");
            var x = $(targetId);
            if(x.length) {
                $('.cover').show();
                $(targetId).show();
            }
    });
    $('.cover').hide();
    $('.popup').hide();

    copytimeron = false;
    failuretimeron = false;
    $('.copy-button').click(function(){
        var targetId = '#'+$(this).data("target");
        var x = $(targetId);
        if(x.length) {
            $(targetId).select()
            try
            {
              copied = document.execCommand('copy');
            }
            catch (ex)
            {
              copied = false;
            }

            if(copied) {

                if(copytimeron) {
                 clearTimeout(copytimeout)
                }
                var messageId = '.'+$(this).data("success");
                var message = $(this).parent().find(messageId);
                message.show();
                copytimeron = true;
                copytimeout = setTimeout(function(){
                    message.hide();
                    copytimeron = false;

                },2000)

            } else {
                if(failuretimeron) {
                 clearTimeout(failuretimeout)
                }
                var messageId = '.'+$(this).data("failure");
                var message = $(this).parent().find(messageId);
                message.show();
                failuretimeron = true;
                failuretimeout = setTimeout(function(){
                    message.hide();
                    failuretimeron = false;

                },3000)
            }
        }
    })
});
