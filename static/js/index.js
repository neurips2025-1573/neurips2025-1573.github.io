window.HELP_IMPROVE_VIDEOJS = false;

// 모바일 디바이스 감지 및 비디오 제어 함수
function isMobileDevice() {
    return window.innerWidth <= 768;
}

function controlVideosForMobile() {
    const videos = document.querySelectorAll('video');
    
    if (isMobileDevice()) {
        // 모바일에서는 모든 비디오 일시정지 및 자동재생 비활성화
        videos.forEach(video => {
            video.pause();
            video.removeAttribute('autoplay');
            video.autoplay = false;
            video.muted = true; // 모바일에서 소리도 음소거
        });
    } else {
        // 데스크톱에서는 자동재생 활성화
        videos.forEach(video => {
            video.setAttribute('autoplay', '');
            video.autoplay = true;
            video.muted = true;
            video.play().catch(e => {
                // 자동재생이 실패해도 에러 무시
                console.log('Video autoplay failed:', e);
            });
        });
    }
}

$(document).ready(function() {
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

    // 페이지 로드 시 비디오 제어
    controlVideosForMobile();
    
    // 화면 크기 변경 시 비디오 제어
    window.addEventListener('resize', function() {
        setTimeout(controlVideosForMobile, 100);
    });
    
    // 페이지 가시성 변경 시에도 제어 (탭 전환 등)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && isMobileDevice()) {
            // 모바일에서 탭이 숨겨지면 모든 비디오 정지
            document.querySelectorAll('video').forEach(video => {
                video.pause();
            });
        }
    });

})
