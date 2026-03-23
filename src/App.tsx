import React, { useState, useCallback, useRef } from 'react';
import { Button, Badge } from '@toss/tds-mobile';
import {
  menus,
  pickMenu,
  addToWeekRecord,
  getWeekRecord,
  CATEGORIES,
  TAGS,
  type Category,
  type Tag,
} from './data/menus';

function getMenuEmoji(name: string, category: Category): string {
  // 구체적인 패턴 먼저
  if (/게살/.test(name)) return '🍱';
  if (/갈비탕|갈비국/.test(name)) return '🍲';
  if (/꽃게탕|꽃게찜/.test(name)) return '🦀';
  if (/초밥|스시|사시미|치라시|이나리|스시롤/.test(name)) return '🍣';
  if (/라멘|우동|소바|칼국수|국수|냉면|막국수|팟타이|쌀국수|락사|미고랭|완탄|우육면|탄탄면|호키엔|완짜이|하카/.test(name)) return '🍜';
  if (/파스타|라자냐|알리오|봉골레|카르보나라|뇨끼/.test(name)) return '🍝';
  if (/피자/.test(name)) return '🍕';
  if (/버거|햄버거/.test(name)) return '🍔';
  if (/스테이크|안심|등심|립아이/.test(name)) return '🥩';
  if (/삼겹살|목살|항정살|차돌|베이컨|훈제/.test(name)) return '🥓';
  if (/갈비|막창|대창|불막창|곱창/.test(name)) return '🍖';
  if (/보쌈|수육|족발/.test(name)) return '🥩';
  if (/치킨|닭갈비|닭볶음|닭도리|닭한마|닭강정|닭꼬치|가라아게|치킨난반|탄두리/.test(name)) return '🍗';
  if (/새우/.test(name)) return '🦐';
  if (/연어/.test(name)) return '🐟';
  if (/참치|도미|방어|광어/.test(name)) return '🐠';
  if (/꽃게|대게|킹크랩/.test(name)) return '🦀';
  if (/랍스터/.test(name)) return '🦞';
  if (/굴/.test(name)) return '🦪';
  if (/오징어|꼴뚜기/.test(name)) return '🦑';
  if (/낙지|문어|산낙지/.test(name)) return '🐙';
  if (/전복|관자|가리비|호타테/.test(name)) return '🐚';
  if (/샐러드/.test(name)) return '🥗';
  if (/카레|커리/.test(name)) return '🍛';
  if (/찌개|전골|뚝배기/.test(name)) return '🫕';
  if (/탕|해장국|곰탕|설렁탕|매생이|황태국|북어국/.test(name)) return '🍲';
  if (/떡볶이|어묵|순대|소떡/.test(name)) return '🍢';
  if (/김밥|삼각/.test(name)) return '🍙';
  if (/샌드위치|토스트|파니니|크루아상|랩/.test(name)) return '🥪';
  if (/타코/.test(name)) return '🌮';
  if (/부리또|케밥|샤와르마/.test(name)) return '🌯';
  if (/덮밥|비빔밥|볶음밥|나시|카오팟|루로우/.test(name)) return '🍱';
  if (/만두|딤섬|소룡포|교자/.test(name)) return '🥟';
  if (/리조또/.test(name)) return '🍚';
  if (/오믈렛|달걀|계란|에그/.test(name)) return '🍳';
  if (/수프|스프|비스크|차우더|클램/.test(name)) return '🥣';
  if (/샤부샤부|나베/.test(name)) return '🫕';
  if (/파전|빈대떡|녹두전/.test(name)) return '🥘';
  if (/팔라펠|사모사|도사/.test(name)) return '🧆';
  if (/아보카도/.test(name)) return '🥑';
  if (/팬케이크|브런치|에그베네딕트/.test(name)) return '🍳';
  if (/붕어빵|호떡|꽈배기|군고구마/.test(name)) return '🥐';
  if (/콘도그|핫도그|핫바/.test(name)) return '🌭';
  if (/치즈볼/.test(name)) return '🧀';
  if (/회$|육회|홍어/.test(name)) return '🐠';
  if (/월남쌈|스프링롤|짜조/.test(name)) return '🥬';
  const fallbacks: Record<Category, string> = {
    '한식': '🍲', '중식': '🥟', '일식': '🍣',
    '양식': '🍽️', '분식': '🍢', '아시안': '🍜',
  };
  return fallbacks[category];
}

