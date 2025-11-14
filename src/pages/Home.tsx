import { Link } from "react-router-dom";
import { Plus, List, Sparkles, Users, Star, Tag as TagIcon, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useStatistics } from "@/hooks/useEntries";
import { Card } from "@/components/ui/card";

const Home = () => {
  const { data: stats, isLoading } = useStatistics();

  const statCards = [
    {
      icon: Users,
      label: "Total Entries",
      value: stats?.total || 0,
      color: "bg-gradient-primary",
    },
    {
      icon: Star,
      label: "Favorites",
      value: stats?.favorites || 0,
      color: "bg-gradient-secondary",
    },
    {
      icon: TagIcon,
      label: "Tags",
      value: stats ? Object.keys(stats.byTag).length : 0,
      color: "bg-gradient-accent",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center fade-in">
          {/* Hero Section */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 gradient-bg opacity-10 blur-3xl rounded-full"></div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Your Digital Memory Book</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                Welcome to Slam Book
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Create, share, and cherish memories with your friends. A modern digital slam book to keep your
                friendships alive forever! 💫
              </p>
            </div>
          </div>

          {/* Statistics Dashboard */}
          {!isLoading && stats && stats.total > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Your Statistics</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
                {statCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold mb-1 bg-gradient-primary bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Link
              to="/create"
              className="group bg-card rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                Create Entry
              </h2>
              <p className="text-muted-foreground">Start a new slam book entry and share your story with friends</p>
            </Link>

            <Link
              to="/entries"
              className="group bg-card rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-secondary"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <List className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-foreground group-hover:text-secondary transition-colors">
                View Entries
              </h2>
              <p className="text-muted-foreground">Browse through all the amazing slam book entries</p>
            </Link>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { emoji: "✨", text: "Beautiful Design" },
              { emoji: "📱", text: "Mobile Friendly" },
              { emoji: "🔍", text: "Advanced Search" },
              { emoji: "💾", text: "Export/Import" },
            ].map((feature, index) => (
              <Card key={index} className="p-4 hover:bg-muted transition-colors duration-300">
                <div className="text-3xl mb-2">{feature.emoji}</div>
                <p className="text-sm font-medium text-foreground">{feature.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
