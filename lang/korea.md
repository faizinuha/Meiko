# ⚡ Meiko

<p align="center">
  <img src="../assets/icons1.jpeg" alt="Meiko Logo" width="100" style="border-radius: 30px;" /><hr>
</p>
 **Meiko** 는 코딩 경험을 단순화하도록 설계된 Visual Studio Code 확장 프로그램입니다. 네 가지 프로그래밍 언어를 지원하며, 다양한 템플릿을 통해 코드 작성 과정을 빠르고 쉽게 만들어줍니다.

![Meiko](https://img.shields.io/badge/Meiko-Meiko-blue)
![Meiko](https://img.shields.io/badge/Meiko-Meiko-blue)

<p align="center">
🐱‍👤 -> 
  <strong><a href="https://github.com/faizinuha/Meiko/blob/main/lang/JP.md">일본어</a></strong>
  <strong><a href="https://github.com/faizinuha/Meiko/blob/main/lang/EN.md">영어</a></strong>
  <strong><a href="https://github.com/faizinuha/Meiko/blob/main/lang/ID.md">인도네시아어</a></strong>
  <strong><a href="https://github.com/faizinuha/Meiko/blob/main/lang/china.md">중국어</a></strong>
</p>

## 💖 기부

이 확장 프로그램이 마음에 들고 개발자를 지원하고 싶으시다면 기부를 고려해 주세요!

<a href="https://saweria.co/C02V">
    <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="捐赠图标" width="150" />
</a>
|
<a href="https://ko-fi.com/mahiro885">
    <img src="../assets/image.png" alt="捐赠图标" width="40" />
</a>

---

## 🚀 주요 기능 데모

다음은 Meiko의 주요 기능 목록입니다:

- 🌐 **다국어 지원**: 네 가지 프로그래밍 언어 지원.
- 📋 **스니펫 템플릿**: 코드 작성 속도를 높이기 위한 다양한 템플릿 제공.
- ⚡ **Emmet 대안**: Visual Studio Code에서 Emmet을 활성화하지 않은 사용자 지원.

## 📥 사용 방법

1. **확장 프로그램 설치**:
   - 🛒 Visual Studio Code 마켓플레이스 열기.
   - 🔍 **Meiko** 검색 및 다운로드.
2. **코딩 경험 즐기기**:
   - ⚡ 더 쉽고 간단한 코딩 경험을 위해 제공된 다양한 단축키 사용.

---

## 🤝 기여

버그를 발견하거나 개선 아이디어가 있다면:

- 🛠️ **풀 리퀘스트를 생성**하세요.
- 🐞 **[GitHub 저장소](https://github.com/faizinuha/Meiko)에서 문제를 보고**하세요.

---

## 📂 기능

### 파일 확장자 변환기
다양한 프레임워크의 짧은 파일 이름을 전체 이름으로 변환하는 새로운 기능:

#### 프레임워크 지원:
- 🌐 **Laravel**: `.b.p` → `.blade.php` 또는 `.b.php` → `.blade.php`
- 🔄 **Ruby on Rails**: `.e.rb` → `.html.erb` 또는 `.erb.h` → `.html.erb`
- ⚛️ **React/Next.js**: 
  - `.j.tsx` → `.jsx.tsx`
  - `.tsx.c` → `.component.tsx` 
  - `.p.tsx` → `.page.tsx`
- 📱 **Vue.js**:
  - `.v.js` → `.vue.js`
  - `.v.c` → `.vue.component.js`
- 🅰️ **Angular**:
  - `.c.ts` → `.component.ts`
  - `.s.ts` → `.service.ts`
  - `.m.ts` → `.module.ts`
- 🎯 **Svelte**: `.s.svelte` → `.svelte`
- 🐘 **PHP**: `.t.php` → `.template.php`
- 🐍 **Django/Python**:
  - `.d.py` → `.django.py`
  - `.v.py` → `.view.py`
  - `.t.py` → `.template.py`

### 새로운 Meiko CLI 터미널

#### **Laravel Solid**
Laravel Solid는 깔끔하고 사용하기 쉬운 초기 구성으로 솔리드한 구조의 Laravel 프로젝트를 준비하는 데 도움을 주는 기능입니다.

#### **Coders Solid**
이 기능을 통해 사용자는 추가 개발을 위해 준비된 기본 Laravel 프레임워크를 빠르게 설정할 수 있습니다. 주요 특징:

- 🛠️ **기본 설치**: 
  - 체계적인 디렉토리 구조.
  - 소규모에서 중규모 프로젝트를 위한 기본 구성 파일.
- ⏱️ **시간 효율성**: 파일을 수동으로 재구성할 필요 없이 프로젝트 시작.

#### **Coders-delete**
생성된 프로젝트가 사용되지 않는 경우 Laravel 폴더나 파일을 삭제하는 기능입니다.

- 🚮 **빠른 삭제**: 사용자 시간 절약.
- 🔒 **데이터 보안**: 선택한 프로젝트 폴더에 대해서만 삭제 프로세스 진행.

---

### 💻 **Coders-crud CLI**

Laravel CRUD 생성을 위한 간단한 CLI:

1. ⌨️ `Ctrl + J`로 **터미널 열기**.
2. `coders-crud <NameProject>` 입력.
3. 🎉 처음부터 만들 필요 없이 **필요에 따라 편집**.
4. 🚀 제한 없이 이 CLI 사용.

---

### 스니펫

#### 🏗️ **HTML**

- 🖋️ **BSS**: 최신 Bootstrap 링크가 포함된 Doctype.
- 🖋️ **DCS**: Bootstrap 링크가 없는 Doctype.
- 🖋️ **tbl**: 기본 테이블.
- 🖋️ **Footer**: 기본 푸터.
- 🖋️ **list**: 기본 리스트.
- 🖋️ **Image**: 간단한 폼.
- 🖋️ **HtmlForm**: HTML 상세 정보 및 요약.
- ⏳ **출시 예정**: 추가 세부 사항.

#### 🛠️ **Laravel 스니펫**

- 📜 **Blade Layout**: 기본 Blade 템플릿.
- 📜 **bladenav**: 네비게이션 바 생성.
- 📜 **bladeFooter**: 기본 푸터.
- 📜 **bladeContent**: 기본 콘텐츠 표시.
- 🔒 **MiddlewareRoute**: 미들웨어가 있는 라우트 정의.
- 🌐 **route**: 기본 라우트.
- 🔄 **forelse**: Blade의 `forelse`.
- 🔄 **foreach**: Blade의 `foreach`.
- 📊 **Query**: 기본 Laravel 쿼리.
- 🛠️ **Crud Mod**: Laravel CRUD 템플릿.
- ✅ **Validate 2x5**: Laravel 쿼리 검증 템플릿.

#### ⚡ **Laravel 쿼리 기능**

- 🔍 **Query Builder**: `when`, `orWhere`, `orWhereRaw` 등의 절.
- 📚 **Eloquent ORM**: 데이터베이스 관리를 위한 객체 지향 접근 방식.

---

#### ☕ **Java**

- 🌀 **Javasegitinga**: 삼각형 패턴 생성.
- ⭐ **Javastar**: 별 패턴 생성.
- 👋 **Javahello**: Hello World 프로그램.
- ➕ **Javapenjumlahan**: 두 숫자의 덧셈.
- ⏳ **출시 예정**: 계산기 빌드 2.5.4.

---

#### 🛠️ **Vue.js**

- 🏗️ **Vue Button Flex Layout**: Vue.js의 버튼 및 flex 레이아웃 스타일링.
- 🏗️ **Count Vue**: 카운터를 위한 간단한 Vue 3 스니펫.
- 🏗️ **Vue List Rendering**: Vue 3의 v-for를 사용한 리스트 렌더링 스니펫.
- 🏗️ **Vue Two-Way Binding**: Vue 3의 v-model을 사용한 양방향 바인딩 스니펫.
- 🏗️ **Vue Modal Component**: Vue 3의 간단한 모달 생성 스니펫.
- 🏗️ **Vue Form Component**: Vue 3의 간단한 폼 생성 스니펫.

<hr>

# 📝 라이선스:
Copyright (c) 2024 Zaky Development

이로써 본 소프트웨어와 관련 문서 파일("소프트웨어")의 사본을 얻는 모든 사람에게
소프트웨어를 제한 없이 다룰 수 있는 권한을 무료로 부여합니다.
여기에는 소프트웨어의 사본을 사용, 복사, 수정, 병합, 게시, 배포, 서브라이선스 및/또는 판매할 수 있는
권리가 제한 없이 포함되며, 소프트웨어를 제공받는 사람에게 그렇게 할 수 있도록 허용하는 것도 포함됩니다.