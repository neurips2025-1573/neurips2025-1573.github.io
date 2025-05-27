window.HELP_IMPROVE_VIDEOJS = false;

// 모바일 디바이스 감지 함수
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (window.innerWidth <= 768);
}

// 동영상 autoplay 설정 함수
function setupVideoAutoplay() {
    const videos = document.querySelectorAll('video');
    console.log(`🎬 Found ${videos.length} videos to setup`);
    
    videos.forEach((video, index) => {
        // 모든 동영상에 playsinline 속성 추가 (모바일에서 전체화면 방지)
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', ''); // iOS Safari 호환성
        
        // autoplay를 위한 필수 속성들
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', ''); // autoplay를 위해 muted 필요
        video.setAttribute('loop', '');
        video.setAttribute('preload', 'metadata'); // 메타데이터 미리 로드
        
        // 볼륨을 0으로 설정 (muted와 함께 사용)
        video.volume = 0;
        video.muted = true;
        
        // 동영상이 로드되면 재생 시도
        video.addEventListener('loadeddata', function() {
            console.log(`📹 Video ${index} loaded, attempting autoplay`);
            attemptAutoplay(video, index);
        });
        
        // 메타데이터 로드 시에도 시도
        video.addEventListener('loadedmetadata', function() {
            console.log(`📊 Video ${index} metadata loaded`);
            attemptAutoplay(video, index);
        });
        
        // 재생 가능 상태가 되면 시도
        video.addEventListener('canplay', function() {
            console.log(`▶️ Video ${index} can play`);
            attemptAutoplay(video, index);
        });
        
        // 이미 로드된 경우 즉시 재생 시도
        if (video.readyState >= 2) {
            console.log(`⚡ Video ${index} already loaded, immediate attempt`);
            attemptAutoplay(video, index);
        }
        
        // 강제 로드 시도
        video.load();
    });
}

// 자동재생 시도 함수
function attemptAutoplay(video, index) {
    console.log(`Attempting autoplay for video ${index}:`, {
        paused: video.paused,
        muted: video.muted,
        readyState: video.readyState,
        autoplay: video.hasAttribute('autoplay'),
        playsinline: video.hasAttribute('playsinline')
    });
    
    // 약간의 지연을 두고 재생 시도 (브라우저 정책 우회)
    setTimeout(() => {
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log(`✅ Video ${index} autoplay successful`);
            }).catch(error => {
                console.log(`❌ Video ${index} autoplay prevented:`, error.name, error.message);
                
                // autoplay가 차단된 경우 사용자 상호작용 후 재생
                setupUserInteractionPlay(video, index);
            });
        } else {
            console.log(`⚠️ Video ${index} play() returned undefined`);
        }
    }, 100 * index); // 각 비디오마다 약간의 지연
}

// 사용자 상호작용 후 재생 설정
function setupUserInteractionPlay(video, index) {
    const playOnInteraction = () => {
        video.play().then(() => {
            console.log(`Video ${index} played after user interaction`);
        }).catch(console.log);
        
        // 이벤트 리스너 제거
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('keydown', playOnInteraction);
        document.removeEventListener('scroll', playOnInteraction);
    };
    
    // 다양한 사용자 상호작용 이벤트 등록
    document.addEventListener('click', playOnInteraction, { once: true });
    document.addEventListener('touchstart', playOnInteraction, { once: true });
    document.addEventListener('keydown', playOnInteraction, { once: true });
    document.addEventListener('scroll', playOnInteraction, { once: true });
}

// Intersection Observer를 사용한 동영상 재생 관리
function setupIntersectionObserver() {
    const videos = document.querySelectorAll('video');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // 화면에 보이면 재생
                video.play().catch(e => console.log('Play failed:', e));
            } else {
                // 화면에서 벗어나면 일시정지 (선택사항)
                // video.pause();
            }
        });
    }, {
        threshold: 0.5 // 50% 이상 보일 때 트리거
    });
    
    videos.forEach(video => {
        observer.observe(video);
    });
}

// 사용자 상호작용 감지 및 autoplay 활성화
function enableAutoplayAfterInteraction() {
    let hasInteracted = false;
    
    const enableAutoplay = () => {
        if (!hasInteracted) {
            hasInteracted = true;
            console.log('🎯 User interaction detected, enabling autoplay');
            
            const videos = document.querySelectorAll('video');
            videos.forEach((video, index) => {
                if (video.paused) {
                    attemptAutoplay(video, index);
                }
            });
        }
    };
    
    // 다양한 사용자 상호작용 이벤트 감지
    ['click', 'touchstart', 'keydown', 'scroll', 'mousemove'].forEach(event => {
        document.addEventListener(event, enableAutoplay, { once: true, passive: true });
    });
}

$(document).ready(function() {
    console.log('🚀 Page ready, initializing video autoplay system');
    
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
    
    // 사용자 상호작용 후 autoplay 활성화 설정
    enableAutoplayAfterInteraction();
    
    // 동영상 autoplay 설정 (즉시 시도)
    setupVideoAutoplay();
    
    // Intersection Observer 설정 (추가적인 재생 관리)
    setupIntersectionObserver();
    
    // 윈도우 리사이즈 시에도 체크 (데스크톱 ↔ 모바일 전환 시)
    window.addEventListener('resize', function() {
        setTimeout(setupVideoAutoplay, 100);
    });
    
    // 페이지 로드 완료 후 한 번 더 재생 시도
    window.addEventListener('load', function() {
        console.log('📄 Page fully loaded, attempting final autoplay');
        setTimeout(() => {
            const videos = document.querySelectorAll('video');
            videos.forEach((video, index) => {
                if (video.paused) {
                    console.log(`🔄 Retrying autoplay for paused video ${index}`);
                    attemptAutoplay(video, index);
                }
            });
        }, 1000);
    });

})
