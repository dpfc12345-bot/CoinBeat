export interface CryptoTerm {
  term: string;
  short: string;
  detail: string;
}

export const CRYPTO_TERMS: CryptoTerm[] = [
  { term: '김치프리미엄', short: '국내 시세가 해외보다 비싸게 형성되는 현상', detail: '한국 거래소 가격이 해외 거래소보다 높게 형성되는 현상이에요. 국내 투자 수요가 몰리거나 자금 이동이 제한될 때 커지는 경향이 있어요.' },
  { term: 'FOMO', short: '흐름을 놓칠까 봐 조급하게 매수하는 심리', detail: '"Fear Of Missing Out"의 줄임말로, 가격이 급등할 때 소외되기 싫어 따라 매수하는 심리를 말해요. 고점에서 진입하게 만드는 대표적인 심리적 함정이에요.' },
  { term: 'HODL', short: '가격 변동에도 장기 보유하는 투자 방식', detail: '"Hold"의 오타에서 유래한 크립토 커뮤니티 은어로, 단기 등락에 흔들리지 않고 장기간 보유하는 전략을 뜻해요.' },
  { term: '스테이킹', short: '코인을 예치하고 보상을 받는 방식', detail: '보유한 코인을 네트워크에 예치해 검증 과정에 참여시키고, 그 대가로 이자와 비슷한 보상을 받는 방식이에요.' },
  { term: '스테이블코인', short: '가격이 법정화폐에 고정된 코인', detail: '달러 등 법정화폐 가치에 고정되도록 설계된 코인이에요. 대표적으로 USDT, USDC가 있으며 가격 변동을 피하는 용도로 자주 쓰여요.' },
  { term: '도미넌스', short: '전체 시장에서 비트코인이 차지하는 비중', detail: '전체 암호화폐 시가총액 중 비트코인이 차지하는 비율이에요. 도미넌스가 오르면 자금이 비트코인으로, 내리면 알트코인으로 쏠리는 경향이 있어요.' },
  { term: '반감기', short: '비트코인 채굴 보상이 절반으로 줄어드는 시점', detail: '비트코인은 약 4년마다 채굴 보상이 절반으로 줄어들도록 설계되어 있어요. 공급이 줄어드는 이벤트라 시장의 관심이 큰 시점이에요.' },
  { term: '고래', short: '시세에 영향을 줄 만큼 많이 보유한 투자자', detail: '대량의 코인을 보유해 매매만으로도 시세에 영향을 줄 수 있는 투자자나 지갑을 가리키는 말이에요.' },
  { term: '온체인 데이터', short: '블록체인에 기록된 거래·이동 데이터', detail: '거래소 밖에서 이뤄지는 지갑 간 이동, 보유량 변화 등 블록체인에 직접 기록된 데이터를 뜻해요. 고래의 움직임을 추적할 때 자주 참고돼요.' },
  { term: '에어드랍', short: '조건 충족 시 무료로 코인을 나눠주는 이벤트', detail: '특정 조건(보유, 활동 이력 등)을 만족한 지갑에 프로젝트가 무료로 코인을 배포하는 이벤트예요.' },
  { term: '디파이(DeFi)', short: '은행 없이 이뤄지는 탈중앙 금융 서비스', detail: '"Decentralized Finance"의 줄임말로, 은행 같은 중개기관 없이 블록체인 위에서 대출·예치·거래가 이뤄지는 금융 서비스를 말해요.' },
  { term: '유동성', short: '자산을 빠르게 사고팔 수 있는 정도', detail: '자산을 가격 변동 없이 빠르게 사고팔 수 있는 정도를 뜻해요. 유동성이 낮으면 적은 거래량에도 가격이 크게 흔들릴 수 있어요.' },
  { term: '숏스퀴즈', short: '하락에 베팅한 매도가 강제 청산되며 급등하는 현상', detail: '가격 하락에 베팅(공매도)한 투자자들이 예상과 달리 가격이 오르면서 강제로 청산당해 매수가 몰리고, 이 때문에 가격이 더 급등하는 현상이에요.' },
  { term: '알트코인', short: '비트코인을 제외한 나머지 암호화폐', detail: '"Alternative Coin"의 줄임말로, 비트코인을 제외한 모든 암호화폐를 통칭하는 말이에요.' },
  { term: '반등', short: '하락 후 일시적으로 가격이 다시 오르는 구간', detail: '큰 하락 이후 일시적으로 가격이 다시 오르는 구간을 말해요. 추세 전환인지 일시적 회복인지는 시간이 지나야 확인할 수 있어요.' },
];

function dayOfYear(date: Date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((now - start) / 86_400_000);
}

/** Deterministic "term of the day" — same term all day, rotates daily. */
export function getTermOfTheDay(date: Date = new Date()): CryptoTerm {
  const index = dayOfYear(date) % CRYPTO_TERMS.length;
  return CRYPTO_TERMS[index];
}
