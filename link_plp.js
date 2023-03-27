(function() {
    'use strict';
try {
    if (plp_page_id) {
        if (plp.VERSION == '3.7') {
            var url = '<a href="https://new.platformalp.ru/editor/';
        } else {
            var url = '<a href="https://app.platformalp.ru/#!/redactor/';
        }
        url = url + plp_page_id + '?content=' + plp_content_id + '" target="_blank" style="position:fixed;top:0px;right:0px;z-index:999999999;"> Перейти в редактор </a>';
        var div = document.createElement("div");
        div.innerHTML = url;
        document.body.appendChild(div);
    }
} catch (error) {
    console.log(error);
}
})();
