// 페이지가 로드되면 버튼 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', addPost);
});

// 게시글 추가 함수
function addPost() {
    const authorInput = document.getElementById('author');
    const contentInput = document.getElementById('content');
    const imageInput = document.getElementById('image');
    const postsContainer = document.getElementById('postsContainer');

    // 1. 유효성 검사
    if (authorInput.value.trim() === "" || contentInput.value.trim() === "") {
        alert("이름과 내용을 모두 입력해주세요! ✏️");
        return;
    }

    // 2. 게시글 카드 구조 생성
    const postCard = document.createElement('div');
    postCard.className = 'post-card';

    // 3. 작성 시간 생성 (년-월-일 시:분)
    const now = new Date();
    const timeString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 4. 게시글 텍스트 내용 조립 (XSS 공격 방지 적용)
    let postHTML = `
        <div class="post-header">
            <span class="post-author">${escapeHtml(authorInput.value)}</span>
            <span>${timeString}</span>
        </div>
        <p class="post-content">${escapeHtml(contentInput.value)}</p>
    `;

    // 5. 이미지 파일이 있는지 확인 후 처리
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        
        // 이미지 변환이 완료되면 실행되는 함수
        reader.onload = function(e) {
            postHTML += `<img src="${e.target.result}" class="post-image" alt="첨부 이미지">`;
            postCard.innerHTML = postHTML;
            postsContainer.prepend(postCard); // 최신글을 맨 위로 추가
        };
        
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        // 이미지가 없을 때는 텍스트만 바로 추가
        postCard.innerHTML = postHTML;
        postsContainer.prepend(postCard);
    }

    // 6. 입력창 비우기 (다음 입력을 위해)
    authorInput.value = '';
    contentInput.value = '';
    imageInput.value = '';
}

// 보안용 특수문자 변환 함수 (학생들이 이상한 코드를 넣는 것을 방지)
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}