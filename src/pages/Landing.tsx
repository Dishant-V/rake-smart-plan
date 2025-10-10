import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Factory,
  TrendingUp,
  Zap,
  Shield,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/Layout/Header";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-accent" />,
      title: "AI-Powered Optimization",
      description:
        "Advanced machine learning algorithms optimize rake formation and dispatch scheduling in real-time.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-accent" />,
      title: "Predictive Analytics",
      description:
        "Forecast delivery times with high accuracy and minimize delays with intelligent route planning.",
    },
    {
      icon: <Shield className="h-8 w-8 text-accent" />,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with role-based access control and comprehensive audit trails.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-molten opacity-10 dark:opacity-20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-steel opacity-5 dark:opacity-10" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block mb-4">
              <Factory className="h-20 w-20 text-primary mx-auto" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-steel bg-clip-text text-transparent">
              Smart Rake Formation & Dispatch
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Optimize your steel logistics with AI-powered decision support.
              Reduce costs, minimize delays, and maximize efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-steel hover:opacity-90 transition-opacity text-lg"
                onClick={() => navigate("/auth")}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg hover:bg-primary/10"
                onClick={() => navigate("/materials")}
              >
                Browse Materials
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to optimize your rake operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="glass-card glass-hover p-8 h-full">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-steel opacity-20 dark:opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join SAIL Rake DSS today and experience the future of steel
              logistics management.
            </p>
            <Button
              size="lg"
              className="bg-gradient-copper hover:opacity-90 transition-opacity text-lg"
              onClick={() => navigate("/auth")}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Factory className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold">SAIL Rake DSS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 SAIL. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
