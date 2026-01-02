import { Keyboard, Lock, Sparkles } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const features = [
    {
        title: "Smart Scheduling",
        description:
            "AI-powered scheduling that understands your time. Just describe your event, and Questfully handles the rest.",
        icon: Sparkles,
    },
    {
        title: "Keyboard First",
        description:
            "Navigate your entire calendar without leaving your keyboard. Efficiency at your fingertips.",
        icon: Keyboard,
    },
    {
        title: "Privacy First",
        description:
            "Your data stays yours. Open source and built with privacy as a core principle, just like our other apps.",
        icon: Lock,
    },
];

export function Features() {
    return (
        <section className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-3">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        className="border-muted/40 bg-background/60 shadow-sm transition-all hover:bg-muted/20"
                    >
                        <CardHeader>
                            <feature.icon className="size-10 text-primary mb-2" />
                            <CardTitle className="text-xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-base">
                                {feature.description}
                            </CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
