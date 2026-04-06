# 뭐먹지 (lunch-roulette)

앱인토스 미니앱. 전체 계획서: ~/appintoss/docs/appintoss_plan.md §5-②

## 앱 정보
- appName: `lunch-roulette`
- displayName: `뭐먹지` (granite.config.ts = 콘솔 = index.html title 동일 필수)
- primaryColor: `#E85D04`
- port: 5174

## 핵심 기능
- 룰렛 스핀으로 점심 메뉴 랜덤 추천
- 메뉴 커스텀 추가/제거 (storage 기반)
- 결과 공유
- 전면형 광고: 결과 확정 후

## 주의사항
- 자체 뒤로가기 버튼 구현 금지
- TDS 컴포넌트만 사용 (`@toss/tds-mobile`)
- 광고는 테스트 ID 사용 중인지 확인 후 운영 ID로 교체
