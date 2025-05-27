window.HELP_IMPROVE_VIDEOJS = false;

// 현재 디바이스 상태 추적
let currentDeviceType = null; // 'mobile' 또는 'desktop'

// 모바일 디바이스 감지
function isMobileDevice() {
    return window.innerWidth <= 768;
}

// 디바이스 타입 가져오기
function getDeviceType() {
    return isMobileDevice() ? 'mobile' : 'desktop';
}

// 디바이스 타입이 실제로 변경되었는지 확인
function hasDeviceTypeChanged() {
    const newDeviceType = getDeviceType();
    if (currentDeviceType !== newDeviceType) {
        currentDeviceType = newDeviceType;
        return true;
    }
    return false;
}

// 조건부 렌더링 - 모바일에서는 비디오 섹션 완전 제거
function conditionalRenderContent() {
    const videoSections = document.querySelectorAll('.hero.teaser');
    const mobileMessage = document.querySelector('.mobile-message');
    
    if (isMobileDevice()) {
        // 모바일: 비디오 섹션들 완전 제거, 모바일 메시지 표시
        videoSections.forEach(section => {
            if (section.style.display !== 'none') {
                section.style.display = 'none';
                section.setAttribute('data-hidden-mobile', 'true');
            }
        });
        
        if (mobileMessage) {
            mobileMessage.style.display = 'flex';
        }
        
        // 모든 비디오 요소 제거
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.src = ''; // 소스 제거로 완전 정지
            video.load(); // 리로드하여 완전 초기화
        });
        
    } else {
        // 데스크톱: 비디오 섹션들 표시, 모바일 메시지 숨김
        videoSections.forEach(section => {
            if (section.getAttribute('data-hidden-mobile') === 'true') {
                section.style.display = '';
                section.removeAttribute('data-hidden-mobile');
            }
        });
        
        if (mobileMessage) {
            mobileMessage.style.display = 'none';
        }
        
        // 비디오 소스 복원 및 자동재생 시작
        setTimeout(() => {
            restoreVideoSources();
        }, 100);
    }
}

// 비디오 소스 복원 함수
function restoreVideoSources() {
    const videos = document.querySelectorAll('video');
    videos.forEach((video, index) => {
        if (!video.src || video.src === '') {
            // 원본 소스 복원 (0_0.mp4, 0_1.mp4, 1_0.mp4, 1_1.mp4 등의 패턴)
            const sources = video.querySelectorAll('source');
            sources.forEach(source => {
                if (source.src && !video.src) {
                    video.src = source.src;
                }
            });
            
            // 자동재생 속성 복원
            video.setAttribute('autoplay', '');
            video.setAttribute('muted', '');
            video.setAttribute('loop', '');
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            
            // 재생 시작
            video.load();
            video.play().catch(e => {
                console.log('Video autoplay failed:', e);
            });
        }
    });
}

// 디바운스 함수 (추가 최적화)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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

    // 페이지 로드 시 초기 디바이스 타입 설정 및 조건부 렌더링
    currentDeviceType = getDeviceType();
    conditionalRenderContent();
    
    // 최적화된 resize 이벤트 핸들러 - 디바이스 타입이 실제로 변경될 때만 실행
    const optimizedResizeHandler = debounce(() => {
        if (hasDeviceTypeChanged()) {
            console.log(`Device type changed to: ${currentDeviceType}`);
            conditionalRenderContent();
        }
    }, 150); // 150ms 디바운스
    
    window.addEventListener('resize', optimizedResizeHandler);

})
