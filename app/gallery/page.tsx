"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Submission } from "@/types/submission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Github, Linkedin, Trophy, Twitter, Facebook, Instagram, Globe, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { UserNav } from "@/components/UserNav";
import { UserButton } from "@/components/UserButton";
import { useAuthContext } from "@/lib/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function GalleryPage() {
  const { isAuthenticated } = useAuthContext();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshots, setSelectedScreenshots] = useState<string[]>([]);
  const [showScreenshotDialog, setShowScreenshotDialog] = useState(false);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const q = query(collection(db, "DevFestComp2025"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Submission[];
        // Only show submitted items in gallery (not drafts)
        const submittedOnly = data.filter(sub => sub.status === "submitted");
        setSubmissions(submittedOnly);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const getPlaceBadge = (place?: "first" | "second" | "third" | null) => {
    if (!place) return null;
    
    const colors = {
      first: "bg-yellow-500 text-white",
      second: "bg-gray-400 text-white",
      third: "bg-orange-600 text-white",
    };

    const labels = {
      first: "🥇 1st Place",
      second: "🥈 2nd Place",
      third: "🥉 3rd Place",
    };

    return (
      <Badge className={`${colors[place]} font-semibold`}>
        {labels[place]}
      </Badge>
    );
  };

  const openScreenshotDialog = (screenshots: string[], index: number = 0) => {
    setSelectedScreenshots(screenshots);
    setCurrentScreenshotIndex(index);
    setShowScreenshotDialog(true);
  };

  const nextScreenshot = () => {
    setCurrentScreenshotIndex((prev) => 
      prev < selectedScreenshots.length - 1 ? prev + 1 : 0
    );
  };

  const prevScreenshot = () => {
    setCurrentScreenshotIndex((prev) => 
      prev > 0 ? prev - 1 : selectedScreenshots.length - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="inline-block">
            <Image 
              src="/devfest-london-logo.png" 
              alt="DevFest London 2025" 
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <>
                <UserNav />
                <UserButton />
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* AI Innovation Hub Banner */}
        <div className="mb-10 text-center">
          <Image 
            src="/AI_Innovation_Hub.png" 
            alt="AI Innovation Hub" 
            width={700}
            height={175}
            className="w-full max-w-2xl mx-auto h-auto rounded-lg shadow-md"
          />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Submissions</h1>
          <p className="text-xl text-gray-700">
            Explore innovative AI projects from Devfest 2025 participants
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-900 py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <Card className="bg-white border-gray-200 shadow-md">
            <CardContent className="py-20 text-center">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No submissions yet. Be the first to submit!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <Card key={submission.id} className="bg-white border-gray-200 shadow-md hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-gray-900 text-lg">{submission.fullName}</CardTitle>
                    {getPlaceBadge(submission.place)}
                  </div>
                  <p className="text-sm text-gray-500">
                    Submitted {submission.createdAt?.toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Photo Grid */}
                  {submission.screenshots && submission.screenshots.length > 0 && (
                    <div className="space-y-2">
                      {/* Main Photo */}
                      <div 
                        className="relative h-48 rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
                        onClick={() => openScreenshotDialog(submission.screenshots, 0)}
                      >
                        <Image
                          src={submission.screenshots[0]}
                          alt="Project screenshot"
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {submission.screenshots.length > 1 && (
                          <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                            {submission.screenshots.length} photos
                          </Badge>
                        )}
                      </div>

                      {/* Thumbnail Grid */}
                      {submission.screenshots.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                          {submission.screenshots.slice(0, 4).map((screenshot, idx) => (
                            <div
                              key={idx}
                              className="relative h-16 rounded overflow-hidden cursor-pointer hover:opacity-75 transition-opacity bg-gray-100"
                              onClick={() => openScreenshotDialog(submission.screenshots, idx)}
                            >
                              <Image
                                src={screenshot}
                                alt={`Thumbnail ${idx + 1}`}
                                width={100}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                              {submission.screenshots.length > 4 && idx === 3 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-semibold">
                                  +{submission.screenshots.length - 4}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <h4 className="text-gray-900 font-semibold mb-2">About the Project</h4>
                    <p className="text-gray-700 text-sm line-clamp-3">{submission.appPurpose}</p>
                  </div>

                  {/* Interests */}
                  {submission.interests && submission.interests.length > 0 && (
                    <div>
                      <h4 className="text-gray-900 font-semibold mb-2 text-sm">Interests</h4>
                      <div className="flex flex-wrap gap-1">
                        {submission.interests.slice(0, 3).map((interest, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {submission.interests.length > 3 && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                            +{submission.interests.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex gap-3 flex-wrap pt-2 border-t border-gray-100">
                    {submission.githubUrl && (
                      <a
                        href={submission.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span className="text-xs">GitHub</span>
                      </a>
                    )}
                    {submission.linkedinUrl && (
                      <a
                        href={submission.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="text-xs">LinkedIn</span>
                      </a>
                    )}
                    {submission.twitterUrl && (
                      <a
                        href={submission.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                        <span className="text-xs">Twitter</span>
                      </a>
                    )}
                    {submission.facebookUrl && (
                      <a
                        href={submission.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                        <span className="text-xs">Facebook</span>
                      </a>
                    )}
                    {submission.instagramUrl && (
                      <a
                        href={submission.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700 transition-colors"
                      >
                        <Instagram className="w-4 h-4" />
                        <span className="text-xs">Instagram</span>
                      </a>
                    )}
                    {submission.websiteUrl && (
                      <a
                        href={submission.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span className="text-xs">Website</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Screenshot Dialog */}
      <Dialog open={showScreenshotDialog} onOpenChange={setShowScreenshotDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Screenshot {currentScreenshotIndex + 1} of {selectedScreenshots.length}
            </DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Image
              src={selectedScreenshots[currentScreenshotIndex]}
              alt={`Screenshot ${currentScreenshotIndex + 1}`}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
            {selectedScreenshots.length > 1 && (
              <div className="flex justify-between mt-4">
                <Button onClick={prevScreenshot} variant="outline">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <div className="flex gap-2">
                  {selectedScreenshots.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentScreenshotIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentScreenshotIndex ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <Button onClick={nextScreenshot} variant="outline">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
