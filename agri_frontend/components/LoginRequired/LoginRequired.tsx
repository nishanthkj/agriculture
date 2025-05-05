'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IconLock } from '@tabler/icons-react'; // Ensure this is the correct import
import { animate, createScope, createSpring, createDraggable } from 'animejs'; // Correct import for anime.js
import gsap from 'gsap'; // Import GSAP for animations
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function LoginRequired() {
  const root = useRef(null);
  // const lightRef = useRef(null); // Ref for the light effect
  const scope = useRef<{ revert: () => void } | null>(null); // Type with revert method
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    // GSAP animation for the card element (appearing effect)
    if (root.current) {
      gsap.fromTo(
        root.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }

    // anime.js scope and animation logic
    const scopeInstance = createScope({ root });
    scopeInstance.add(() => {
      // Bouncing animation loop for the lock icon (anime.js)
      animate('.logo', {
        scale: [
          { to: 1.25, ease: 'inOut(3)', duration: 200 },
          { to: 1, ease: createSpring({ stiffness: 300 }) }
        ],
        loop: true,
        loopDelay: 250,
      });

      // Make the logo draggable (anime.js draggable feature)
      createDraggable('.logo', {
        container: [0, 0, 0, 0],
        releaseEase: createSpring({ stiffness: 200 })
      });
    });

    // Store the scope instance in the ref
    scope.current = scopeInstance;

    // Cleanup when the component unmounts, using scope without current
    return () => {
      if (scope.current) {
        scope.current.revert(); // Correctly use revert method
      }
    };
  }, []);

  const handleLogin = () => {
    // Redirect the user to the login page
    router.push('/login');
  };

  const handleSignup = () => {
    // Redirect the user to the signup page
    router.push('/signup');
  };

  return (
    <div ref={root} className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="relative w-full max-w-md">
        {/* Floating light following the cursor */}
        {/* <div
          ref={lightRef}
          className="absolute rounded-full bg-yellow-300 opacity-75"
          style={{
            width: 30,
            height: 30,
            cursor: 'default', // Prevent cursor from changing to pointer
          }}
        ></div> */}

        {/* Card with login/signup buttons */}
        <div className="flex-1 ">
          <Card className="shadow-2xl rounded-2xl border-2 border-green-200">
            <CardContent className="p-8 space-y-6 text-center">
              <div className="flex justify-center">
                <IconLock
                  className="logo text-green-600"
                  size={48}
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Authentication Required</h2>
              <p className="text-muted-foreground text-sm">
                Please log in or sign up to access this agriculture management feature.
              </p>
              <div className="flex flex-col gap-3 mt-4">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-700 hover:bg-green-100"
                  onClick={handleSignup}
                >
                  Create New Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
