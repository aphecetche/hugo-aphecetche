var RevealSVGIcons = (function () {

    function convert() {

        let par = document.querySelectorAll('.slides section p');
        for (p of par) {
            if (/:(svg-).*:/.test(p.textContent)) {
                console.log(p.textContent);
            }
        }
    };

    Reveal.addEventListener('ready', function (event) {
        console.log("here");
        convert();
    })

})();