// 모든 문장 카드
const items = Array.from(document.querySelectorAll(".phrase-item"));
const toast = document.getElementById("toast");

let currentIndex = -1; // 현재 선택된 카드 인덱스

// 선택 상태 변경 함수
function setSelected(index) {
  if (items.length === 0) return;

  // 범위 보정
  if (index < 0) index = 0;
  if (index > items.length - 1) index = items.length - 1;

  // 기존 선택 해제
  if (currentIndex >= 0) {
    items[currentIndex].classList.remove("selected");
  }

  // 새 선택 적용
  currentIndex = index;
  items[currentIndex].classList.add("selected");

  // 화면에 항상 보이도록 스크롤
  items[currentIndex].scrollIntoView({
    block: "nearest",
    behavior: "smooth",
  });
}

// 텍스트 복사
function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(showToast)
      .catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

// 구형 브라우저용 복사
function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    showToast();
  } catch (e) {
    alert("복사에 실패했습니다. 직접 복사해 주세요, 전하.");
  }
  document.body.removeChild(textarea);
}

// 토스트 메시지
let toastTimer = null;

function showToast() {
  if (!toast) return;
  toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1200);
}

// 마우스로 클릭했을 때도 복사 + 선택 동기화
items.forEach((item, index) => {
  item.addEventListener("click", () => {
    setSelected(index);
    const text = item.innerText.trim();
    copyText(text);
  });
});

// 방향키 + 엔터로 조작
document.addEventListener("keydown", (event) => {
  if (items.length === 0) return;

  if (event.key === "ArrowDown") {
    event.preventDefault();
    // 아직 아무 카드도 선택 안 된 상태라면 첫 번째 선택
    if (currentIndex === -1) {
      setSelected(0);
    } else {
      setSelected(currentIndex + 1);
    }
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    if (currentIndex === -1) {
      setSelected(0);
    } else {
      setSelected(currentIndex - 1);
    }
  } else if (event.key === "Enter") {
    if (currentIndex >= 0) {
      event.preventDefault();
      const item = items[currentIndex];
      const text = item.innerText.trim();
      copyText(text);
    }
  }
});

// 페이지 로드 시 기본으로 첫 번째 카드 선택해두고 싶다면 아래 주석 해제
// if (items.length > 0) {
//   setSelected(0);
