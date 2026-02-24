// ============================================================
// Finance Simulator - Content Data
// ============================================================

// --- 診断フロー質問データ ---
const DIAGNOSIS_QUESTIONS = [
    {
        id: 'age',
        title: 'あなたの年齢は？',
        subtitle: '年齢に合った投資プランをご提案します',
        icon: '🎂',
        options: [
            { label: '20代', value: 20, score: 5 },
            { label: '30代', value: 30, score: 4 },
            { label: '40代', value: 40, score: 3 },
            { label: '50代', value: 50, score: 2 },
            { label: '60代以上', value: 60, score: 1 }
        ]
    },
    {
        id: 'income',
        title: '年収はどのくらい？',
        subtitle: '無理のない投資額を算出します',
        icon: '💼',
        options: [
            { label: '〜300万円', value: 300, score: 1 },
            { label: '300〜500万円', value: 500, score: 2 },
            { label: '500〜700万円', value: 700, score: 3 },
            { label: '700〜1000万円', value: 1000, score: 4 },
            { label: '1000万円以上', value: 1500, score: 5 }
        ]
    },
    {
        id: 'savings',
        title: '現在の貯蓄額は？',
        subtitle: '余裕資金の目安を把握します',
        icon: '🏦',
        options: [
            { label: '〜50万円', value: 50, score: 1 },
            { label: '50〜200万円', value: 200, score: 2 },
            { label: '200〜500万円', value: 500, score: 3 },
            { label: '500〜1000万円', value: 1000, score: 4 },
            { label: '1000万円以上', value: 1500, score: 5 }
        ]
    },
    {
        id: 'purpose',
        title: '投資の目的は？',
        subtitle: 'あなたに合ったゴールを設定します',
        icon: '🎯',
        options: [
            { label: '老後の生活資金', value: 'retirement', score: 3 },
            { label: '将来のマイホーム', value: 'house', score: 3 },
            { label: '子どもの教育費', value: 'education', score: 3 },
            { label: '資産を増やしたい', value: 'growth', score: 4 },
            { label: 'まだ決めていない', value: 'undecided', score: 2 }
        ]
    },
    {
        id: 'risk',
        title: '損失への考え方は？',
        subtitle: 'リスク許容度を判定します',
        icon: '📊',
        options: [
            { label: '絶対に損したくない', value: 'none', score: 1 },
            { label: '少しの損失なら耐えられる', value: 'low', score: 2 },
            { label: '一時的な下落は気にしない', value: 'medium', score: 3 },
            { label: '大きく増やすためならリスクOK', value: 'high', score: 4 },
            { label: '積極的にリスクを取りたい', value: 'aggressive', score: 5 }
        ]
    },
    {
        id: 'period',
        title: '何年くらい運用する予定？',
        subtitle: '時間は複利の最大の味方です',
        icon: '⏳',
        options: [
            { label: '〜5年', value: 5, score: 1 },
            { label: '5〜10年', value: 10, score: 2 },
            { label: '10〜20年', value: 20, score: 3 },
            { label: '20〜30年', value: 30, score: 4 },
            { label: '30年以上', value: 40, score: 5 }
        ]
    }
];

// --- リスクタイプ定義 ---
const RISK_TYPES = [
    {
        name: '安定重視型',
        icon: '🛡️',
        color: '#4FC3F7',
        returnRate: 3,
        monthlyAmount: 10000,
        description: '債券を中心とした安定的なポートフォリオ。大きなリターンより安心を重視します。',
        allocation: { bonds: 60, domestic: 15, foreign: 15, reit: 10 }
    },
    {
        name: 'やや安定型',
        icon: '🌿',
        color: '#81C784',
        returnRate: 4,
        monthlyAmount: 15000,
        description: '債券と株式をバランスよく配分。リスクを抑えながら着実に成長を目指します。',
        allocation: { bonds: 40, domestic: 25, foreign: 25, reit: 10 }
    },
    {
        name: 'バランス型',
        icon: '⚖️',
        color: '#FFD54F',
        returnRate: 5,
        monthlyAmount: 20000,
        description: '株式と債券を50:50でバランス配分。中長期で安定した成長が期待できます。',
        allocation: { bonds: 30, domestic: 30, foreign: 30, reit: 10 }
    },
    {
        name: 'やや積極型',
        icon: '🚀',
        color: '#FF8A65',
        returnRate: 6,
        monthlyAmount: 30000,
        description: '株式を中心としたポートフォリオ。高い成長を目指しつつ分散でリスク管理。',
        allocation: { bonds: 15, domestic: 30, foreign: 40, reit: 15 }
    },
    {
        name: '積極型',
        icon: '🔥',
        color: '#E57373',
        returnRate: 7,
        monthlyAmount: 50000,
        description: '株式に集中投資。最大のリターンを追求します。長期保有が前提です。',
        allocation: { bonds: 5, domestic: 25, foreign: 55, reit: 15 }
    }
];

