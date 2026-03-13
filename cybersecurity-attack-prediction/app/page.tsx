"use client"

import Link from "next/link"
import { Shield, Activity, Lock, CheckCircle, BarChart3, Radio, Server, Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogTerminal } from "@/components/log-terminal"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">CyberGuard AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors flex items-center" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors flex items-center" href="#methodology">
            Methodology
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 flex flex-col items-center text-center bg-gradient-to-b from-background via-background to-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Cyber Attack Prediction
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl dark:text-gray-400 mt-4">
                  From Traditional ML to Generative AI: Advanced threat detection powered by Large Language Models.
                </p>
              </div>
              <div className="space-x-4 mt-8">
                <Link href="/login">
                  <Button className="h-10 px-8 text-base">View Dashboard</Button>
                </Link>
                <Link href="#methodology">
                  <Button variant="outline" className="h-10 px-8 text-base">View Project Details</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>



        <section className="w-full py-12 bg-black border-y border-border/20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Live Threat Simulation</h2>
                <p className="max-w-[700px] text-gray-400 md:text-lg">
                  Experience the AI's detection capabilities in real-time. Start the simulation to generate synthetic attack traffic.
                </p>
              </div>
            </div>
            <LogTerminal />
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">System Capabilities</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-lg">
                  Combining Random Forest classifiers with Generative AI for precise anomaly detection and detailed threat analysis.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Activity className="h-10 w-10 text-primary" />}
                title="Anomaly Detection"
                description="Identifies deviations in traffic patterns using unsupervised and supervised learning techniques."
              />
              <FeatureCard
                icon={<Fingerprint className="h-10 w-10 text-primary" />}
                title="Botnet Identification"
                description="Detects periodic and low-rate traffic signatures characteristic of Command & Control (C&C) botnets."
              />
              <FeatureCard
                icon={<Server className="h-10 w-10 text-primary" />}
                title="Malware Traffic Analysis"
                description="Analyzes packet sizes and protocols to flag potential malware communication and data exfiltration."
              />
              <FeatureCard
                icon={<BarChart3 className="h-10 w-10 text-primary" />}
                title="Traffic Benchmarking"
                description="Classifies network flows into Normal, DDoS, Scan, and other attack vectors with high precision."
              />
              <FeatureCard
                icon={<Radio className="h-10 w-10 text-primary" />}
                title="Real-Time Processing"
                description="Ingests network parameters instantly to provide immediate threat assessments."
              />
              <FeatureCard
                icon={<Lock className="h-10 w-10 text-primary" />}
                title="Secure Architecture"
                description="Built on a robust Flask backend with MongoDB integration for reliable log storage."
              />
            </div>
          </div>
        </section>

        <section id="methodology" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Methodology & Architecture
                </h2>
                <p className="text-muted-foreground mt-4 max-w-[800px] mx-auto">
                  This project implements a hybrid cybersecurity attack prediction model, transitioning from traditional ML to Generative AI.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 mt-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Hybrid Intelligence</h3>
                  <p className="text-muted-foreground">
                    We utilize a <strong>Random Forest Classifier</strong> for fast initial screening and <strong>Generative AI (via OpenRouter)</strong> for deep inspection and explanation of potential threats.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Feature Extraction: Protocol, Packet Size, Request Rate</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Label Encoding for categorical data (TCP, UDP, ICMP)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Multi-class classification for granular threat detection</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Tech Stack</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg border border-border">
                      <h4 className="font-bold mb-2">Backend</h4>
                      <p className="text-sm text-muted-foreground">Python, Flask, Scikit-learn, Pandas, NumPy</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg border border-border">
                      <h4 className="font-bold mb-2">Frontend</h4>
                      <p className="text-sm text-muted-foreground">Next.js, React, TailwindCSS, Recharts</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg border border-border">
                      <h4 className="font-bold mb-2">Database</h4>
                      <p className="text-sm text-muted-foreground">MongoDB (NoSQL)</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg border border-border">
                      <h4 className="font-bold mb-2">Deployment</h4>
                      <p className="text-sm text-muted-foreground">Localhost with automated shell scripts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-border bg-muted/20">
          <div className="container px-4 md:px-6 mx-auto flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">
              Project for Network Security Analysis
            </h2>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" className="px-8">Get Started</Button>
              </Link>
            </div>
          </div>
        </section>
      </main >
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-border">
        <p className="text-xs text-muted-foreground">© 2026 CyberGuard AI Project. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Documentation
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            GitHub Repo
          </Link>
        </nav>
      </footer>
    </div >
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center space-y-2 border border-border p-6 rounded-lg bg-card hover:bg-muted/50 transition-colors">
      <div className="p-2 bg-primary/10 rounded-full mb-2">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground text-center">
        {description}
      </p>
    </div>
  )
}
