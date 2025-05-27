window.HELP_IMPROVE_VIDEOJS = false;

// 모바일 디바이스 감지 및 리다이렉트
function checkMobileAndRedirect() {
    // 모바일 디바이스 감지 (768px 이하)
    if (window.innerWidth <= 768) {
        // 현재 페이지가 mobile.html이 아닌 경우에만 리다이렉트
        if (!window.location.pathname.includes('mobile.html')) {
            window.location.href = 'mobile.html';
            return true; // 리다이렉트 발생
        }
    }
    return false; // 리다이렉트 없음
}

$(document).ready(function() {
    // 페이지 로드 시 모바일 체크 및 리다이렉트
    if (checkMobileAndRedirect()) {
        return; // 리다이렉트가 발생하면 나머지 코드 실행 안 함
    }

    // Check for click events on the navbar burger icon

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();

})