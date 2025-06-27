
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import PokerChip from "@/components/three/PokerChip";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <main className="h-full">
      <section className="container mx-auto px-4 h-full flex items-center justify-center">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="text-center md:text-left animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-primary leading-tight">
              Where Legends
              <br />
              Are Forged
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-md mx-auto md:mx-0 text-balance">
              Join the most thrilling online poker tournaments. Compete against players worldwide, claim victory, and write your own story.
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4">
              <Button size="lg" className="text-lg animate-glow" asChild>
                <Link to="/tournaments">Join a Tournament</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg" asChild>
                <Link to="/learn">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="w-full h-[400px] md:h-[500px]">
            <Canvas camera={{ position: [0, 2.5, 3.5], fov: 50 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[5, 5, 5]} intensity={2} />
                <PokerChip />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
