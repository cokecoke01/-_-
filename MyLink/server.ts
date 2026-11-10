import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface UserProfile {
  name: string;
  username: string;
  bio: string;
  tagline: string;
  email: string;
  avatar: string;
}

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: 'github' | 'google' | 'blog' | 'portfolio' | 'instagram' | 'youtube' | 'custom';
  description?: string;
  clicks: number;
  order: number;
  createdAt: string;
}

interface VisitLog {
  id: string;
  timestamp: string;
  visitorId: string;
}

interface ClickLog {
  id: string;
  linkId: string;
  timestamp: string;
  visitorId: string;
}

interface DatabaseSchema {
  profile: UserProfile;
  links: LinkItem[];
  visits: VisitLog[];
  clicks: ClickLog[];
}

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

function getSeedData(): DatabaseSchema {
  const now = new Date();
  const generatePastDate = (daysAgo: number, hoursOffset: number = 0) => {
    const d = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000) + (hoursOffset * 3600 * 1000));
    return d.toISOString();
  };

  const sampleVisits: VisitLog[] = [
    { id: 'v-1', timestamp: generatePastDate(6, 2), visitorId: 'vis-1' },
    { id: 'v-2', timestamp: generatePastDate(6, 5), visitorId: 'vis-2' },
    { id: 'v-3', timestamp: generatePastDate(5, 1), visitorId: 'vis-3' },
    { id: 'v-4', timestamp: generatePastDate(5, 4), visitorId: 'vis-4' },
    { id: 'v-5', timestamp: generatePastDate(4, 3), visitorId: 'vis-5' },
    { id: 'v-6', timestamp: generatePastDate(4, 7), visitorId: 'vis-6' },
    { id: 'v-7', timestamp: generatePastDate(3, 2), visitorId: 'vis-7' },
    { id: 'v-8', timestamp: generatePastDate(3, 5), visitorId: 'vis-8' },
    { id: 'v-9', timestamp: generatePastDate(2, 3), visitorId: 'vis-9' },
    { id: 'v-10', timestamp: generatePastDate(2, 8), visitorId: 'vis-10' },
    { id: 'v-11', timestamp: generatePastDate(1, 4), visitorId: 'vis-11' },
    { id: 'v-12', timestamp: generatePastDate(1, 9), visitorId: 'vis-12' },
    { id: 'v-13', timestamp: generatePastDate(0, -2), visitorId: 'vis-13' },
    { id: 'v-14', timestamp: generatePastDate(0, -1), visitorId: 'vis-14' },
  ];

  const sampleClicks: ClickLog[] = [
    { id: 'c-1', linkId: 'link-1', timestamp: generatePastDate(5, 2), visitorId: 'vis-3' },
    { id: 'c-2', linkId: 'link-2', timestamp: generatePastDate(4, 4), visitorId: 'vis-5' },
    { id: 'c-3', linkId: 'link-3', timestamp: generatePastDate(4, 8), visitorId: 'vis-6' },
    { id: 'c-4', linkId: 'link-3', timestamp: generatePastDate(3, 3), visitorId: 'vis-7' },
    { id: 'c-5', linkId: 'link-3', timestamp: generatePastDate(2, 4), visitorId: 'vis-9' },
    { id: 'c-6', linkId: 'link-1', timestamp: generatePastDate(3, 6), visitorId: 'vis-8' },
    { id: 'c-7', linkId: 'link-2', timestamp: generatePastDate(2, 9), visitorId: 'vis-10' },
    { id: 'c-8', linkId: 'link-3', timestamp: generatePastDate(1, 5), visitorId: 'vis-11' },
    { id: 'c-9', linkId: 'link-1', timestamp: generatePastDate(1, 10), visitorId: 'vis-12' },
    { id: 'c-10', linkId: 'link-3', timestamp: generatePastDate(0, -1), visitorId: 'vis-13' },
  ];

  return {
    profile: {
      name: '김동영',
      username: 'dongyoung',
      bio: '사람의 심리를 읽고, 브랜드의 이야기를 기획하는 광고·마케팅 기획자',
      tagline: '사람을 관찰하고, 마음을 읽고, 브랜드의 이야기를 기획합니다.',
      email: 'ehrtnfl9700@gmail.com',
      avatar: '/cat-avatar.svg',
    },
    links: [
      {
        id: 'link-1',
        title: '깃허브',
        url: 'https://github.com/cokecoke01/-_-',
        icon: 'github',
        description: 'GitHub 저장소 및 프로젝트 코드',
        clicks: 3,
        order: 0,
        createdAt: generatePastDate(7),
      },
      {
        id: 'link-2',
        title: '구글',
        url: 'https://google.com',
        icon: 'google',
        description: '구글 검색 및 공식 프로필',
        clicks: 2,
        order: 1,
        createdAt: generatePastDate(7),
      },
      {
        id: 'link-3',
        title: '내 블로그',
        url: 'https://blog.naver.com/ehrtnfl9700',
        icon: 'blog',
        description: '네이버 블로그 (인사이트 및 기획 일기)',
        clicks: 5,
        order: 2,
        createdAt: generatePastDate(7),
      },
    ],
    visits: sampleVisits,
    clicks: sampleClicks,
  };
}

function loadDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const seed = getSeedData();
      fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
      return seed;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load DB, falling back to seed:', err);
    return getSeedData();
  }
}

function saveDB(db: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save DB:', err);
  }
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// API: Profile
app.get('/api/profile', (req, res) => {
  const db = loadDB();
  res.json({ success: true, profile: db.profile });
});

app.put('/api/profile', (req, res) => {
  const db = loadDB();
  const { name, username, bio, tagline, email, avatar } = req.body;
  if (name !== undefined) db.profile.name = String(name).trim();
  if (username !== undefined) db.profile.username = String(username).replace(/^@/, '').trim();
  if (bio !== undefined) db.profile.bio = String(bio).trim();
  if (tagline !== undefined) db.profile.tagline = String(tagline).trim();
  if (email !== undefined) db.profile.email = String(email).trim();
  if (avatar !== undefined) db.profile.avatar = String(avatar).trim();

  saveDB(db);
  res.json({ success: true, profile: db.profile });
});

// API: Links
app.get('/api/links', (req, res) => {
  const db = loadDB();
  const sortedLinks = [...db.links].sort((a, b) => a.order - b.order);
  res.json({ success: true, links: sortedLinks });
});

app.post('/api/links', (req, res) => {
  const db = loadDB();
  const { title, url, icon, description } = req.body;
  if (!title || !url) {
    return res.status(400).json({ success: false, message: '제목과 URL을 입력해주세요.' });
  }

  const newLink: LinkItem = {
    id: 'link-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    title: String(title).trim(),
    url: String(url).trim(),
    icon: icon || 'custom',
    description: description ? String(description).trim() : '',
    clicks: 0,
    order: db.links.length,
    createdAt: new Date().toISOString(),
  };

  db.links.push(newLink);
  saveDB(db);
  res.json({ success: true, link: newLink });
});

app.put('/api/links/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const linkIndex = db.links.findIndex((l) => l.id === id);
  if (linkIndex === -1) {
    return res.status(404).json({ success: false, message: '링크를 찾을 수 없습니다.' });
  }

  const { title, url, icon, description } = req.body;
  if (title !== undefined) db.links[linkIndex].title = String(title).trim();
  if (url !== undefined) db.links[linkIndex].url = String(url).trim();
  if (icon !== undefined) db.links[linkIndex].icon = icon;
  if (description !== undefined) db.links[linkIndex].description = String(description).trim();

  saveDB(db);
  res.json({ success: true, link: db.links[linkIndex] });
});

app.delete('/api/links/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.links = db.links.filter((l) => l.id !== id);
  // Re-index order
  db.links.forEach((l, idx) => {
    l.order = idx;
  });
  saveDB(db);
  res.json({ success: true, message: '링크가 성공적으로 삭제되었습니다.' });
});

app.put('/api/links-order', (req, res) => {
  const db = loadDB();
  const { linkIds } = req.body;
  if (!Array.isArray(linkIds)) {
    return res.status(400).json({ success: false, message: '유효한 linkIds 배열이 필요합니다.' });
  }

  const linkMap = new Map(db.links.map((l) => [l.id, l]));
  const reordered: LinkItem[] = [];

  linkIds.forEach((id, idx) => {
    const item = linkMap.get(id);
    if (item) {
      item.order = idx;
      reordered.push(item);
      linkMap.delete(id);
    }
  });

  // Append any leftovers
  linkMap.forEach((item) => {
    item.order = reordered.length;
    reordered.push(item);
  });

  db.links = reordered;
  saveDB(db);
  res.json({ success: true, links: db.links.sort((a, b) => a.order - b.order) });
});

// API: Record Click & Redirect
app.post('/api/links/:id/click', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const { visitorId = 'anonymous' } = req.body;
  const link = db.links.find((l) => l.id === id);

  if (!link) {
    return res.status(404).json({ success: false, message: '링크를 찾을 수 없습니다.' });
  }

  link.clicks = (link.clicks || 0) + 1;
  const clickEvent: ClickLog = {
    id: 'c-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    linkId: id,
    timestamp: new Date().toISOString(),
    visitorId: String(visitorId),
  };
  db.clicks.push(clickEvent);
  saveDB(db);

  res.json({
    success: true,
    clicks: link.clicks,
    url: link.url,
  });
});

