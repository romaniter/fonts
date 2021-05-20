(function() {
    'use strict';

    if (plp_page_id) {
        var url = '<a href="https://app.platformalp.ru/#!/redactor/'+ plp_page_id + '?content=' + plp_content_id + '" target="_blank" style="position:fixed;top:0px;right:0px;z-index:999999999;"> Перейти в редактор </a>';
        var div = document.createElement("div");
        div.innerHTML = url;
        document.body.appendChild(div);
    }
})();
