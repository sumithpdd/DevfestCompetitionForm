"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { TagSelector } from "@/components/TagSelector";
import Link from "next/link";
import Image from "next/image";
import { UserNav } from "@/components/UserNav";
import { UserButton } from "@/components/UserButton";
import { ArrowLeft, Loader2, Users, Upload, Linkedin, Twitter, Facebook, Instagram, Globe } from "lucide-react";

export default function JoinMentorPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    linkedinUrl: "",
    twitterUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    websiteUrl: "",
    whyJoin: "",
    portfolio: "",
    hoursPerWeek: "",
    companyName: "",
    role: "",
  });

  const [interests, setInterests] = useState<string[]>([]);
  const [expertise, setExpertise] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Resume must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive",
        });
        return;
      }

      setResumeFile(file);
    }
  };

  const uploadResume = async (): Promise<string | null> => {
    if (!resumeFile || !user) return null;

    try {
      const resumeRef = ref(storage, `aidevcamp2026/mentors/${user.uid}/resume_${Date.now()}.${resumeFile.name.split('.').pop()}`);
      await uploadBytes(resumeRef, resumeFile);
      const downloadURL = await getDownloadURL(resumeRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading resume:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit your application",
        variant: "destructive",
      });
      return;
    }

    // Validation
    if (interests.length === 0 || expertise.length === 0 || techStack.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one item for interests, expertise, and tech stack",
        variant: "destructive",
      });
      return;
    }

    if (!resumeFile) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Check if user already applied
      const existingQuery = query(
        collection(db, "AIDevcamp2026Mentors"),
        where("userId", "==", user.uid)
      );
      const existingDocs = await getDocs(existingQuery);

      if (!existingDocs.empty) {
        toast({
          title: "Already Applied",
          description: "You have already submitted a mentor application",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Upload resume
      toast({
        title: "Uploading",
        description: "Uploading your resume...",
      });
      
      const resumeUrl = await uploadResume();

      if (!resumeUrl) {
        throw new Error("Failed to upload resume");
      }

      const applicationData = {
        ...formData,
        interests,
        expertise,
        techStack,
        resumeUrl,
        userId: user.uid,
        userEmail: user.email,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, "AIDevcamp2026Mentors"), applicationData);

      toast({
        title: "Success!",
        description: "Your mentor application has been submitted successfully",
      });

      router.push("/");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit your application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
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
              <UserNav />
              <UserButton />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <Card className="bg-white border-gray-200 shadow-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-3xl text-gray-900">Join as Mentor</CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                AI Devcamp 2026 - Starting Early 2026
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-900">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-900">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-900">Company Name *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    placeholder="Your current company"
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-900">Your Role *</Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Senior Software Engineer, ML Engineer"
                  />
                </div>

                {/* Social Links Section */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-900 text-lg font-semibold">Social Links (Optional)</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Connect your social profiles to showcase more about yourself
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* LinkedIn */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0">
                        <Linkedin className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="url"
                          placeholder="https://linkedin.com/in/username"
                          value={formData.linkedinUrl}
                          onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Twitter */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                        <Twitter className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="url"
                          placeholder="https://twitter.com/username"
                          value={formData.twitterUrl}
                          onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Facebook */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Facebook className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="url"
                          placeholder="https://facebook.com/username"
                          value={formData.facebookUrl}
                          onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Instagram */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                        <Instagram className="w-5 h-5 text-pink-500" />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="url"
                          placeholder="https://instagram.com/username"
                          value={formData.instagramUrl}
                          onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="url"
                          placeholder="https://yourwebsite.com"
                          value={formData.websiteUrl}
                          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Portfolio */}
                <div className="space-y-2">
                  <Label htmlFor="portfolio" className="text-gray-900">Portfolio</Label>
                  <Input
                    id="portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="Link to your portfolio or GitHub"
                  />
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label htmlFor="resume" className="text-gray-900">Resume *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      required
                      className="cursor-pointer"
                    />
                    {resumeFile && (
                      <span className="text-sm text-green-600 flex items-center">
                        <Upload className="w-4 h-4 mr-1" />
                        {resumeFile.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF or Word document, max 5MB
                  </p>
                </div>

                {/* Why Join */}
                <div className="space-y-2">
                  <Label htmlFor="whyJoin" className="text-gray-900">Why do you want to join this program? *</Label>
                  <Textarea
                    id="whyJoin"
                    name="whyJoin"
                    value={formData.whyJoin}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Tell us about your motivation and what you can offer..."
                  />
                </div>

                {/* Hours Per Week */}
                <div className="space-y-2">
                  <Label htmlFor="hoursPerWeek" className="text-gray-900">Hours you can spend per week *</Label>
                  <Input
                    id="hoursPerWeek"
                    name="hoursPerWeek"
                    type="number"
                    value={formData.hoursPerWeek}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 5"
                    min="1"
                  />
                </div>

                {/* Interests Tags */}
                <TagSelector
                  category="interests"
                  selectedTags={interests}
                  onChange={setInterests}
                  label="Your Interests"
                />

                {/* Expertise Tags */}
                <TagSelector
                  category="expertise"
                  selectedTags={expertise}
                  onChange={setExpertise}
                  label="Your Expertise"
                />

                {/* Tech Stack Tags */}
                <TagSelector
                  category="techStack"
                  selectedTags={techStack}
                  onChange={setTechStack}
                  label="Technology Stack"
                />

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Mentor Application"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}

