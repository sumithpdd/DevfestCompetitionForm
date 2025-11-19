"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Upload, Users } from "lucide-react";
import { UserNav } from "@/components/UserNav";
import { UserButton } from "@/components/UserButton";
import { AuthModal } from "@/components/AuthModal";
import { useAuthContext } from "@/lib/AuthContext";
import { useState } from "react";

export default function Home() {
  const { isAuthenticated } = useAuthContext();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/devfest-london-logo.png" 
              alt="DevFest London 2025" 
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <UserNav />
                <UserButton />
              </>
            ) : (
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowAuthModal(true)}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Banner */}
        <div className="text-center mb-12">
          <div className="relative w-full max-w-2xl mx-auto mb-8">
            <Image 
              src="/AI_Innovation_Hub.png" 
              alt="AI Innovation Hub" 
              width={800}
              height={200}
              className="w-full h-auto rounded-xl shadow-md"
              priority
            />
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            AI Innovation Lab Competition
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Showcase your innovative AI projects and compete for amazing prizes at Devfest 2025 London
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-gray-900">Submit Your Project</CardTitle>
              <CardDescription className="text-gray-600">
                Share your AI innovation with detailed information and screenshots
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-gray-900">Community Voting</CardTitle>
              <CardDescription className="text-gray-600">
                Get feedback and support from the developer community
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <CardTitle className="text-gray-900">Win Prizes</CardTitle>
              <CardDescription className="text-gray-600">
                Compete for 1st, 2nd, and 3rd place with exclusive rewards
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center space-y-6">
          {isAuthenticated ? (
            <div className="space-x-4">
              <Link href="/submit">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  Submit Your Project
                </Button>
              </Link>
              <Link href="/gallery">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                  View Submissions
                </Button>
              </Link>
            </div>
          ) : (
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              onClick={() => setShowAuthModal(true)}
            >
              Sign In to Submit
            </Button>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2025 Devfest London - AI Innovation Lab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