export default function App() {
  const [current, setCurrent] = useState(() => menus[Math.floor(Math.random() * menus.length)]);
  const [excludeCategories, setExcludeCategories] = useState<Category[]>([]);
  const [excludeTags, setExcludeTags] = useState<Tag[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [weekRecord] = useState(() => getWeekRecord());
  const cardRef = useRef<HTMLDivElement>(null);

  const spin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);

    const next = pickMenu(excludeCategories, excludeTags, current.name);
    if (!next) {
      setIsSpinning(false);
      setNoResult(true);
      setTimeout(() => setNoResult(false), 2000);
      return;
    }
    setNoResult(false);

    if (cardRef.current) {
      cardRef.current.classList.remove('slot-spin');
      void cardRef.current.offsetWidth;
      cardRef.current.classList.add('slot-spin');
    }

    setTimeout(() => {
      setCurrent(next);
      addToWeekRecord(next.category);
      setIsSpinning(false);
    }, 400);
  }, [isSpinning, excludeCategories, excludeTags, current.name]);

  function handleShare() {
    const text = `오늘 점심 "${current.name}" 어때?\n같이 정해보자 👉 점심 룰렛`;
    if (navigator.share) {
      navigator.share({ title: '점심 룰렛', text });
    } else {
      navigator.clipboard.writeText(text).then(() => alert('복사됐어요!'));
    }
  }

  function toggleCategory(cat: Category) {
    setExcludeCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function toggleTag(tag: Tag) {
    setExcludeTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  const weekEntries = Object.entries(weekRecord)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  const activeFilters = excludeCategories.length + excludeTags.length;
  const emoji = getMenuEmoji(current.name, current.category);

  return (
    <div style={styles.container}>

      {/* 히어로 */}
      <div style={styles.hero}>
        <div ref={cardRef} style={styles.card}>
          <div style={styles.emojiWrap}>
            <span style={styles.emoji}>{emoji}</span>
          </div>
          <h1 style={styles.menuText}>{current.name}</h1>
        </div>
      </div>

      {/* 바디 */}
      <div style={styles.body}>

        {/* 배지 */}
        <div style={styles.badgeRow}>
          <Badge variant="weak" color="blue" size="medium">{current.category}</Badge>
          {current.tags.map((tag) => (
            <Badge key={tag} variant="weak" color="red" size="medium">{tag}</Badge>
          ))}
        </div>

        {/* 주간 기록 — 가장 많이 뽑은 카테고리 TOP3 */}
        {weekEntries.length > 0 && (
          <p style={styles.weekText}>
            이번 주 {weekEntries.map(([cat, count], i) => (
              <span key={cat}>{cat} {count}번{i < weekEntries.length - 1 ? ' · ' : ''}</span>
            ))} 뽑았어요
          </p>
        )}

        {/* 버튼 */}
        <div style={styles.actions}>
          <Button display="full" size="xlarge" color="dark" onClick={spin} loading={isSpinning}>
            {noResult ? '조건에 맞는 메뉴가 없어요' : '다시 뽑기'}
          </Button>
          <button style={styles.shareBtn} onClick={handleShare}>
            친구한테 공유하기
          </button>
        </div>

        {/* 필터 */}
        <div style={styles.filterSection}>
          <button style={styles.filterToggle} onClick={() => setFilterOpen(!filterOpen)}>
            <span style={styles.filterToggleText}>
              {activeFilters > 0 ? `${activeFilters}개 제외 중` : '빼고 싶은 거 있나요?'}
            </span>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              style={{ transform: filterOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
            >
              <path d="M6 9l6 6 6-6" stroke="#d1d6db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {filterOpen && (
            <div style={styles.filterChips}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  style={{ ...styles.chip, ...(excludeCategories.includes(cat) ? styles.chipActive : {}) }}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                  {excludeCategories.includes(cat) && <span style={styles.chipX}>✕</span>}
                </button>
              ))}
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  style={{ ...styles.chip, ...(excludeTags.includes(tag) ? styles.chipActive : {}) }}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {excludeTags.includes(tag) && <span style={styles.chipX}>✕</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={styles.adSlot} />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
  },
  hero: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    padding: '72px 24px 32px',
    minHeight: '46vh',
  },
  card: {
    width: '100%',
  },
  emojiWrap: {
    marginBottom: '16px',
    lineHeight: 1,
  },
  emoji: {
    fontSize: '76px',
    display: 'block',
  },
  menuText: {
    fontSize: '56px',
    fontWeight: 900,
    color: '#191f28',
    letterSpacing: '-3px',
    lineHeight: 1.0,
    wordBreak: 'keep-all',
    overflowWrap: 'break-word',
  },
  body: {
    padding: '0 24px',
    display: 'flex',
    flexDirection: 'column',
  },
  badgeRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '20px',
  },
  weekText: {
    fontSize: '13px',
    color: '#b0b8c1',
    marginBottom: '20px',
    lineHeight: 1.5,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    marginBottom: '28px',
  },
  shareBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    fontWeight: 500,
    color: '#8b95a1',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    letterSpacing: '-0.3px',
    fontFamily: 'inherit',
  },
  filterSection: {
    borderTop: '1px solid #f2f4f6',
    paddingTop: '16px',
  },
  filterToggle: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 0',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  filterToggleText: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#8b95a1',
  },
  filterChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '14px',
    paddingBottom: '16px',
  },
  chip: {
    padding: '7px 14px',
    borderRadius: '99px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#6b7684',
    background: '#f9fafb',
    border: '1px solid #f2f4f6',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  },
  chipActive: {
    background: '#191f28',
    color: '#ffffff',
    border: '1px solid #191f28',
  },
  chipX: {
    fontSize: '10px',
    opacity: 0.6,
  },
  adSlot: {
    minHeight: '60px',
    marginTop: 'auto',
    paddingBottom: '24px',
  },
};
