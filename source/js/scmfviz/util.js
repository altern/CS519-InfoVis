var getUriParams = function() {
    var searchString = document.location.search;
    searchString = searchString.substring(1);

    var nvPairs = searchString.split("&");
    var params = {};
    for (var i = 0; i < nvPairs.length; i++)
    {
        var nvPair = nvPairs[i].split("=");
        params[nvPair[0]] = nvPair[1];
    }
    return params;
}

Math.easeInOutCubic = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
};
Math.easeOutCubic = function (t, b, c, d) {
	t /= d;
	t--;
	return c*(t*t*t + 1) + b;
};
Math.easeOutQuad = function (t, b, c, d) {
	t /= d;
	return -c * t*(t-2) + b;
};
var fadeOut = function (id) {
    var color = [255, 255, 0].join(',') + ',',
        element = document.getElementById(id),
        interval = 50,
        t = interval,
        timeout = setInterval(function(){
            if(t >= 0){
                element.style.backgroundColor = 'rgba(' + color + Math.easeOutQuad(t-=1, 0, 1, interval) + ')'; // (transparency -= 0.015)
                // (1 / 0.015) / 25 = 2.66 seconds to complete animation
            } else {
                clearInterval(timeout);
            }
        }, interval); // 1000/40 = 25 fps
}

function getWindowHeight() {
    var windowHeight = 0;
    if (typeof(window.innerHeight) == 'number') {
        windowHeight = window.innerHeight;
    }
    else {
        if (document.documentElement && document.documentElement.clientHeight) {
            windowHeight = document.documentElement.clientHeight;
        }
        else {
            if (document.body && document.body.clientHeight) {
                windowHeight = document.body.clientHeight;
            }
        }
    }
    return windowHeight;
}
function setContent() {
    if (document.getElementById) {
        var windowHeight = getWindowHeight();
        if (windowHeight > 0) {
            var contentElement = document.getElementById('content');
            var contentHeight = contentElement.offsetHeight;
            if (windowHeight - contentHeight > 0) {
                contentElement.style.position = 'relative';
                contentElement.style.top = ((windowHeight / 2) - (contentHeight / 2)) + 'px';
            }
            else {
                contentElement.style.position = 'static';
            }
        }
    }
}