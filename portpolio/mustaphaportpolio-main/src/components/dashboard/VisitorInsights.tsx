import { BarChart3, Users, Eye, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { useAnalyticsSummary } from "@/hooks/useAnalytics";

export function VisitorInsights() {
  const { data: summary, isLoading } = useAnalyticsSummary();

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!summary) return null;

  const { totalVisits, monthlyData, topPages } = summary;

  // Calculate this month visitors (last entry in monthlyData usually)
  const currentMonthStr = new Date().toISOString().substring(0, 7);
  const thisMonthData = monthlyData.find(d => d.month === currentMonthStr);
  const thisMonthVisitors = thisMonthData ? thisMonthData.visitors : 0;

  const maxMonthlyVisitors = Math.max(...monthlyData.map(d => d.visitors), 10); // Prevent div by zero
  const totalViews = totalVisits; // Simplified for now, assuming 1 visit = 1 view roughly for this counting method

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users size={20} className="text-primary" />
            </div>
            <span className="text-muted-foreground text-sm">Total Visits</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalVisits.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">All time aggregated</p>
        </div>

        <div className="bg-card rounded-xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Calendar size={20} className="text-accent" />
            </div>
            <span className="text-muted-foreground text-sm">This Month</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{thisMonthVisitors}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={12} className="text-primary" />
            <span className="text-xs text-primary">Active now</span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Eye size={20} className="text-primary" />
            </div>
            <span className="text-muted-foreground text-sm">Top Page</span>
          </div>
          <p className="text-xl font-bold text-foreground truncate">
            {topPages[0] ? topPages[0].path : "-"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Most visited section</p>
        </div>

        <div className="bg-card rounded-xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 size={20} className="text-primary" />
            </div>
            <span className="text-muted-foreground text-sm">Avg. Daily</span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {Math.round(thisMonthVisitors / 30)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Estim. based on month</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Visitors Chart */}
        <div className="bg-card rounded-2xl p-6 card-shadow">
          <h3 className="font-semibold text-foreground mb-6">Traffic Trends</h3>
          {monthlyData.length > 0 ? (
            <div className="flex items-end gap-4 h-48">
              {monthlyData.slice(-6).map((data, index) => (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-sm font-medium text-foreground mb-2">
                      {data.visitors}
                    </span>
                    <div
                      className="w-full hero-gradient rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${(data.visitors / maxMonthlyVisitors) * 140}px`,
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground mt-2 text-[10px] sm:text-sm truncate w-full text-center">{data.month}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No traffic data yet
            </div>
          )}
        </div>

        {/* Most Viewed Sections */}
        <div className="bg-card rounded-2xl p-6 card-shadow">
          <h3 className="font-semibold text-foreground mb-6">Most Viewed Pages</h3>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={page.path}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <span className="text-foreground font-medium truncate max-w-[200px]">{page.path}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {page.count} visits
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full hero-gradient rounded-full transition-all duration-700"
                    style={{ width: `${(page.count / totalVisits) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {topPages.length === 0 && (
              <div className="text-muted-foreground text-center py-8">No page views recorded yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
