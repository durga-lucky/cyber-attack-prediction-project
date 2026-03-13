import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, BarChart3, Lock } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Real-time Protection",
    description: "Monitor and detect cyber threats in real-time with advanced AI algorithms.",
  },
  {
    icon: Zap,
    title: "Fast Analysis",
    description: "Get instant predictions on network traffic patterns with sub-second response times.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Comprehensive dashboards and reports to visualize security trends and patterns.",
  },
  {
    icon: Lock,
    title: "Proactive Defense",
    description: "Identify potential threats before they become critical security incidents.",
  },
]

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">About Cyber Guard</h2>
        <p className="text-muted-foreground">Advanced AI-powered cybersecurity threat detection system</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Mission Statement</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            Cyber Guard is a cutting-edge cybersecurity platform designed to predict and prevent cyber attacks before
            they happen. Using machine learning algorithms and real-time network traffic analysis, we provide
            organizations with the tools they need to stay one step ahead of cyber threats.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Built with modern technologies including Next.js, TypeScript, and Tailwind CSS. Our AI models are trained on
            millions of network traffic samples to ensure accurate threat detection.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Next.js", "TypeScript", "Tailwind CSS", "Machine Learning", "Real-time Analytics"].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
