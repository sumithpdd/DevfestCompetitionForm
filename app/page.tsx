"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Upload, Users, GraduationCap, Users as MentorIcon } from "lucide-react";
import { UserNav } from "@/components/UserNav";
import { UserButton } from "@/components/UserButton";
import { AuthModal } from "@/components/AuthModal";
import { useAuthContext } from "@/lib/AuthContext";
import { useState } from "react";

export default function Home() {
  const { isAuthenticated, loading } = useAuthContext();
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
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : isAuthenticated ? (
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

        {/* AI Devcamp 2026 Section */}
        <div className="mt-20 pt-16 border-t-2 border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🚀 AI Devcamp 2026
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-2">
              Join our mentorship program starting early 2026
            </p>
            <p className="text-gray-600">
              Connect with industry experts and aspiring developers in the AI space
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Mentee Card */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-center text-gray-900">Join as Mentee</CardTitle>
                <CardDescription className="text-center text-gray-700">
                  Learn from experienced professionals and accelerate your AI journey
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>✓ Get paired with industry mentors</li>
                  <li>✓ Work on real-world AI projects</li>
                  <li>✓ Build your portfolio</li>
                  <li>✓ Network with peers</li>
                </ul>
                {isAuthenticated ? (
                  <Link href="/join-mentee">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
                      Apply as Mentee
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white" 
                    size="lg"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Sign In to Apply
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Mentor Card */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <MentorIcon className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-center text-gray-900">Join as Mentor</CardTitle>
                <CardDescription className="text-center text-gray-700">
                  Share your expertise and help shape the next generation of AI developers
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>✓ Guide aspiring developers</li>
                  <li>✓ Give back to the community</li>
                  <li>✓ Expand your network</li>
                  <li>✓ Enhance your leadership skills</li>
                </ul>
                {isAuthenticated ? (
                  <Link href="/join-mentor">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="lg">
                      Apply as Mentor
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
                    size="lg"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Sign In to Apply
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
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