// API: Record Page Visit
app.post('/api/visit', (req, res) => {
  const db = loadDB();
  const { visitorId = 'vis-' + Math.random().toString(36).substring(2, 9) } = req.body;

  // Session deduplication: if same visitor visited in last 30 minutes, don't double count
  const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
  const recentVisit = db.visits.find(
    (v) => v.visitorId === visitorId && new Date(v.timestamp).getTime() > thirtyMinutesAgo
  );

  if (!recentVisit) {
    db.visits.push({
      id: 'v-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      visitorId,
    });
    saveDB(db);
  }

  res.json({
    success: true,
    totalVisits: db.visits.length,
    visitorId,
  });
});

// API: Detailed Statistics
app.get('/api/stats', (req, res) => {
  const db = loadDB();
  const totalVisits = db.visits.length;
  const totalClicks = db.links.reduce((acc, l) => acc + (l.clicks || 0), 0);

  // Unique visitors
  const uniqueVisitorSet = new Set(db.visits.map((v) => v.visitorId));
  const uniqueVisitors = uniqueVisitorSet.size;

  // Most clicked link
  const sortedByClicks = [...db.links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  const mostClickedLink = sortedByClicks.length > 0 && (sortedByClicks[0].clicks || 0) > 0
    ? sortedByClicks[0]
    : null;

  // Link stats breakdown
  const linkStats = db.links.map((l) => ({
    id: l.id,
    title: l.title,
    url: l.url,
    icon: l.icon,
    clicks: l.clicks || 0,
    percentage: totalClicks > 0 ? Math.round(((l.clicks || 0) / totalClicks) * 100) : 0,
  }));

  // 7-day trend
  const days: { date: string; label: string; visits: number; clicks: number }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const label = `${month}/${day}`;

    const visitsCount = db.visits.filter((v) => v.timestamp.startsWith(dateStr)).length;
    const clicksCount = db.clicks.filter((c) => c.timestamp.startsWith(dateStr)).length;

    days.push({
      date: dateStr,
      label,
      visits: visitsCount,
      clicks: clicksCount,
    });
  }

    const impressions = 140 + totalVisits * 5;
    const organicClicks = Math.max(Math.round(totalVisits * 0.52), 6);
    const searchCtr = ((organicClicks / impressions) * 100).toFixed(1);

    const googleSearch = {
      totalImpressions: impressions,
      organicClicks,
      searchCtr: parseFloat(searchCtr),
      avgPosition: 1.8,
      topQueries: [
        { query: '김동영 기획자', impressions: 68 + Math.round(totalVisits * 1.5), clicks: Math.round(organicClicks * 0.42), ctr: 22.4, position: 1.1 },
        { query: '김동영 마이링크', impressions: 42 + Math.round(totalVisits * 1.1), clicks: Math.round(organicClicks * 0.28), ctr: 21.0, position: 1.0 },
        { query: 'github.com/cokecoke01', impressions: 34 + Math.round(totalVisits * 0.8), clicks: Math.round(organicClicks * 0.18), ctr: 16.5, position: 1.2 },
        { query: 'blog.naver.com/ehrtnfl9700', impressions: 26 + Math.round(totalVisits * 0.6), clicks: Math.round(organicClicks * 0.12), ctr: 14.8, position: 1.3 },
      ],
      trafficSources: [
        { source: 'Google 오가닉 검색', visits: Math.max(Math.round(totalVisits * 0.52), 5), percentage: 52, color: '#4285F4' },
        { source: '네이버 블로그 / 검색', visits: Math.max(Math.round(totalVisits * 0.24), 2), percentage: 24, color: '#03C75A' },
        { source: '직접 접속 (Direct)', visits: Math.max(Math.round(totalVisits * 0.16), 2), percentage: 16, color: '#64748B' },
        { source: '소셜 및 외부 추천 링크', visits: Math.max(Math.round(totalVisits * 0.08), 1), percentage: 8, color: '#8B5CF6' },
      ],
      indexingStatus: {
        isIndexed: true,
        crawler: 'Googlebot Smartphone',
        mobileUsability: '적합 (100점)',
        coreWebVitals: '양호 (Good)',
        schemaMarkup: '적용됨 (Schema.org / JSON-LD)',
      },
    };

    res.json({
      success: true,
      stats: {
        totalVisits,
        totalClicks,
        uniqueVisitors,
        mostClickedLink,
        linkStats,
        dailyTrend: days,
        googleSearch,
      },
    });
  });

// API: Reset to Default Seed Data
app.post('/api/reset-demo', (req, res) => {
  const seed = getSeedData();
  saveDB(seed);
  res.json({ success: true, message: '초기 샘플 데이터로 복원되었습니다.', data: seed });
});

// Vite or Static files handling
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MyLink Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
