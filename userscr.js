document.addEventListener('click', function() {

if ($('.inbox-2__conversation-header').text().search('info@platformalp.ru') > 0&&!document.getElementById('prolong')) {
let s = $('.intercom-interblocks-html').text();
$('.intercom-interblocks-html').append('<button id="prolong">Продлить домен</button>').click(()=>{ window.open('https://partner.r01.ru/AB/domains.khtml?domain='+s.slice(s.search('домена ')+7,s.search(' на ')))
})
}

});
