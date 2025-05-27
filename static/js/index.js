window.HELP_IMPROVE_VIDEOJS = false;

// 모바일 디바이스 감지 함수
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (window.innerWidth <= 768);
}

// 동영상 autoplay 설정 함수
function setupVideoAutoplay() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // 모든 동영상에 playsinline 속성 추가 (모바일에서 전체화면 방지)
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', ''); // iOS Safari 호환성
        
        // 모든 디바이스에서 autoplay 활성화
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', ''); // autoplay를 위해 muted 필요
        
        // 자동 재생 시도
        video.play().catch(e => {
            console.log('Autoplay prevented:', e);
            // autoplay가 차단된 경우 사용자 상호작용 후 재생하도록 설정
            const playOnInteraction = () => {
                video.play().catch(console.log);
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('touchstart', playOnInteraction);
            };
            document.addEventListener('click', playOnInteraction);
            document.addEventListener('touchstart', playOnInteraction);
        });
    });
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
    
    // 동영상 autoplay 설정
    setupVideoAutoplay();
    
    // 윈도우 리사이즈 시에도 체크 (데스크톱 ↔ 모바일 전환 시)
    window.addEventListener('resize', function() {
        setTimeout(setupVideoAutoplay, 100);
    });

})
