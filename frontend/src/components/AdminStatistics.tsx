import { useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar
} from "recharts";

interface Project {
  _id: string;
  title: string;
  developer: string;
  type: string;
  types?: string[];
  rate: string;
  techs: string[];
  langs: string[];
  image?: string;
  images?: string[];
  visit?: string;
  disc?: string;
  source?: string;
  createdAt?: string;
}

interface AdminStatisticsProps {
  projects: Project[];
}

const COLORS = ["#3498db", "#2ecc71", "#e74c3c", "#f1c40f", "#9b59b6", "#1abc9c", "#e67e22", "#34495e"];

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.4;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.5rem;
  transition: all var(--q-transition-speed) var(--q-transition-ease);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .chart-title {
    font-size: 0.7rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.5;
    color: #fff;
    margin-bottom: 1rem;
  }

  .chart-value {
    font-size: 2rem;
    font-weight: 900;
    color: #fff;
  }

  .chart-subtitle {
    font-size: 0.7rem;
    opacity: 0.4;
    color: #fff;
    margin-top: 0.25rem;
  }
`;

const RankList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .rank-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);

    &:last-child { border-bottom: none; }

    .rank-num {
      font-size: 0.65rem;
      font-weight: 900;
      opacity: 0.3;
      color: #fff;
      width: 20px;
    }

    .rank-label {
      flex: 1;
      font-size: 0.8rem;
      font-weight: 700;
      color: #fff;
    }

    .rank-bar {
      height: 6px;
      background: var(--main-color);
      border-radius: 3px;
      opacity: 0.6;
    }

    .rank-count {
      font-size: 0.7rem;
      font-weight: 900;
      color: var(--main-color);
      min-width: 24px;
      text-align: right;
    }
  }
`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(0,0,0,0.85)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '0.75rem 1rem',
      color: '#fff',
      fontSize: '0.75rem',
    }}>
      <div style={{ fontWeight: 900, marginBottom: '0.25rem' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color || '#fff' }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

const AdminStatistics = ({ projects }: AdminStatisticsProps) => {
  const { t } = useTranslation();

  const stats = useMemo(() => {
    const total = projects.length;

    const typeCounts: Record<string, number> = {};
    const langCounts: Record<string, number> = {};
    const techCounts: Record<string, number> = {};
    const devCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};
    const devTimeline: Record<string, Record<string, number>> = {};
    let totalRating = 0;
    let totalTechs = 0;
    let totalDescLen = 0;
    let withImage = 0;
    let withVisit = 0;
    const monthlyProjects: Record<string, number> = {};
    const cumulativeGrowth: { date: string; count: number }[] = [];
    const techByLang: Record<string, Record<string, number>> = {};
    const ratingByType: Record<string, { sum: number; count: number }> = {};
    const ratingByTech: Record<string, { sum: number; count: number }> = {};

    const sorted = [...projects].sort((a, b) =>
      new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    );

    let running = 0;
    const dateSet = new Set<string>();

    for (const p of projects) {
      const projectTypes = p.types || (p.type ? [p.type] : []);
      for (const ty of projectTypes) {
        typeCounts[ty] = (typeCounts[ty] || 0) + 1;
      }
      totalRating += +p.rate || 0;
      totalTechs += p.techs?.length || 0;
      totalDescLen += (p.disc || "").length;
      if (p.image || (p.images && p.images.length > 0)) withImage++;
      if (p.visit) withVisit++;

      for (const lang of p.langs || []) {
        langCounts[lang] = (langCounts[lang] || 0) + 1;
      }
      for (const tech of p.techs || []) {
        techCounts[tech] = (techCounts[tech] || 0) + 1;

        if (!techByLang[tech]) techByLang[tech] = {};
        for (const lang of p.langs || []) {
          techByLang[tech][lang] = (techByLang[tech][lang] || 0) + 1;
        }

        if (!ratingByTech[tech]) ratingByTech[tech] = { sum: 0, count: 0 };
        ratingByTech[tech].sum += +p.rate || 0;
        ratingByTech[tech].count++;
      }

      devCounts[p.developer] = (devCounts[p.developer] || 0) + 1;

      if (p.source) sourceCounts[p.source] = (sourceCounts[p.source] || 0) + 1;

      if (p.createdAt) {
        const d = new Date(p.createdAt);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthlyProjects[monthKey] = (monthlyProjects[monthKey] || 0) + 1;

        if (!devTimeline[p.developer]) devTimeline[p.developer] = {};
        devTimeline[p.developer][monthKey] = (devTimeline[p.developer][monthKey] || 0) + 1;

        dateSet.add(monthKey);
      }

      for (const ty of (p.types || [p.type])) {
        if (!ratingByType[ty]) ratingByType[ty] = { sum: 0, count: 0 };
        ratingByType[ty].sum += +p.rate || 0;
        ratingByType[ty].count++;
      }
    }

    for (const p of sorted) {
      running++;
      if (p.createdAt) {
        const d = new Date(p.createdAt);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const existing = cumulativeGrowth.find((g) => g.date === monthKey);
        if (existing) {
          existing.count = running;
        } else {
          cumulativeGrowth.push({ date: monthKey, count: running });
        }
      }
    }

    const sortedMonths = [...dateSet].sort();
    const topTechArr = Object.entries(techCounts).sort((a, b) => b[1] - a[1]);
    const topTechs = topTechArr.slice(0, 10);

    const ratingDist = [
      { name: "1-20", count: 0 },
      { name: "21-40", count: 0 },
      { name: "41-60", count: 0 },
      { name: "61-80", count: 0 },
      { name: "81-100", count: 0 },
    ];
    for (const p of projects) {
      const r = +p.rate || 0;
      if (r <= 20) ratingDist[0].count++;
      else if (r <= 40) ratingDist[1].count++;
      else if (r <= 60) ratingDist[2].count++;
      else if (r <= 80) ratingDist[3].count++;
      else ratingDist[4].count++;
    }

    const topRated = [...projects]
      .sort((a, b) => (+b.rate || 0) - (+a.rate || 0))
      .slice(0, 5);

    const typeArr = Object.entries(typeCounts).map(([name, value]) => ({ name: t(`portfolio.category.${name}`), value }));
    const langArr = Object.entries(langCounts).map(([name, value]) => ({ name, value }));
    const devArr = Object.entries(devCounts).sort((a, b) => b[1] - a[1]);
    const sourceArr = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

    const monthlyArr = sortedMonths.map((m) => ({
      date: m,
      count: monthlyProjects[m] || 0,
    }));

    const ratingByTypeArr = Object.entries(ratingByType).map(([type, data]) => ({
      name: t(`portfolio.category.${type}`),
      avg: data.count ? +(data.sum / data.count / 20).toFixed(1) : 0,
    }));

    const topTechForRating = topTechArr.slice(0, 10);
    const ratingByTechArr = topTechForRating.map(([tech]) => {
      const data = ratingByTech[tech];
      return {
        name: tech.toUpperCase(),
        avg: data.count ? +(data.sum / data.count / 20).toFixed(1) : 0,
      };
    });

    const topDevs = devArr.slice(0, 5).map(([name, value]) => ({ name, count: value }));
    const topSources = sourceArr.sort((a, b) => b.value - a.value).slice(0, 8);

    const words: Record<string, number> = {};
    for (const p of projects) {
      for (const w of (p.title || "").split(/\s+/).filter(Boolean)) {
        const wl = w.toLowerCase();
        words[wl] = (words[wl] || 0) + 1;
      }
    }
    const topWords = Object.entries(words).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, value]) => ({ name, value }));

    let mostActiveMonth = "";
    let mostActiveMonthCount = 0;
    for (const [m, c] of Object.entries(monthlyProjects)) {
      if (c > mostActiveMonthCount) {
        mostActiveMonthCount = c;
        mostActiveMonth = m;
      }
    }

    const months = Object.keys(monthlyProjects).sort();
    let thisMonthProjects = 0;
    let lastMonthProjects = 0;
    if (months.length >= 1) {
      thisMonthProjects = monthlyProjects[months[months.length - 1]] || 0;
    }
    if (months.length >= 2) {
      lastMonthProjects = monthlyProjects[months[months.length - 2]] || 0;
    }

    const avgProjectsPerMonth = months.length > 0 ? +(total / months.length).toFixed(1) : 0;

    const topTechLabels = topTechArr.slice(0, 10).map(([name]) => name);
    const techLangData = topTechLabels.map((tech) => {
      const byLang = techByLang[tech] || {};
      return {
        tech: tech.toUpperCase(),
        arabic: byLang["arabic"] || 0,
        english: byLang["english"] || 0,
      };
    });

    return {
      total, typeArr, langArr, monthlyArr, withImage, withVisit,
      topTechs, techLangData, totalTechs,
      ratingDist, topRated, ratingByTypeArr, ratingByTechArr,
      topDevs, topSources, totalRating, topWords,
      mostActiveMonth, mostActiveMonthCount,
      thisMonthProjects, lastMonthProjects, avgProjectsPerMonth,
      totalDescLen, cumulativeGrowth,
    };
  }, [projects, t]);

  const RAD = Math.PI / 180;
  const renderCustomPieLabel = ({ cx, cy, midAngle, outerRadius, name }: any) => {
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RAD);
    const y = cy + radius * Math.sin(-midAngle * RAD);
    return (
      <text x={x} y={y} fill="#fff" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={11} fontWeight={700} opacity={0.6}>
        {name}
      </text>
    );
  };

  return (
    <StatsContainer>
      {/* Category A: Project Overview */}
      <SectionTitle>{t("stats.section_overview")}</SectionTitle>
      <ChartGrid>
        <ChartCard>
          <div className="chart-title">{t("stats.a5_images")}</div>
          <div className="chart-value">{stats.withImage}<span style={{ fontSize: '1rem', opacity: 0.4 }}> / {stats.total}</span></div>
          <div className="chart-subtitle">{((stats.withImage / (stats.total || 1)) * 100).toFixed(0)}% {t("stats.a5_have_images")}</div>
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.a3_by_language")}</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stats.langArr} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={renderCustomPieLabel}>
                {stats.langArr.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.a2_by_type")}</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.typeArr} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.2)" fontSize={11} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {stats.typeArr.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.a4_over_time")}</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.monthlyArr}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name={t("stats.a4_projects_added")} fill="var(--main-color)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartGrid>

      {/* Category B: Technology Insights */}
      <SectionTitle>{t("stats.section_technology")}</SectionTitle>
      <ChartGrid>
        <ChartCard>
          <div className="chart-title">{t("stats.b1_top_technologies")}</div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={stats.topTechs.map(([name, value]) => ({ name: name.toUpperCase(), count: value }))} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.2)" fontSize={11} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name={t("stats.b1_usage_count")} radius={[0, 8, 8, 0]}>
                {stats.topTechs.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.b3_lang_vs_tech")}</div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={stats.techLangData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="tech" stroke="rgba(255,255,255,0.2)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "#fff", fontSize: 11 }} />
              <Bar dataKey="arabic" name="Arabic" fill="#e67e22" radius={[4, 4, 0, 0]} />
              <Bar dataKey="english" name="English" fill="#3498db" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.b4_avg_techs")}</div>
          <div className="chart-value">{stats.total > 0 ? (stats.totalTechs / stats.total).toFixed(1) : 0}</div>
          <div className="chart-subtitle">{t("stats.b4_per_project")}</div>
        </ChartCard>
      </ChartGrid>

      {/* Category C: Rating Analytics */}
      <SectionTitle>{t("stats.section_rating")}</SectionTitle>
      <ChartGrid>
        <ChartCard>
          <div className="chart-title">{t("stats.c1_average")}</div>
          <div className="chart-value" style={{
            color: (+stats.total > 0 ? stats.totalRating / stats.total / 20 : 0) >= 3.5 ? '#2ecc71' :
              (+stats.total > 0 ? stats.totalRating / stats.total / 20 : 0) >= 2.5 ? '#f1c40f' : '#e74c3c'
          }}>
            {(stats.total > 0 ? stats.totalRating / stats.total / 20 : 0).toFixed(1)} / 5
          </div>
          <div className="chart-subtitle">{t("stats.c1_across")} {stats.total} {t("stats.c1_projects")}</div>
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.c2_distribution")}</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.ratingDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name={t("stats.c2_projects")} radius={[6, 6, 0, 0]}>
                {stats.ratingDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.c4_by_type")}</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.ratingByTypeArr}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} domain={[0, 5]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avg" name={t("stats.c4_avg_rating")} radius={[6, 6, 0, 0]}>
                {stats.ratingByTypeArr.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.c5_by_tech")}</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.ratingByTechArr}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} domain={[0, 5]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avg" name={t("stats.c4_avg_rating")} radius={[6, 6, 0, 0]}>
                {stats.ratingByTechArr.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartGrid>

      {/* Category D: Developer Insights */}
      <SectionTitle>{t("stats.section_developer")}</SectionTitle>
      <ChartGrid>
        <ChartCard>
          <div className="chart-title">{t("stats.d1_per_developer")}</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.topDevs}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name={t("stats.d1_projects")} radius={[6, 6, 0, 0]}>
                {stats.topDevs.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.d3_top")}</div>
          {stats.topDevs.length > 0 ? (
            <>
              <div className="chart-value" style={{ fontSize: '1.4rem' }}>{stats.topDevs[0].name}</div>
              <div className="chart-subtitle">{stats.topDevs[0].count} {t("stats.d1_projects")}</div>
            </>
          ) : (
            <div className="chart-value" style={{ opacity: 0.3 }}>—</div>
          )}
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.d2_timeline")}</div>
          <RankList>
            {stats.topDevs.map((d, i) => (
              <div className="rank-item" key={d.name}>
                <span className="rank-num">{i + 1}</span>
                <span className="rank-label">{d.name}</span>
                <div className="rank-bar" style={{ width: `${(d.count / (stats.topDevs[0]?.count || 1)) * 80}px` }} />
                <span className="rank-count">{d.count}</span>
              </div>
            ))}
          </RankList>
        </ChartCard>
      </ChartGrid>

      {/* Category E: Content Analysis */}
      <SectionTitle>{t("stats.section_content")}</SectionTitle>
      <ChartGrid>
        <ChartCard>
          <div className="chart-title">{t("stats.e1_sources")}</div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={stats.topSources} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value" nameKey="name" label={renderCustomPieLabel}>
                {stats.topSources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.e3_avg_desc")}</div>
          <div className="chart-value">{stats.total > 0 ? Math.round(stats.totalDescLen / stats.total) : 0}</div>
          <div className="chart-subtitle">{t("stats.e3_chars")}</div>
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.e4_top_words")}</div>
          <RankList>
            {stats.topWords.map((w, i) => (
              <div className="rank-item" key={w.name}>
                <span className="rank-num">{i + 1}</span>
                <span className="rank-label">{w.name}</span>
                <div className="rank-bar" style={{ width: `${(w.value / (stats.topWords[0]?.value || 1)) * 80}px` }} />
                <span className="rank-count">{w.value}</span>
              </div>
            ))}
          </RankList>
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.e2_with_links")}</div>
          <div className="chart-value">{stats.withVisit}<span style={{ fontSize: '1rem', opacity: 0.4 }}> / {stats.total}</span></div>
          <div className="chart-subtitle">{((stats.withVisit / (stats.total || 1)) * 100).toFixed(0)}% {t("stats.a5_have_images")}</div>
        </ChartCard>
      </ChartGrid>

      {/* Category F: Growth & Trends */}
      <SectionTitle>{t("stats.section_growth")}</SectionTitle>
      <ChartGrid>
        <ChartCard>
          <div className="chart-title">{t("stats.f1_cumulative")}</div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.cumulativeGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" name={t("stats.f1_total")} stroke="var(--main-color)" fill="var(--main-color)" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.f3_this_vs_last")}</div>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.3, color: '#fff' }}>{t("stats.f3_this_month")}</div>
              <div className="chart-value" style={{ fontSize: '1.5rem' }}>{stats.thisMonthProjects}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.3, color: '#fff' }}>{t("stats.f3_last_month")}</div>
              <div className="chart-value" style={{ fontSize: '1.5rem' }}>{stats.lastMonthProjects}</div>
            </div>
          </div>
          {stats.lastMonthProjects > 0 && (
            <div className="chart-subtitle" style={{ color: stats.thisMonthProjects >= stats.lastMonthProjects ? '#2ecc71' : '#e74c3c' }}>
              {stats.thisMonthProjects >= stats.lastMonthProjects ? '+' : ''}
              {(((stats.thisMonthProjects - stats.lastMonthProjects) / stats.lastMonthProjects) * 100).toFixed(0)}% {t("stats.f3_change")}
            </div>
          )}
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.f2_most_active")}</div>
          {stats.mostActiveMonth ? (
            <>
              <div className="chart-value" style={{ fontSize: '1.4rem' }}>{stats.mostActiveMonth}</div>
              <div className="chart-subtitle">{stats.mostActiveMonthCount} {t("stats.d1_projects")}</div>
            </>
          ) : (
            <div className="chart-value" style={{ opacity: 0.3 }}>—</div>
          )}
        </ChartCard>

        <ChartCard>
          <div className="chart-title">{t("stats.f4_growth_rate")}</div>
          <div className="chart-value">{stats.avgProjectsPerMonth}</div>
          <div className="chart-subtitle">{t("stats.f4_per_month")}</div>
        </ChartCard>
      </ChartGrid>
    </StatsContainer>
  );
};

export default AdminStatistics;
