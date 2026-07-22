import { BarChart3, Users, Eye, TrendingUp, Calendar } from "lucide-react";

interface MonthlyData {
  month: string;
  visitors: number;
}

export function VisitorInsights() {
  // Sample data - will be populated from database
  const totalVisitors = 1247;
  const thisMonthVisitors = 328;
  const monthlyData: MonthlyData[] = [
    { month: "Sep", visitors: 245 },
    { month: "Oct", visitors: 312 },
    { month: "Nov", visitors: 362 },
    { month: "Dec", visitors: 328 },
  ];

  const topSections = [
    { name: "Projects", views: 456, percentage: 36.6 },
    { name: "Skills", views: 389, percentage: 31.2 },
    { name: "About", views: 245, percentage: 19.6 },
    { name: "Certificates", views: 157, percentage: 12.6 },
  ];

  const maxMonthlyVisitors = Math.max(...monthlyData.map(d => d.visitors));

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users size={20} className="text-primary" />
            </div>
            <span className="text-muted-foreground text-sm">Total Visitors</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalVisitors.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
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
            <span className="text-xs text-primary">+5.2% vs last month</span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Eye size={20} className="text-primary" />
            </div>
            <span className="text-muted-foreground text-sm">Avg. Daily</span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {Math.round(thisMonthVisitors / 30)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Visitors per day</p>
        </div>

        <div className="bg-card rounded-xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 size={20} className="text-primary" />
            </div>
            <span className="text-muted-foreground text-sm">Page Views</span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {(totalVisitors * 2.3).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">2.3 pages/visit avg</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Visitors Chart */}
        <div className="bg-card rounded-2xl p-6 card-shadow">
          <h3 className="font-semibold text-foreground mb-6">Monthly Visitors</h3>
          <div className="flex items-end gap-4 h-48">
            {monthlyData.map((data, index) => (
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
                <span className="text-sm text-muted-foreground mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Viewed Sections */}
        <div className="bg-card rounded-2xl p-6 card-shadow">
          <h3 className="font-semibold text-foreground mb-6">Most Viewed Sections</h3>
          <div className="space-y-4">
            {topSections.map((section, index) => (
              <div key={section.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <span className="text-foreground font-medium">{section.name}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {section.views} views ({section.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full hero-gradient rounded-full transition-all duration-700"
                    style={{ width: `${section.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-secondary/50 rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Note:</span> Analytics data is displayed for demonstration purposes. 
          Connect to a backend to track real visitor data.
        </p>
      </div>
    </div>
  );
}
