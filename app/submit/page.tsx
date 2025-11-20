"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, updateDoc, doc, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Upload, X, Loader2, Save, Plus, Twitter, Facebook, Instagram, Globe, Linkedin } from "lucide-react";
import { TagSelector } from "@/components/TagSelector";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { UserNav } from "@/components/UserNav";
import { UserButton } from "@/components/UserButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function SubmitPage() {
  const { user, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingSubmissionId, setExistingSubmissionId] = useState<string | null>(null);
  const [existingScreenshots, setExistingScreenshots] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    email: user?.email || "",
    githubUrl: "",
    appPurpose: "",
    linkedinUrl: "",
    twitterUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    websiteUrl: "",
  });

  const [interests, setInterests] = useState<string[]>([]);
  const [expertise, setExpertise] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);

  // Load existing draft submission if exists
  useEffect(() => {
    const loadDraft = async () => {
      if (!user) return;
      
      try {
        const q = query(
          collection(db, "DevFestComp2025"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const existingDoc = querySnapshot.docs[0];
          const data = existingDoc.data();
          
          setExistingSubmissionId(existingDoc.id);
          setFormData({
            fullName: data.fullName || "",
            email: data.email || "",
            githubUrl: data.githubUrl || "",
            appPurpose: data.appPurpose || "",
            linkedinUrl: data.linkedinUrl || "",
            twitterUrl: data.twitterUrl || "",
            facebookUrl: data.facebookUrl || "",
            instagramUrl: data.instagramUrl || "",
            websiteUrl: data.websiteUrl || "",
          });
          
          if (data.interests && data.interests.length > 0) {
            setInterests(data.interests);
          }
          if (data.expertise && data.expertise.length > 0) {
            setExpertise(data.expertise);
          }
          if (data.techStack && data.techStack.length > 0) {
            setTechStack(data.techStack);
          }
          
          if (data.screenshots && data.screenshots.length > 0) {
            setExistingScreenshots(data.screenshots);
          }
          
          toast({
            title: "Draft Loaded",
            description: "Your previous submission has been loaded. You can continue editing.",
          });
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    };
    
    if (user) {
      loadDraft();
    }
  }, [user, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + screenshots.length > 5) {
      toast({
        title: "Too many files",
        description: "You can upload a maximum of 5 screenshots",
        variant: "destructive",
      });
      return;
    }

    setScreenshots([...screenshots, ...files]);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeScreenshot = (index: number) => {
    const newScreenshots = screenshots.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to free up memory
    URL.revokeObjectURL(previewUrls[index]);
    
    setScreenshots(newScreenshots);
    setPreviewUrls(newPreviewUrls);
  };

  const uploadScreenshots = async () => {
    const urls: string[] = [];
    
    try {
      for (const file of screenshots) {
        console.log(`Uploading file: ${file.name}, size: ${file.size} bytes`);
        const storageRef = ref(storage, `devfest2025Comp/${Date.now()}_${file.name}`);
        console.log(`Storage path: devfest2025Comp/${Date.now()}_${file.name}`);
        
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
        console.log(`Successfully uploaded: ${file.name}`);
      }
      
      return urls;
    } catch (error: any) {
      console.error("❌ Upload error details:", {
        message: error?.message,
        code: error?.code,
        serverResponse: error?.serverResponse,
        customData: error?.customData,
        fullError: error
      });
      
      // Re-throw with the actual error details for better debugging
      throw error;
    }
  };

  const saveDraft = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your draft",
        variant: "destructive",
      });
      return;
    }

    setSavingDraft(true);

    try {
      // Upload new screenshots if any
      let screenshotUrls = [...existingScreenshots];
      if (screenshots.length > 0) {
        const newUrls = await uploadScreenshots();
        screenshotUrls = [...screenshotUrls, ...newUrls];
      }

      const submissionData = {
        ...formData,
        screenshots: screenshotUrls,
        interests: interests,
        expertise: expertise,
        techStack: techStack,
        userId: user.uid,
        userEmail: user.email,
        updatedAt: new Date(),
        status: "draft",
        place: null,
      };

      if (existingSubmissionId) {
        // Update existing draft
        await updateDoc(doc(db, "DevFestComp2025", existingSubmissionId), submissionData);
      } else {
        // Create new draft
        const docRef = await addDoc(collection(db, "DevFestComp2025"), {
          ...submissionData,
          createdAt: new Date(),
        });
        setExistingSubmissionId(docRef.id);
      }

      toast({
        title: "Draft Saved",
        description: "Your progress has been saved. You can continue later.",
      });

      // Update existing screenshots
      setExistingScreenshots(screenshotUrls);
      // Clear new screenshots
      setScreenshots([]);
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
    } catch (error: any) {
      console.error("Error saving draft:", error);
      const errorMessage = error?.message || "Failed to save draft. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit your project",
        variant: "destructive",
      });
      return;
    }

    if (screenshots.length === 0 && existingScreenshots.length === 0) {
      toast({
        title: "Screenshots required",
        description: "Please upload at least one screenshot",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload new screenshots if any
      let screenshotUrls = [...existingScreenshots];
      if (screenshots.length > 0) {
        const newUrls = await uploadScreenshots();
        screenshotUrls = [...screenshotUrls, ...newUrls];
      }

      const submissionData = {
        ...formData,
        screenshots: screenshotUrls,
        interests: interests,
        expertise: expertise,
        techStack: techStack,
        userId: user.uid,
        userEmail: user.email,
        updatedAt: new Date(),
        status: "submitted",
        place: null,
      };

      if (existingSubmissionId) {
        // Update existing submission
        await updateDoc(doc(db, "DevFestComp2025", existingSubmissionId), submissionData);
      } else {
        // Create new submission
        await addDoc(collection(db, "DevFestComp2025"), {
          ...submissionData,
          createdAt: new Date(),
        });
      }

      toast({
        title: "Success!",
        description: "Your project has been submitted successfully",
      });

      // Clean up preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));

      router.push("/gallery");
    } catch (error: any) {
      console.error("❌ Error submitting form:", {
        message: error?.message,
        code: error?.code,
        serverResponse: error?.serverResponse,
        customData: error?.customData,
        stack: error?.stack,
        fullError: error
      });
      
      // Provide specific error message
      let errorMessage = "Failed to submit your project. ";
      let debugInfo = "";
      
      if (error?.code === 'storage/unauthorized') {
        errorMessage += "Storage permission denied. Please check Firebase Storage rules.";
        debugInfo = `Error code: ${error.code}`;
      } else if (error?.code === 'permission-denied') {
        errorMessage += "Database permission denied. Please check Firestore rules.";
        debugInfo = `Error code: ${error.code}`;
      } else if (error?.code) {
        errorMessage += `Firebase Error: ${error.code}`;
        debugInfo = error.message || "No additional details";
      } else if (error?.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Unknown error. Please check browser console (F12) for details.";
      }
      
      toast({
        title: "Submission Failed",
        description: (
          <div className="space-y-1">
            <p>{errorMessage}</p>
            {debugInfo && <p className="text-xs opacity-70 mt-1">{debugInfo}</p>}
            <p className="text-xs opacity-60 mt-2">Check browser console (F12) for full error details.</p>
          </div>
        ),
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
        {/* AI Innovation Hub Banner */}
        <div className="mb-8 text-center">
          <Image 
            src="/AI_Innovation_Hub.png" 
            alt="AI Innovation Hub" 
            width={600}
            height={150}
            className="w-full max-w-xl mx-auto h-auto rounded-lg shadow-md"
          />
        </div>

        <Card className="bg-white border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-3xl text-gray-900">Submit Your Project</CardTitle>
            <CardDescription className="text-gray-600">
              Share your AI innovation project for the Devfest 2025 London competition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-900">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl" className="text-gray-900">GitHub URL *</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  placeholder="https://github.com/username/repo"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  required
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appPurpose" className="text-gray-900">App Purpose *</Label>
                <Textarea
                  id="appPurpose"
                  placeholder="Tell us about your AI innovation project..."
                  value={formData.appPurpose}
                  onChange={(e) => setFormData({ ...formData, appPurpose: e.target.value })}
                  required
                  className="bg-white border-gray-300 text-gray-900 min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="screenshots" className="text-gray-900">Screenshots * (Max 5)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-100">
                  <input
                    id="screenshots"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="screenshots"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-gray-700">Click to upload screenshots</span>
                    <span className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB each</span>
                  </label>
                </div>

                {/* Existing screenshots */}
                {existingScreenshots.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Existing Screenshots:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {existingScreenshots.map((url, index) => (
                        <div key={`existing-${index}`} className="relative group">
                          <Image
                            src={url}
                            alt={`Existing Screenshot ${index + 1}`}
                            width={200}
                            height={128}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newScreenshots = existingScreenshots.filter((_, i) => i !== index);
                              setExistingScreenshots(newScreenshots);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New screenshots */}
                {previewUrls.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">New Screenshots:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={`new-${index}`} className="relative group">
                          <Image
                            src={url}
                            alt={`New Screenshot ${index + 1}`}
                            width={200}
                            height={128}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeScreenshot(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Interests Section */}
              <TagSelector
                category="interests"
                selectedTags={interests}
                onChange={setInterests}
                label="Your Interests"
              />

              {/* Expertise Section */}
              <TagSelector
                category="expertise"
                selectedTags={expertise}
                onChange={setExpertise}
                label="Your Expertise"
              />

              {/* Tech Stack Section */}
              <TagSelector
                category="techStack"
                selectedTags={techStack}
                onChange={setTechStack}
                label="Technology Stack"
              />

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

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={saveDraft}
                  disabled={savingDraft || loading}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  {savingDraft ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </>
                  )}
                </Button>
                
                <Button
                  type="submit"
                  disabled={loading || savingDraft}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Project"
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