// --- 教育コンテンツデータ ---
const EDUCATION_CARDS = [
    {
        id: 1,
        title: '投資はギャンブルじゃない',
        icon: '🎰❌',
        color: '#E57373',
        content: '<strong>ギャンブル</strong>は「誰かの損が誰かの得」になるゼロサムゲーム。<br><br>一方、<strong>投資</strong>は企業の成長に参加すること。世界経済が成長すれば、投資家全員が利益を得られる<strong>プラスサムゲーム</strong>です。',
        fact: '📈 世界の株式市場は過去30年で約8倍に成長'
    },
    {
        id: 2,
        title: '「長期・分散・積立」の3原則',
        icon: '🏆',
        color: '#FFD54F',
        content: '資産形成の王道は<strong>3つの原則</strong>：<br><br>🕐 <strong>長期</strong>：時間を味方にする<br>🌍 <strong>分散</strong>：リスクを分ける<br>💰 <strong>積立</strong>：コツコツ続ける<br><br>この3つを守れば、投資の成功確率は劇的に上がります。',
        fact: '📊 20年以上の長期投資では元本割れの確率はほぼ0%（過去データ）'
    },
    {
        id: 3,
        title: '複利は「人類最大の発明」',
        icon: '🧪',
        color: '#81C784',
        content: 'アインシュタインが<strong>「人類最大の発明」</strong>と呼んだ複利。<br><br>毎月1万円を年利5%で30年積み立てると…<br>元本360万円 → <strong>約832万円</strong>に！<br><br>利益が利益を生む。これが複利の魔法です。',
        fact: '✨ 投資期間が2倍になると、複利効果は3倍以上に'
    },
    {
        id: 4,
        title: 'NISAで税金がゼロに！',
        icon: '🏛️',
        color: '#4FC3F7',
        content: '通常、投資の利益には<strong>約20%の税金</strong>がかかります。<br><br>100万円の利益 → 手取り約80万円…<br><br>でも<strong>NISA口座</strong>なら税金が<strong>ゼロ</strong>！<br>100万円の利益がまるまる手元に残ります。国がくれた最強の制度です。',
        fact: '🎁 2024年から新NISAは年間360万円まで非課税'
    },
    {
        id: 5,
        title: '貯金だけだと実は「損」してる',
        icon: '💸',
        color: '#FF8A65',
        content: '銀行の金利は<strong>年0.001%</strong>程度。100万円預けても年間10円…<br><br>一方、インフレ率は<strong>年2〜3%</strong>。物価が上がると、お金の価値は毎年下がります。<br><br>10年後、同じ100万円で買えるものが<strong>約80万円分</strong>に減ってしまう可能性があります。',
        fact: '⚠️ 日本のインフレ率は2022年以降2%を超えて推移'
    },
    {
        id: 6,
        title: '世界経済は長期で「右肩上がり」',
        icon: '🌍',
        color: '#9575CD',
        content: 'リーマンショック、コロナショック…暴落は何度もありました。<br><br>でも世界の株式市場は、<strong>毎回必ず回復し、新高値を更新</strong>してきました。<br><br>一時的な下落で慌てて売ると損をする。<strong>持ち続けた人が勝つ</strong>のが投資の世界です。',
        fact: '📈 S&P500は過去50年で約150倍に成長'
    },
    {
        id: 7,
        title: '月5,000円から始められる',
        icon: '🪙',
        color: '#4DB6AC',
        content: '「投資は大金が必要」は完全な誤解！<br><br>今は<strong>月100円</strong>から投資信託を購入できます。まずは<strong>月5,000円</strong>など、コンビニのコーヒー1杯分/日 程度からスタートすればOK。<br><br>大切なのは金額の大きさではなく、<strong>早く始めること</strong>です。',
        fact: '☕ 1日166円 = 月5,000円から資産形成のスタートラインに'
    },
    {
        id: 8,
        title: '始めるベストタイミングは「今」',
        icon: '⏰',
        color: '#F06292',
        content: '「もっと勉強してから…」「タイミングを見てから…」<br><br>実は、投資で最も重要なのは<strong>「いつ買うか」ではなく「どれだけ長く持つか」</strong>です。<br><br>1年後に始めるのと今始めるのでは、30年後に<strong>数十万円の差</strong>がつくことも。複利は待ってくれません。',
        fact: '🏃 1年早く始めるだけで、30年後に約50万円の差（月2万円・年利5%の場合）'
    }
];

