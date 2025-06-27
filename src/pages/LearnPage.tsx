
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LearnPage = () => {
  return (
    <>
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-bold text-primary mb-2">Learn to Play Poker</h1>
        <p className="text-muted-foreground mb-8">From basics to advanced strategies, we've got you covered.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <Card>
          <CardHeader>
            <CardTitle>The Basics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Understand hand rankings, betting rounds, and basic poker terminology.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Beginner Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Learn about starting hands, position, and when to bet, call, or fold.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Advanced Concepts</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Dive into pot odds, bluffing, and reading your opponents.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LearnPage;
