import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl font-bold text-primary mb-2">About Wild Poker</h1>
          <p className="text-muted-foreground mb-8">The ultimate destination for poker enthusiasts.</p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Our mission is to provide a fair, fun, and competitive online poker environment for players of all skill levels. We believe in the spirit of the game and are dedicated to creating a community built on respect and a passion for poker.</p>
            </CardContent>
          </Card>
          <Card>
             <CardHeader>
              <CardTitle>Meet the (Fictional) Team</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around items-center pt-6">
                <div className="text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-2 border-2 border-primary">
                        <AvatarImage src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=faces&cs=tinysrgb&w=256&h=256&fit=crop" alt="Jack Black" />
                        <AvatarFallback>JB</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">Jack "Ace" Black</h3>
                    <p className="text-sm text-muted-foreground">Founder & CEO</p>
                </div>
                <div className="text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-2 border-2 border-primary">
                        <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&q=85&fm=jpg&crop=faces&cs=tinysrgb&w=256&h=256&fit=crop" alt="Quinn Silver" />
                        <AvatarFallback>QS</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">Quinn "Queen" Silver</h3>
                    <p className="text-sm text-muted-foreground">Head of Operations</p>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Card>
            <CardHeader>
              <CardTitle>Why Choose Wild Poker?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Unmatched Security</h4>
                  <p>Your funds and data are protected with state-of-the-art encryption and security protocols.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Certified Fair Play</h4>
                  <p>Our random number generator (RNG) is certified by independent auditors to ensure a fair game for everyone.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">24/7 Support</h4>
                  <p>Our dedicated support team is available around the clock to assist you with any questions or issues.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