// --- クイズデータ ---
const QUIZ_QUESTIONS = [
    {
        question: '投資とギャンブルの最大の違いは？',
        options: [
            'リスクがあるかないか',
            '全員が利益を得られる可能性があるか',
            '政府が管理しているかどうか',
            '必要な金額の大きさ'
        ],
        correct: 1,
        explanation: '投資は企業の成長に参加する「プラスサムゲーム」。世界経済が成長すれば、投資家全員が利益を得られます。ギャンブルは誰かが損をしないと誰かが得をしない「ゼロサムゲーム」です。'
    },
    {
        question: 'NISAで非課税になるのは？',
        options: [
            '給料全体の税金',
            '投資で得た利益にかかる税金（約20%）',
            '消費税',
            '住民税'
        ],
        correct: 1,
        explanation: '通常、投資の利益には約20.315%の税金がかかりますが、NISA口座を使えばこの税金が非課税（ゼロ）になります。'
    },
    {
        question: '「複利」の効果を最大化するために最も重要なことは？',
        options: [
            '一度に大きな金額を投資する',
            'なるべく早く始めて長く続ける',
            '毎日株価をチェックする',
            '値上がりしたらすぐ売る'
        ],
        correct: 1,
        explanation: '複利は「利益が利益を生む」仕組みです。時間が長ければ長いほど、雪だるま式に資産が増えていきます。1年でも早く始めることが最大のポイントです。'
    },
    {
        question: '資産形成の王道「3原則」に含まれないのは？',
        options: [
            '長期保有',
            '分散投資',
            '集中投資',
            '積立投資'
        ],
        correct: 2,
        explanation: '資産形成の王道は「長期・分散・積立」の3原則です。一つの銘柄に集中する「集中投資」は上級者向けのハイリスク戦略であり、初心者にはおすすめしません。'
    },
    {
        question: '毎月1万円を年利5%で20年間積み立てると、いくらになる？',
        options: [
            '約240万円（元本のまま）',
            '約300万円',
            '約411万円',
            '約600万円'
        ],
        correct: 2,
        explanation: '元本240万円が複利の力で約411万円に成長します。約171万円は複利で生まれた利益です。これが「時間を味方にする」ということです。'
    }
];

// --- 証券口座比較データ ---
const BROKERS = [
    {
        name: 'SBI証券',
        logo: '🏢',
        color: '#0050A0',
        rating: 4.8,
        features: ['国内株式手数料 0円〜', 'NISA口座 No.1シェア', '投資信託 2,600本以上', 'Tポイント投資対応'],
        recommended: '総合力No.1。迷ったらここ',
        url: '#',
        badge: '👑 人気No.1'
    },
    {
        name: '楽天証券',
        logo: '🏪',
        color: '#BF0000',
        rating: 4.7,
        features: ['楽天ポイントで投資可能', '国内株式手数料 0円〜', '楽天カード積立でポイント還元', '投資信託 2,500本以上'],
        recommended: '楽天ユーザーなら最強',
        url: '#',
        badge: '💎 ポイントで投資'
    },
    {
        name: 'WealthNavi',
        logo: '🤖',
        color: '#1A237E',
        rating: 4.5,
        features: ['全自動おまかせ運用', '最短1分のプラン診断', '手数料 年1.1%', 'NISA対応'],
        recommended: '完全お任せしたいならこれ',
        url: '#',
        badge: '🤖 おまかせ運用'
    }
];

// --- バッジ定義 ---
const BADGES = [
    { name: '投資入門者', icon: '🌱', requirement: '診断を完了', minScore: 0 },
    { name: '知識の芽生え', icon: '🌿', requirement: '教育カードを全て読む', minScore: 0 },
    { name: '見習いアナリスト', icon: '📊', requirement: 'クイズで3問以上正解', minScore: 3 },
    { name: '資産形成マスター', icon: '🏆', requirement: 'クイズで全問正解', minScore: 5 },
    { name: '未来の投資家', icon: '🚀', requirement: '全コンテンツを体験', minScore: 0 }
];
